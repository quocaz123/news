package com.quokka.post_service.service.event;

import com.quokka.event.dto.PostEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PostEventPublisher {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.topics.postCreated}") private String topicCreated;
    @Value("${app.topics.postUpdated}") private String topicUpdated;
    @Value("${app.topics.postDeleted}") private String topicDeleted;

    public void publishCreated(PostEvent e) { kafkaTemplate.send(topicCreated, e.getId(), e); }
    public void publishUpdated(PostEvent e) { kafkaTemplate.send(topicUpdated, e.getId(), e); }
    public void publishDeleted(String id)   { kafkaTemplate.send(topicDeleted, id, Map.of("id", id)); }
}