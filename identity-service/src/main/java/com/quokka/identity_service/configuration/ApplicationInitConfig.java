package com.quokka.identity_service.configuration;

import com.quokka.identity_service.constant.PredefinedRole;
import com.quokka.identity_service.entity.Role;
import com.quokka.identity_service.entity.User;
import com.quokka.identity_service.repository.RoleRepository;
import com.quokka.identity_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return agrs -> {
            log.info("Initializing application.....");
            if(userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()){
                
                Role adminRole = roleRepository.save(Role.builder()
                .name(PredefinedRole.ADMIN_ROLE)
                .description("Admin role with all permissions")
                .build());

                 roleRepository.save(Role.builder()
                .name(PredefinedRole.USER_ROLE)
                .description("User role with basic permissions")
                .build());

                roleRepository.save(Role.builder()
                        .name(PredefinedRole.PUBLISHER_ROLE)
                        .description("Publish role with basic permissions")
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("Admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}
