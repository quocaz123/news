package com.quokka.post_service.dto.response;


import com.quokka.post_service.constant.PostStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostListResponse {
    String id;
    String username;
    String title;
    String description;
    String categoryName;
    List<String> tags;
    String thumbnailUrl;
    String thumbnailFileName;
    String created;
    Instant createdDate;

    long views;
    long likeCount;
    long dislikeCount;
}
