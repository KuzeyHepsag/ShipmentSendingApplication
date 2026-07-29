package com.kargo.kargotakip.Mapper;


import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.VehicleDTO;
import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Entity.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class VehicleMapper {
    private final ShipmentMapper shipmentMapper;
    public VehicleDTO toDto(Vehicle entity) {
        if (entity == null) return null;

        return VehicleDTO.builder()
                .id(entity.getId())
                .plateNumber(entity.getPlateNumber())
                .status(entity.getStatus())
                .load(entity.getLoad())
                .currentWarehouse(entity.getCurrentWarehouse())
                .shipmentDTOList(shipmentMapper.toDtoList(entity.getShipments()))
                .build();
    }

    public Vehicle toEntity(VehicleDTO dto) {
        if (dto == null) return null;

        return Vehicle.builder()
                .id(dto.getId())
                .plateNumber(dto.getPlateNumber())
                .status(dto.getStatus())
                .load(dto.getLoad())
                .currentWarehouse(dto.getCurrentWarehouse())
                .shipments(shipmentMapper.toEntityList(dto.getShipmentDTOList()))
                .build();
    }

}
