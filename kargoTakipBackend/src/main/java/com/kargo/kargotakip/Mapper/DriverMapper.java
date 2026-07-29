package com.kargo.kargotakip.Mapper;


import com.kargo.kargotakip.Dto.DriverDTO;
import com.kargo.kargotakip.Entity.Driver;
import org.springframework.stereotype.Component;

@Component
public class DriverMapper {
    public DriverDTO toDto(Driver entity){
        if (entity==null) return null;
        return DriverDTO.builder()
                .id(entity.getId())
                .phone(entity.getPhone())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .licenseNumber(entity.getLicenseNumber())
                .build();
    }
    public Driver toEntity(DriverDTO dto) {
        if (dto == null) return null;
        return Driver.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .licenseNumber(dto.getLicenseNumber())
                .build();
    }
}
