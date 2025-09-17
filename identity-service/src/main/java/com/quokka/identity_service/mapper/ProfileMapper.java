package com.quokka.identity_service.mapper;

import com.quokka.identity_service.dto.request.ProfileCreationRequest;
import com.quokka.identity_service.dto.request.UserCreationRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileCreationRequest toProfileCreateRequest(UserCreationRequest request);
}
