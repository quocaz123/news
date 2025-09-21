package com.quokka.post_service.repository;

import com.quokka.post_service.constant.PostStatus;
import com.quokka.post_service.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findAllByUserId(String userId, Pageable pageable);

    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    long countByCategoryId(String categoryId);

    // Methods for dashboard statistics
    long countByStatus(PostStatus status);
}
