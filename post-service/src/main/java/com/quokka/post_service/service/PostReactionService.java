package com.quokka.post_service.service;

import com.quokka.post_service.constant.ReactionType;
import com.quokka.post_service.entity.PostReaction;
import com.quokka.post_service.repository.PostReactionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostReactionService {

    PostReactionRepository postReactionRepository;
    public void reactToPost(String postId, ReactionType reactionType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        // Tìm reaction của user
        PostReaction reaction = postReactionRepository.findByPostIdAndUserId(postId, userId).orElse(null);

        if (reaction == null) {
            // Nếu chưa có → tạo mới
            reaction = PostReaction.builder()
                    .postId(postId)
                    .userId(userId)
                    .type(reactionType)
                    .build();
        } else {
            // Nếu user ấn lại cùng reaction → bỏ vote
            if (reaction.getType() == reactionType) {
                postReactionRepository.delete(reaction);
                return;
            }
            // Nếu khác loại → đổi sang reaction mới
            reaction.setType(reactionType);
        }

        postReactionRepository.save(reaction);
    }



}
