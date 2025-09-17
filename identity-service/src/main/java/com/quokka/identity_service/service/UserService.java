package com.quokka.identity_service.service;

import com.quokka.event.dto.NotificationEvent;
import com.quokka.identity_service.constant.PredefinedRole;
import com.quokka.identity_service.dto.request.UserCreationRequest;
import com.quokka.identity_service.dto.request.UserUpdateRequest;
import com.quokka.identity_service.dto.response.UserResponse;
import com.quokka.identity_service.entity.Role;
import com.quokka.identity_service.entity.User;
import com.quokka.identity_service.exception.AppException;
import com.quokka.identity_service.exception.ErrorCode;
import com.quokka.identity_service.mapper.ProfileMapper;
import com.quokka.identity_service.mapper.UserMapper;
import com.quokka.identity_service.repository.RoleRepository;
import com.quokka.identity_service.repository.UserRepository;
import com.quokka.identity_service.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    ProfileClient profileClient;
    ProfileMapper profileMapper;
    KafkaTemplate<String, NotificationEvent> kafkaTemplate;

    public UserResponse createUser(UserCreationRequest request) {

        // if (userRepository.existsByUsername((request.getUsername()))) {
        //     throw new AppException(ErrorCode.USER_EXISTED);
        // }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Map<String, String> roleMap = Map.of(
                "USER", PredefinedRole.USER_ROLE,
                "PUBLISHER", PredefinedRole.PUBLISHER_ROLE
        );

        String roleKey = (request.getRole() == null || request.getRole().isBlank())
                ? "USER"
                : request.getRole().toUpperCase();

        String roleId = roleMap.get(roleKey);
        if (roleId == null) {
            throw new RuntimeException("Role not found: " + roleKey);
        }

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(roleId).ifPresent(roles::add);

        user.setRoles(roles);
        user.setEmailVerified(false);

        //dùng cái này thay cho cái trên để tăng hiệu suất 
        try {
            user = userRepository.save(user);


            var profileRequest = profileMapper.toProfileCreateRequest(request);

            profileRequest.setUserId(user.getId());



            var profileResponse = profileClient.createProfile(profileRequest);

            NotificationEvent notificationEvent = NotificationEvent.builder()
                    .channel("EMAIL")
                    .recipient(request.getEmail())
                    .subject("Wellcome to book_microservices")
                    .body("Hello, " + request.getUsername())
                    .build();

            //Publish message to kafka
            kafkaTemplate.send("notification-delivery", notificationEvent);


        } catch(DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        

        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);

    }
}
