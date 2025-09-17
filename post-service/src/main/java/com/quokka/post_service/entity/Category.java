package com.quokka.post_service.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@Document(value = "category")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    String id;
    String name;
    String slug;
}
