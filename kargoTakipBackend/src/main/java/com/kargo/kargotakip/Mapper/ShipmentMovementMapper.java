package com.kargo.kargotakip.Mapper;

import com.kargo.kargotakip.Dto.ShipmentMovementDTO;
import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Entity.ShipmentMovement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ShipmentMovementMapper {
    private final WarehouseMapper warehouseMapper;
    private final VehicleMapper vehicleMapper;
    private final DriverMapper driverMapper;


    public ShipmentMovementDTO toDto(ShipmentMovement entity){
        if (entity==null) return null;
        return ShipmentMovementDTO.builder()
                .id(entity.getId())
                .shipmentId(entity.getShipment()!=null ? entity.getShipment().getId() : null)
                .fromWarehouse(warehouseMapper.toDto(entity.getFromWarehouse()))
                .toWarehouse(warehouseMapper.toDto(entity.getToWarehouse()))
                .vehicle(vehicleMapper.toDto(entity.getVehicle()))
                .driver(driverMapper.toDto(entity.getDriver()))
                .movementDate(entity.getMovementDate())
                .status(entity.getStatus())
                .description(entity.getDescription())
                .build();
    }
    public ShipmentMovement toEntity(ShipmentMovementDTO dto){
        if (dto==null) return null;
        return ShipmentMovement.builder()
                .id(dto.getId())
                .shipment(dto.getShipmentId()!=null ? Shipment.builder().id(dto.getShipmentId()).build() : null)
                .fromWarehouse(warehouseMapper.toEntity(dto.getFromWarehouse()))
                .toWarehouse(warehouseMapper.toEntity(dto.getToWarehouse()))
                .vehicle(vehicleMapper.toEntity(dto.getVehicle()))
                .driver(driverMapper.toEntity(dto.getDriver()))
                .movementDate(dto.getMovementDate())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .build();

    }


}
