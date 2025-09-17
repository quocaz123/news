package com.quokka.post_service.dto.request;

import com.quokka.post_service.constant.PostStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostRequest {
    String title;
    String description;
    String content;
    String categoryId;
    List<String> tags;
    PostStatus status;
    MultipartFile file;

    public void setContent(String content) {
        if (content != null) {
            // Chuyển mọi loại xuống dòng (Windows \r\n, Linux \n, Mac \r) về dạng \n
            this.content = content
                    .replace("\r\n", "\\n")
                    .replace("\n", "\\n")
                    .replace("\r", "\\n");
        } else {
            this.content = null;
        }
    }
}
