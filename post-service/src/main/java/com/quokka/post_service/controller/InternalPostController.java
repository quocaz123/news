package com.quokka.post_service.controller;

import com.quokka.post_service.dto.ApiResponse;
import com.quokka.post_service.dto.PageResponse;
import com.quokka.post_service.dto.response.PostListResponse;
import com.quokka.post_service.dto.response.PostResponse;
import com.quokka.post_service.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal/publish")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalPostController {

    PostService postService;

    @GetMapping
    public ApiResponse<PageResponse<PostListResponse>> getAllPublishedPosts(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {

        return ApiResponse.<PageResponse<PostListResponse>>builder()
                .result(postService.getAllPublishedPosts(page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPublishedPostById(@PathVariable("id") String id) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPublishedPostById(id))
                .build();
    }

}
