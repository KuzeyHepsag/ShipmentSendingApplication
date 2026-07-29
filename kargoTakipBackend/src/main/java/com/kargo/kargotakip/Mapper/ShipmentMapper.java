package com.kargo.kargotakip.Mapper;


import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Repository.WarehouseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ShipmentMapper {
    private final CustomerMapper customerMapper;
    private final WarehouseRepository warehouseRepository;
    public ShipmentDTO toDto(Shipment entity){
        if (entity==null) return null;
        return ShipmentDTO.builder()
                .id(entity.getId())
                .trackingNumber(entity.getTrackingNumber())
                .sender(customerMapper.toDto(entity.getSender()))
                .receiver(customerMapper.toDto(entity.getReceiver()))
                .status(entity.getStatus())
                .weight(entity.getWeight())
                .currentWarehouseName(entity.getCurrentWarehouse() != null ? entity.getCurrentWarehouse().getName() : null)
                .toWarehouseName(entity.getToWarehouse() != null ? entity.getToWarehouse().getName() : null)
                .build();
    }
    public Shipment toEntity(ShipmentDTO dto){
        if (dto==null) return null;
        return Shipment.builder()
                .id(dto.getId())
                .trackingNumber(dto.getTrackingNumber())
                .sender(customerMapper.toEntity(dto.getSender()))
                .receiver(customerMapper.toEntity(dto.getReceiver()))
                .status(dto.getStatus())
                .weight(dto.getWeight())
                .currentWarehouse(warehouseRepository.findByName(dto.getCurrentWarehouseName()).orElseThrow(()->new EntityNotFoundException("Depo bulunamadı.")))
                .toWarehouse(warehouseRepository.findByName(dto.getToWarehouseName()).orElseThrow(()->new EntityNotFoundException("Depo bulunamadı.")))
                .build();
    }

    public List<Shipment> toEntityList(List<ShipmentDTO> shipmentDTOList){
        List<Shipment> shipments=new ArrayList<>();
        if (shipmentDTOList == null) {
            return new ArrayList<>(); // veya return null; (mimarinize göre)
        }
        for (ShipmentDTO shipmentDTO : shipmentDTOList){
            shipments.add(toEntity(shipmentDTO));
        }
        return shipments;
    }
    public List<ShipmentDTO> toDtoList(List<Shipment> shipments){
        List<ShipmentDTO> shipmentDTOList=new ArrayList<>();
        if (shipments == null) {
            return new ArrayList<>(); // veya return null; (mimarinize göre)
        }
        for (Shipment shipment : shipments){
            shipmentDTOList.add(toDto(shipment));
        }
        return shipmentDTOList;
    }
}
