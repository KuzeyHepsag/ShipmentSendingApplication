package com.kargo.kargotakip.Service;

import com.kargo.kargotakip.Dto.SendShipmentRequest;
import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;

import java.util.List;

public interface ShipmentService {
    ShipmentDTO createShipment(ShipmentDTO shipmentDTO);
    ShipmentDTO getShipmentById(Long id);
    List<ShipmentDTO> getAllShipments();
    ShipmentDTO updateShipmentStatus(Long id, ShipmentStatusEnum newStatus,String notes);
    void deleteShipment(Long id);
    List<ShipmentDTO> searchShipments(ShipmentStatusEnum status, String trackingNumber, Double minWeight);

    List<ShipmentDTO> getMyShipments(String username);

    ShipmentDTO sendShipment(SendShipmentRequest request);

    void approveShipment(Long id);

    void rejectShipment(Long id);

}
