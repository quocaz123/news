package com.quokka.identity_service.mapper;

import com.quokka.identity_service.dto.request.UserCreationRequest;
import com.quokka.identity_service.dto.request.UserUpdateRequest;
import com.quokka.identity_service.dto.response.UserResponse;
import com.quokka.identity_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    // @MappingTarget nhật giá trị của một object đã tồn tại thay vì tạo mới object
    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

}
