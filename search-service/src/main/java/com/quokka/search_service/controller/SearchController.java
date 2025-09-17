package com.quokka.search_service.controller;

import com.quokka.search_service.service.SearchService;
import com.quokka.search_service.service.dto.SearchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "categoryName", required = false, defaultValue = "all") String category,
            @RequestParam(value = "username", required = false, defaultValue = "all") String author,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "12") int size) {

        SearchResult result = searchService.search(q, category, author, page, size);

        Map<String, Object> body = new HashMap<>();
        body.put("data", result.getData());
        body.put("total", result.getTotal());
        body.put("totalPages", result.getTotalPages());
        body.put("page", page);
        body.put("size", size);

        return ResponseEntity.ok(Map.of("result", body));
    }

    @GetMapping("/latest")
    public ResponseEntity<?> latest(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "12") int size) {

        // latest không lọc category/author → truyền "all"
        SearchResult result = searchService.search(null, "all", "all", page, size);

        Map<String, Object> body = new HashMap<>();
        body.put("data", result.getData());
        body.put("total", result.getTotal());
        body.put("totalPages", result.getTotalPages());
        body.put("page", page);
        body.put("size", size);

        return ResponseEntity.ok(Map.of("result", body));
    }

    @GetMapping("/search/title")
    public ResponseEntity<?> searchByTitle(
            @RequestParam(value = "title", required = false, defaultValue = "") String title,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "12") int size) {
        SearchResult result = searchService.searchByTitle(title, page, size);
        Map<String, Object> body = new HashMap<>();
        body.put("data", result.getData());
        body.put("total", result.getTotal());
        body.put("totalPages", result.getTotalPages());
        body.put("page", page);
        body.put("size", size);
        return ResponseEntity.ok(Map.of("result", body));
    }

    @GetMapping("/search/category")
    public ResponseEntity<?> searchByCategory(
            @RequestParam(value = "categoryName", required = false, defaultValue = "") String categoryName,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "12") int size) {
        SearchResult result = searchService.searchByCategoryName(categoryName, page, size);
        Map<String, Object> body = new HashMap<>();
        body.put("data", result.getData());
        body.put("total", result.getTotal());
        body.put("totalPages", result.getTotalPages());
        body.put("page", page);
        body.put("size", size);
        return ResponseEntity.ok(Map.of("result", body));
    }
}
