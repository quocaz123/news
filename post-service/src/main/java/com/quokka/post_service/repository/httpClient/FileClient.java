package com.quokka.post_service.repository.httpClient;

import com.quokka.post_service.configuration.AuthenticationRequestInterceptor;
import com.quokka.post_service.dto.ApiResponse;
import com.quokka.post_service.dto.response.FileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
        name = "file-service",
        url = "http://localhost:8084",
        configuration = {AuthenticationRequestInterceptor.class})
public interface FileClient {
    @PostMapping(value = "/file/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<FileResponse> uploadMedia(@RequestPart("file") MultipartFile file);

}