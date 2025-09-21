package com.quokka.post_service.service;

import com.quokka.post_service.constant.PostStatus;
import com.quokka.post_service.constant.ReactionType;
import com.quokka.post_service.dto.ApiResponse;
import com.quokka.post_service.dto.PageResponse;
import com.quokka.post_service.dto.request.PostRequest;
import com.quokka.post_service.dto.response.DashboardStatsResponse;
import com.quokka.post_service.dto.response.FileResponse;
import com.quokka.post_service.dto.response.PostListResponse;
import com.quokka.post_service.dto.response.PostResponse;
import com.quokka.post_service.dto.response.UserProfileResponse;
import com.quokka.post_service.entity.Post;
import com.quokka.post_service.repository.PostRepository;
import com.quokka.post_service.repository.PostReactionRepository;
import com.quokka.post_service.repository.httpClient.FileClient;
import com.quokka.post_service.repository.httpClient.ProfileClient;
import com.quokka.post_service.service.event.PostEventPublisher;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostReactionRepository postReactionRepository;
    FileClient fileClient;
    ProfileClient profileClient;
    PostResponseFactory postResponseFactory;
    PostEventPublisher postEventPublisher;

    public PostResponse createPost(PostRequest request, MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        // Xử lý upload file nếu có
        String thumbnailUrl = null;
        String thumbnailFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                ApiResponse<FileResponse> fileResponse = fileClient.uploadMedia(file);
                FileResponse fileResult = fileResponse.getResult();
                thumbnailUrl = fileResult.getUrl();
                thumbnailFileName = fileResult.getOriginalFileName();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload file", e);
            }
        }

        UserProfileResponse userProfile = null;
        try {
            userProfile = profileClient.getProfile(userId).getResult();
        } catch (Exception e) {
            log.error("Error while getting user profile", e);
        }

        String username = userProfile != null ? userProfile.getUsername() : null;
        PostStatus status = request.getStatus() != null ? request.getStatus() : PostStatus.DRAFT;

        Post post = Post.builder()
                .username(username)
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .tags(request.getTags())
                .thumbnailUrl(thumbnailUrl)
                .thumbnailFileName(thumbnailFileName)
                .userId(userId)
                .status(status)
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .build();

        post = postRepository.save(post);
        // Kafka event
        postEventPublisher.publishCreated(postResponseFactory.toEvent(post));
        return postResponseFactory.toPostResponse(post);
    }

    public PageResponse<PostResponse> getMyPosts(int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Sort sort = Sort.by("createdDate").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var pageData = postRepository.findAllByUserId(userId, pageable);

        var postList = pageData.getContent().stream()
                .map(postResponseFactory::toPostResponse)
                .toList();

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    public PostResponse updatePost(String id, PostRequest request, MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Post post = postRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this post");
        }

        if (post.getStatus() == PostStatus.DELETED) {
            throw new RuntimeException("Cannot update a deleted post");
        }

        // Xử lý upload file nếu có
        String thumbnailUrl = null;
        String thumbnailFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                ApiResponse<FileResponse> fileResponse = fileClient.uploadMedia(file);
                FileResponse fileResult = fileResponse.getResult();
                thumbnailUrl = fileResult.getUrl();
                thumbnailFileName = fileResult.getOriginalFileName();
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload file", e);
            }
        }

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setContent(request.getContent());
        post.setCategoryId(request.getCategoryId());
        post.setTags(request.getTags());
        post.setThumbnailUrl(thumbnailUrl);
        post.setThumbnailFileName(thumbnailFileName);
        post.setModifiedDate(Instant.now());

        post = postRepository.save(post);

        postEventPublisher.publishUpdated(postResponseFactory.toEvent(post));
        return postResponseFactory.toPostResponse(post);
    }

    public PostResponse publishPost(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Post post = postRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this post");
        }

        post.setStatus(PostStatus.PUBLISHED);
        post.setModifiedDate(Instant.now());

        post = postRepository.save(post);
        return postResponseFactory.toPostResponse(post);
    }

    public PostResponse getMyPostById(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to view this post");
        }

        if (post.getStatus() == PostStatus.DELETED) {
            throw new RuntimeException("This post has been deleted");
        }

        return postResponseFactory.toPostResponse(post);
    }

    // public void deletePost(String id) {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String userId = authentication.getName();
    //
    // Post post = postRepository.findById(id).orElseThrow(
    // () -> new RuntimeException("Post not found"));
    //
    // if (!post.getUserId().equals(userId)) {
    // throw new RuntimeException("You are not authorized to delete this post");
    // }
    //
    // if (post.getStatus() == PostStatus.DELETED) {
    // throw new RuntimeException("Post is already deleted");
    // }
    //
    // post.setStatus(PostStatus.DELETED);
    // post.setModifiedDate(Instant.now());
    //
    // postRepository.save(post);
    // }

    public void deletePost(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Post post = postRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        // Publish event trước khi xóa
        postEventPublisher.publishDeleted(id);

        // Xóa thật sự khỏi database
        postRepository.delete(post);
    }

    // Lấy danh sách bài viết đã xuất bản
    public PageResponse<PostListResponse> getAllPublishedPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdDate").descending());
        var pageData = postRepository.findByStatus(PostStatus.PUBLISHED, pageable);

        var postList = pageData.getContent().stream()
                .map(postResponseFactory::toPostListResponse)
                .toList();

        return PageResponse.<PostListResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    // Lấy chi tiết bài viết (chỉ PUBLISHED mới cho user thường xem)
    public PostResponse getPublishedPostById(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getStatus() != PostStatus.PUBLISHED) {
            throw new RuntimeException("Post not published yet");
        }

        // Tăng lượt xem
        post.setViews(post.getViews() + 1);
        post = postRepository.save(post);
        log.info("Post {} views: {}", post.getId(), post.getViews());

        return postResponseFactory.toPostResponse(post);
    }

    // Dashboard statistics for current user
    public DashboardStatsResponse getDashboardStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        // Get all posts by user (single query)
        var userPosts = postRepository.findAllByUserId(userId,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE));
        var posts = userPosts.getContent();

        // Count total posts by user
        long totalPosts = posts.size();

        // Count published posts by user
        long publishedPosts = posts.stream()
                .filter(post -> post.getStatus() == PostStatus.PUBLISHED)
                .count();

        // Calculate total views for user's posts
        long totalViews = posts.stream()
                .mapToLong(Post::getViews)
                .sum();

        // Calculate average views per post
        double averageViewsPerPost = totalPosts > 0 ? (double) totalViews / totalPosts : 0.0;

        // Count total likes for user's posts
        var postIds = posts.stream()
                .map(Post::getId)
                .toList();

        long totalLikes = postReactionRepository.countByPostIdInAndType(postIds, ReactionType.LIKE);

        return DashboardStatsResponse.builder()
                .totalPosts(totalPosts)
                .publishedPosts(publishedPosts)
                .totalViews(totalViews)
                .averageViewsPerPost(averageViewsPerPost)
                .totalLikes(totalLikes)
                .build();
    }
}
