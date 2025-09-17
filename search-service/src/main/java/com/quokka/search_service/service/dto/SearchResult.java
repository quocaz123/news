package com.quokka.search_service.service.dto;

import com.quokka.search_service.model.PostDocument;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchResult {
    private List<PostDocument> data;
    private long total;
    private int totalPages;
}
