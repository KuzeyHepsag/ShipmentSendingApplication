package com.kargo.kargotakip.Service;

import com.kargo.kargotakip.Dto.VehicleDTO;

import java.util.List;

public interface VehicleService {
    VehicleDTO createVehicle(VehicleDTO vehicleDTO);
    VehicleDTO getVehicleById(Long id);
    List<VehicleDTO> getAllVehicles();
    VehicleDTO updateVehicle(Long id, VehicleDTO vehicleDTO);
    void deleteVehicle(Long id);
    void loadAndDispatch(Long vehicleId,Long warehouseId);
    void deload(Long vehicleId,Long warehouseId);
}
