package com.quokka.post_service.repository;

import com.quokka.post_service.constant.ReactionType;
import com.quokka.post_service.entity.PostReaction;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PostReactionRepository extends MongoRepository<PostReaction, String> {
    Optional<PostReaction> findByPostIdAndUserId(String postId, String userId);

    long countByPostIdAndType(String postId, ReactionType type);

    // Method for dashboard statistics - count total likes for user's posts
    long countByType(ReactionType type);

    // Count likes for specific user's posts
    long countByPostIdInAndType(java.util.List<String> postIds, ReactionType type);
}
