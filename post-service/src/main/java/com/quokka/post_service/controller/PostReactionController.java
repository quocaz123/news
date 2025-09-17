package com.quokka.post_service.controller;

import com.quokka.post_service.constant.ReactionType;
import com.quokka.post_service.dto.ApiResponse;
import com.quokka.post_service.service.PostReactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/{postId}/reactions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostReactionController {
    PostReactionService postReactionService;

    @PostMapping("/like")
    public ApiResponse<Void> like(@PathVariable String postId) {
        postReactionService.reactToPost(postId, ReactionType.LIKE);
        return ApiResponse.<Void>builder()
                .message("Post liked successfully")
                .build();
    }

    @PostMapping("/dislike")
    public ApiResponse<Void> dislike(@PathVariable String postId) {
        postReactionService.reactToPost(postId, ReactionType.DISLIKE);
        return ApiResponse.<Void>builder()
                .message("Post disliked successfully")
                .build();
    }

}
