package com.quokka.identity_service.mapper;

import com.quokka.identity_service.dto.request.PermissionRequest;
import com.quokka.identity_service.dto.response.PermissionResponse;
import com.quokka.identity_service.entity.Permission;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPerMissionResponse(Permission permission);

}
