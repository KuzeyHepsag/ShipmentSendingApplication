package com.kargo.kargotakip.Mapper;


import com.kargo.kargotakip.Dto.WarehouseDTO;
import com.kargo.kargotakip.Entity.Warehouse;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {
    public WarehouseDTO toDto(Warehouse entity){
        if (entity==null) return null;
        return WarehouseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .city(entity.getCity())
                .district(entity.getDistrict())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .build();
    }
    public Warehouse toEntity(WarehouseDTO dto){
        if (dto==null) return null;
        return Warehouse.builder()
                .id(dto.getId())
                .name(dto.getName())
                .city(dto.getCity())
                .district(dto.getDistrict())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();

    }
}
