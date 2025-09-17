package com.quokka.search_service.controller;

import com.quokka.search_service.service.ReindexService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ReindexService reindexService;

    @PostMapping("/reindex")
    public ResponseEntity<?> reindex(@RequestParam(name = "size", defaultValue = "200") int size) {
        int total = reindexService.reindexAll(size);
        return ResponseEntity.ok(Map.of("indexed", total));
    }

    @GetMapping("/reindex")
    public ResponseEntity<?> reindexGet(@RequestParam(name = "size", defaultValue = "200") int size) {
        int total = reindexService.reindexAll(size);
        return ResponseEntity.ok(Map.of("indexed", total));
    }
}
