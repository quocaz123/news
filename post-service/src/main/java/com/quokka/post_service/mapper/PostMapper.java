package com.quokka.post_service.mapper;

import com.quokka.post_service.dto.response.PostListResponse;
import com.quokka.post_service.dto.response.PostResponse;
import com.quokka.post_service.entity.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostResponse toPostResponse(Post post);

    PostListResponse toPostListResponse(Post post);
}
