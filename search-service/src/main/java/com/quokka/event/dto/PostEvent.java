package com.quokka.event.dto;


import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostEvent {
    String id;
    String userId;
    String username;
    String title;
    String description;
    String content;
    String categoryName;
    String thumbnailUrl;
    String thumbnailFileName;

    // Ngày hiển thị (UI friendly, ví dụ: "2025-09-13")
    String created;

    // Ngày lưu DB chuẩn ISO-8601 UTC
    Instant createdDate;
    Instant modifiedDate;

    List<String> tags;
    String status;

    long views;
    long likeCount;
    long dislikeCount;
}
