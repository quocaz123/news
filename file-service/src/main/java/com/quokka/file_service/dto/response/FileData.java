package com.quokka.file_service.dto.response;

import org.springframework.core.io.Resource;

public record FileData(String contentType, Resource resource) {}
