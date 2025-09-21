package com.quokka.post_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardStatsResponse {
    Long totalPosts;
    Long publishedPosts;
    Long totalViews;
    Double averageViewsPerPost;
    Long totalLikes;
}

