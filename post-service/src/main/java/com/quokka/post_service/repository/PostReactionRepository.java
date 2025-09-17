package com.quokka.post_service.repository;

import com.quokka.post_service.constant.ReactionType;
import com.quokka.post_service.entity.PostReaction;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PostReactionRepository extends MongoRepository<PostReaction, String> {
    Optional<PostReaction> findByPostIdAndUserId(String postId, String userId);
    long countByPostIdAndType(String postId, ReactionType type);
}
