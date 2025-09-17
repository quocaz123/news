package com.quokka.search_service.model;

import java.time.Instant;
import java.util.List;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "posts")
public class PostDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Keyword, normalizer = "lowercase_normalizer")
    private String categoryName;

    @Field(type = FieldType.Keyword)
    private String username;

    @Field(type = FieldType.Keyword)
    private String thumbnailUrl;

    @Field(type = FieldType.Keyword)
    private String thumbnailFileName;

    @Field(type = FieldType.Date)
    private Instant createdDate;

    @Field(type = FieldType.Keyword)
    private String created; // "2 hours" (string mô tả tương đối)

    @Field(type = FieldType.Integer)
    private int views;

    @Field(type = FieldType.Integer)
    private int likeCount;

    @Field(type = FieldType.Integer)
    private int dislikeCount;

    @Field(type = FieldType.Keyword)
    private List<String> tags;
}

