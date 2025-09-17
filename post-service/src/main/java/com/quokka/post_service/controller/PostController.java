package com.quokka.post_service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quokka.post_service.dto.ApiResponse;
import com.quokka.post_service.dto.PageResponse;
import com.quokka.post_service.dto.request.PostRequest;
import com.quokka.post_service.dto.response.PostResponse;
import com.quokka.post_service.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostController {
    PostService postService;

    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    @PostMapping(value = "/create")
    public ApiResponse<PostResponse> createPost(@RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "post") String postJson) {
        ObjectMapper mapper = new ObjectMapper();
        PostRequest request;
        try {
            request = mapper.readValue(postJson, PostRequest.class);
        } catch (JsonProcessingException e) {
            log.error("Error parsing post request", e);
            throw new RuntimeException("Invalid post data format");
        }
        try {
            return ApiResponse.<PostResponse>builder()
                    .result(postService.createPost(request, file))
                    .build();
        } catch (Exception e) {
            log.error("Error creating post", e);
            throw e;
        }
    }

    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    @GetMapping("/my-posts")
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getMyPosts(page, size))
                .build();
    }

    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    @GetMapping("me/{id}")
    public ApiResponse<PostResponse> getMyPostById(@PathVariable("id") String id) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getMyPostById(id))
                .build();
    }

    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<PostResponse> updatePost(@PathVariable("id") String id,
            @RequestBody PostRequest request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.updatePost(id, request))
                .build();
    }

    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> deletePost(@PathVariable("id") String id) {
        postService.deletePost(id);
        return ApiResponse.<String>builder()
                .result("Post deleted successfully")
                .build();
    }

}
