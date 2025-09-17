package com.quokka.post_service.service;

import com.quokka.post_service.dto.request.CategoryRequest;
import com.quokka.post_service.dto.response.CategoryResponse;
import com.quokka.post_service.entity.Category;
import com.quokka.post_service.mapper.CategoryMapper;
import com.quokka.post_service.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }

        Category category = categoryMapper.toCategory(request);
        category = categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(category);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());
        category.setSlug(request.getName().toLowerCase().replaceAll(" ", "-"));
        category = categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(category);
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}
