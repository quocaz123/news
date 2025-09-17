package com.quokka.profile_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.quokka.profile_service.dto.request.ProfileCreationRequest;
import com.quokka.profile_service.dto.respone.UserProfileResponse;
import com.quokka.profile_service.entity.UserProfile;
import com.quokka.profile_service.exception.AppException;
import com.quokka.profile_service.exception.ErrorCode;
import com.quokka.profile_service.mapper.UserProfileMapper;
import com.quokka.profile_service.repository.UserProfileRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;

    public UserProfileResponse createProfile(ProfileCreationRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public UserProfileResponse getProfile(String id) {
        UserProfile userProfile = userProfileRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(("Profile not found with id: " + id)));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }

    public List<UserProfileResponse> getAllProfile() {
        return userProfileRepository.findAll().stream()
                .map(userProfileMapper::toUserProfileResponse)
                .toList();
    }

    public UserProfileResponse getByUserId(String userId) {
        UserProfile userProfile = userProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileResponse(userProfile);
    }
}
