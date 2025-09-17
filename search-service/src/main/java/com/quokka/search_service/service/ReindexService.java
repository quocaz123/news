package com.quokka.search_service.service;

import com.quokka.search_service.model.PostDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReindexService {

    private final WebClient postServiceClient;
    private final ElasticsearchOperations operations;

    @Value("${app.index.posts}")
    private String postsIndex;

    /**
     * Reindex toàn bộ bài viết từ post-service vào Elasticsearch.
     */
    public int reindexAll(int pageSize) {
        int page = 1;
        int totalSaved = 0;
        while (true) {
            List<PostDocument> batch = fetchPage(page, pageSize);
            if (batch.isEmpty())
                break;

            operations.save(batch, IndexCoordinates.of(postsIndex));
            totalSaved += batch.size();

            log.info("Indexed page {} with {} documents (total={})", page, batch.size(), totalSaved);
            page++;
        }
        return totalSaved;
    }

    @SuppressWarnings("unchecked")
    private List<PostDocument> fetchPage(int page, int size) {
        // Expect post-service endpoint returns { result: { data: [...], totalPages, ...
        // } }
        Mono<Map> mono = postServiceClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/internal/publish")
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .build())
                .retrieve()
                .bodyToMono(Map.class);

        Map<String, Object> resp = mono.block();
        if (resp == null)
            return List.of();

        Object resultObj = resp.get("result");
        if (!(resultObj instanceof Map<?, ?> result))
            return List.of();

        Object dataObj = result.get("data");
        if (!(dataObj instanceof List<?> list))
            return List.of();

        List<PostDocument> docs = new ArrayList<>();
        for (Object o : list) {
            if (!(o instanceof Map<?, ?> m))
                continue;

            PostDocument d = new PostDocument();
            d.setId(String.valueOf(m.get("id")));
            d.setTitle(str(m.get("title"), ""));
            d.setDescription(str(m.get("description"), ""));
            d.setCategoryName(str(m.get("categoryName"), ""));
            d.setUsername(str(m.get("username"), ""));
            d.setThumbnailUrl(str(m.get("thumbnailUrl"), ""));
            d.setThumbnailFileName(str(m.get("thumbnailFileName"), ""));
            d.setCreated(str(m.get("created"), ""));

            // createdDate (UTC ISO-8601)
            Object ts = m.get("createdDate");
            if (ts instanceof String s && !s.isBlank()) {
                try {
                    d.setCreatedDate(Instant.parse(s));
                } catch (Exception e) {
                    log.warn("Invalid createdDate: {}", s);
                }
            }

            // tags
            Object tags = m.get("tags");
            if (tags instanceof List<?> tagList) {
                d.setTags(tagList.stream().map(Object::toString).toList());
            }

            Object viewsObj = m.get("views");
            d.setViews(viewsObj instanceof Number n ? n.intValue() : 0);

            Object likeObj = m.get("likeCount");
            d.setLikeCount(likeObj instanceof Number n ? n.intValue() : 0);

            Object dislikeObj = m.get("dislikeCount");
            d.setDislikeCount(dislikeObj instanceof Number n ? n.intValue() : 0);
            docs.add(d);
        }
        return docs;
    }

    private static String str(Object value, String defaultValue) {
        return value == null ? defaultValue : String.valueOf(value);
    }
}
