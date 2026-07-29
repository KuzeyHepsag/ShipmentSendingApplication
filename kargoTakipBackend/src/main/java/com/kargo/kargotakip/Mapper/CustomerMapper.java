package com.kargo.kargotakip.Mapper;


import com.kargo.kargotakip.Dto.CustomerDTO;
import com.kargo.kargotakip.Entity.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomerMapper {
    private final WarehouseMapper warehouseMapper;

    public CustomerDTO toDto(Customer entity){
        if (entity==null) return null;
        return CustomerDTO.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .longitude(entity.getLongitude())
                .latitude(entity.getLatitude())
                .closestWarehouse(warehouseMapper.toDto(entity.getClosestWarehouse()))
                .build();
    }
    public Customer toEntity(CustomerDTO dto){
        if (dto==null) return null;
        return Customer.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .longitude(dto.getLongitude())
                .latitude(dto.getLatitude())
                .closestWarehouse(warehouseMapper.toEntity(dto.getClosestWarehouse()))
                .build();
    }
}
