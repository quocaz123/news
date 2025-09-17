package com.quokka.profile_service.mapper;

import org.mapstruct.Mapper;

import com.quokka.profile_service.dto.request.ProfileCreationRequest;
import com.quokka.profile_service.dto.respone.UserProfileResponse;
import com.quokka.profile_service.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(ProfileCreationRequest request);

    UserProfileResponse toUserProfileResponse(UserProfile entity);
}
