package com.quokka.search_service.service;

import com.quokka.search_service.model.PostDocument;
import com.quokka.search_service.service.dto.SearchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final ElasticsearchOperations operations;

    public SearchResult search(String q, String category, String author, int page, int size) {
        NativeQueryBuilder builder = new NativeQueryBuilder();

        // Phân trang + sort theo createdDate desc (trong PostDocument có field
        // createdDate)
        builder.withPageable(PageRequest.of(Math.max(page - 1, 0), size,
                Sort.by(Sort.Direction.DESC, "createdDate")));

        // Query: nếu có keyword thì search trong title + username + description
        if (q != null && !q.isBlank()) {
            builder.withQuery(b -> b.multiMatch(m -> m
                    .query(q)
                    .fields("title^3", "username^2", "description^1.5")
                    .fuzziness("AUTO")));
        } else {
            builder.withQuery(b -> b.matchAll(ma -> ma));
        }

        // Filter theo categoryName: dùng match để không cần khớp exact dấu/case
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            builder.withFilter(f -> f.match(m -> m.field("categoryName").query(category)));
        }

        // Filter theo username
        if (author != null && !author.isBlank() && !"all".equalsIgnoreCase(author)) {
            builder.withFilter(f -> f.term(t -> t.field("username").value(author)));
        }

        // Build query
        NativeQuery query = builder.build();
        SearchHits<PostDocument> hits = operations.search(query, PostDocument.class);

        // Lấy dữ liệu kết quả
        List<PostDocument> data = hits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .toList();

        long total = hits.getTotalHits();
        int totalPages = (int) Math.max(1, Math.ceil((double) total / (double) size));

        return new SearchResult(data, total, totalPages);
    }

    public SearchResult searchByTitle(String title, int page, int size) {
        NativeQueryBuilder builder = new NativeQueryBuilder();
        builder.withPageable(PageRequest.of(Math.max(page - 1, 0), size,
                Sort.by(Sort.Direction.DESC, "createdDate")));

        if (title != null && !title.isBlank()) {
            builder.withQuery(b -> b.match(m -> m.field("title").query(title).fuzziness("AUTO")));
        } else {
            builder.withQuery(b -> b.matchAll(ma -> ma));
        }

        NativeQuery query = builder.build();
        SearchHits<PostDocument> hits = operations.search(query, PostDocument.class);
        List<PostDocument> data = hits.getSearchHits().stream().map(SearchHit::getContent).toList();
        long total = hits.getTotalHits();
        int totalPages = (int) Math.max(1, Math.ceil((double) total / (double) size));
        return new SearchResult(data, total, totalPages);
    }

    public SearchResult searchByCategoryName(String categoryName, int page, int size) {
        NativeQueryBuilder builder = new NativeQueryBuilder();
        builder.withPageable(PageRequest.of(Math.max(page - 1, 0), size,
                Sort.by(Sort.Direction.DESC, "createdDate")));

        if (categoryName != null && !categoryName.isBlank()) {
            // match_phrase chính xác hơn match (giữ nguyên cụm từ, tránh tách token)
            builder.withQuery(q -> q.matchPhrase(m -> m.field("categoryName").query(categoryName)));
        } else {
            builder.withQuery(q -> q.matchAll(ma -> ma));
        }

        NativeQuery query = builder.build();
        SearchHits<PostDocument> hits = operations.search(query, PostDocument.class);

        List<PostDocument> data = hits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .toList();

        long total = hits.getTotalHits();
        int totalPages = (int) Math.max(1, Math.ceil((double) total / (double) size));

        return new SearchResult(data, total, totalPages);
    }

}
