package com.quokka.search_service.consumer;

import com.quokka.event.dto.PostEvent;
import com.quokka.search_service.model.PostDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostEventConsumer {

    private final ElasticsearchOperations operations;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "${app.topics.postCreated}", groupId = "${spring.kafka.consumer.group-id}")
    public void onPostCreated(PostEvent e) {
        upsert(e);
    }

    @KafkaListener(topics = "${app.topics.postUpdated}", groupId = "${spring.kafka.consumer.group-id}")
    public void onPostUpdated(PostEvent e) {
        upsert(e);
    }

    @KafkaListener(topics = "${app.topics.postDeleted}", groupId = "${spring.kafka.consumer.group-id}")
    public void onPostDeleted(PostEvent e) {
        if (e.getId() == null) return;
        try {
            operations.delete(e.getId(), PostDocument.class);
            log.info("Deleted document id={}", e.getId());
            messagingTemplate.convertAndSend("/topic/posts",
                    Map.of("type", "deleted", "id", e.getId()));
        } catch (Exception ex) {
            log.error("Failed to delete id={} payload={}", e.getId(), e, ex);
            throw ex;
        }
    }

    private void upsert(PostEvent e) {
        try {
            PostDocument d = new PostDocument();
            d.setId(e.getId());
            d.setTitle(e.getTitle());
            d.setDescription(e.getDescription());
            d.setCategoryName(e.getCategoryName());
            d.setUsername(e.getUsername());
            d.setThumbnailUrl(e.getThumbnailUrl());
            d.setThumbnailFileName(e.getThumbnailFileName());
            d.setCreated(e.getCreated());
            d.setCreatedDate(e.getCreatedDate());
            d.setTags(e.getTags());
            d.setViews((int) e.getViews());
            d.setLikeCount((int) e.getLikeCount());
            d.setDislikeCount((int) e.getDislikeCount());

            operations.save(d);
            log.info("Upserted document id={}", d.getId());

            messagingTemplate.convertAndSend("/topic/posts",
                    Map.of("type", "upsert", "post", d));
        } catch (Exception ex) {
            log.error("Failed to upsert payload={}", e, ex);
            throw ex;
        }
    }
}
