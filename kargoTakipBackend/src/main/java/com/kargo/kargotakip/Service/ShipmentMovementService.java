package com.kargo.kargotakip.Service;

import com.kargo.kargotakip.Dto.ShipmentMovementDTO;

import java.util.List;

public interface ShipmentMovementService {
    ShipmentMovementDTO createMovement(ShipmentMovementDTO movementDTO);
    ShipmentMovementDTO getMovementById(Long id);
    List<ShipmentMovementDTO> getAllMovements();
    List<ShipmentMovementDTO> getMovementsByShipmentId(Long shipmentId);

}
