package com.quokka.post_service.service;

import com.quokka.event.dto.PostEvent;
import com.quokka.post_service.constant.PostStatus;
import com.quokka.post_service.constant.ReactionType;
import com.quokka.post_service.dto.response.PostListResponse;
import com.quokka.post_service.dto.response.PostResponse;
import com.quokka.post_service.dto.response.UserProfileResponse;
import com.quokka.post_service.entity.Post;
import com.quokka.post_service.mapper.PostMapper;
import com.quokka.post_service.repository.CategoryRepository;
import com.quokka.post_service.repository.PostReactionRepository;
import com.quokka.post_service.repository.httpClient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;


@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostResponseFactory {

    PostMapper postMapper;
    DateTimeFormatter dateTimeFormatter;
    ProfileClient profileClient;
    CategoryRepository categoryRepository;
    PostReactionRepository postReactionRepository;

    /** Helper: enrich PostResponse (categoryName + created + username nếu cần) */
    public PostResponse toPostResponse(Post post) {
        PostResponse response = postMapper.toPostResponse(post);

        // Lấy categoryName từ categoryId
        String categoryName = categoryRepository.findById(post.getCategoryId())
                .map(c -> c.getName())
                .orElse(null);
        response.setCategoryName(categoryName);

        // Format ngày
        response.setCreated(dateTimeFormatter.format(post.getCreatedDate()));

        // Lấy username từ Profile service
        try {
            UserProfileResponse userProfile = profileClient.getProfile(post.getUserId()).getResult();
            response.setUsername(userProfile.getUsername());
        } catch (Exception e) {
            log.error("Error while getting user profile", e);
        }

        // Đếm lượt like & dislike
        long likeCount = postReactionRepository.countByPostIdAndType(post.getId(), ReactionType.LIKE);
        long dislikeCount = postReactionRepository.countByPostIdAndType(post.getId(), ReactionType.DISLIKE);

        response.setLikeCount(likeCount);
        response.setDislikeCount(dislikeCount);

        return response;
    }


    public PostListResponse toPostListResponse(Post post) {
        PostListResponse response = postMapper.toPostListResponse(post);

        // Lấy categoryName từ categoryId
        String categoryName = categoryRepository.findById(post.getCategoryId())
                .map(c -> c.getName())
                .orElse(null);
        response.setCategoryName(categoryName);

        // Format ngày
        response.setCreated(dateTimeFormatter.format(post.getCreatedDate()));

        // Lấy username từ Profile service
        try {
            UserProfileResponse userProfile = profileClient.getProfile(post.getUserId()).getResult();
            response.setUsername(userProfile.getUsername());
        } catch (Exception e) {
            log.error("Error while getting user profile", e);
        }

        // Đếm lượt like & dislike
        long likeCount = postReactionRepository.countByPostIdAndType(post.getId(), ReactionType.LIKE);
        long dislikeCount = postReactionRepository.countByPostIdAndType(post.getId(), ReactionType.DISLIKE);

        response.setLikeCount(likeCount);
        response.setDislikeCount(dislikeCount);

        return response;
    }

    public PostEvent toEvent(Post entity) {
        // Lấy categoryName từ categoryId
        String categoryName = categoryRepository.findById(entity.getCategoryId())
                .map(c -> c.getName())
                .orElse(null);

        return PostEvent.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .username(entity.getUsername())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .content(entity.getContent())
                .categoryName(categoryName)
                .thumbnailUrl(entity.getThumbnailUrl())
                .thumbnailFileName(entity.getThumbnailFileName())

                // created (String) -> format ngày cho UI (yyyy-MM-dd)
                .created(entity.getCreatedDate() != null
                        ? dateTimeFormatter.format(entity.getCreatedDate())
                        : "")

                // createdDate (Instant) -> chuẩn UTC ISO-8601
                .createdDate(entity.getCreatedDate() != null
                        ? entity.getCreatedDate()
                        : Instant.now())

                .modifiedDate(entity.getModifiedDate() != null
                        ? entity.getModifiedDate()
                        : Instant.now())

                .tags(entity.getTags())
                .views(entity.getViews())
                // Nếu Post entity chưa có sẵn like/dislike thì để 0 hoặc query repository
                .likeCount(0L)
                .dislikeCount(0L)
                .status(entity.getStatus() != null ? entity.getStatus() : PostStatus.DRAFT)
                .build();
    }

}
