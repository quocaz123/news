package com.quokka.post_service.entity;

import com.quokka.post_service.constant.PostStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@Document(value = "post")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    @MongoId
    String id;
    String userId;
    String username;
    String title;
    String description;
    String content;
    String categoryId;
    String thumbnailUrl;
    String thumbnailFileName;
    List<String> tags;
    PostStatus status;
    Instant createdDate;
    Instant modifiedDate;

    @Builder.Default
    long views = 0;
}
