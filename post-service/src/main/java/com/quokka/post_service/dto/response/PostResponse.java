package com.quokka.post_service.dto.response;


import com.quokka.post_service.constant.PostStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String id;
    String userId;
    String username;
    String title;
    String description;
    String content;
    String categoryName;
    List<String> tags;
    PostStatus status;
    String thumbnailUrl;
    String thumbnailFileName;
    String created;
    Instant createdDate;
    Instant modifiedDate;

    long views;
    long likeCount;
    long dislikeCount;
}
