package com.quokka.identity_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.quokka.identity_service.validator.DobConstraint;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    // Unique username for the user  COLLATE utf8mb4_general_ci phrase is used to ensure case-insensitive comparison in MySQL
    @Column(name = "username", unique = true, nullable = false, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_general_ci")
    String username;
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    @Column(name = "email", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String email;

    @Column(name = "email_verified", nullable = false, columnDefinition = "boolean default false")
    boolean emailVerified;

    @ManyToMany
    Set<Role> roles;


}
