package com.quokka.post_service.entity;

import com.quokka.post_service.constant.ReactionType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "post_reactions")
// Tạo unique index cho (postId, userId) để 1 user chỉ được 1 reaction / 1 bài
@CompoundIndex(name = "post_user_idx", def = "{'postId': 1, 'userId': 1}", unique = true)
public class PostReaction {
    @Id
    private String id;

    private String postId;
    private String userId;
    private ReactionType type; // LIKE hoặc DISLIKE
}
