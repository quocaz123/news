package com.quokka.post_service.mapper;

import com.quokka.post_service.dto.request.CategoryRequest;
import com.quokka.post_service.dto.response.CategoryResponse;
import com.quokka.post_service.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    @Mapping(target = "slug", expression = "java(request.getName().toLowerCase().replaceAll(\" \", \"-\"))")
    Category toCategory(CategoryRequest request);

    CategoryResponse toCategoryResponse(Category category);
}
