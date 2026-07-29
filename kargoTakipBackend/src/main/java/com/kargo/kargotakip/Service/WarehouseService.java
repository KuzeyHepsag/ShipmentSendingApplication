package com.kargo.kargotakip.Service;

import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.WarehouseDTO;

import java.util.List;

public interface WarehouseService {
    WarehouseDTO createWarehouse(WarehouseDTO warehouseDTO);
    WarehouseDTO getWarehouseById(Long id);
    List<WarehouseDTO> getAllWarehouses();
    WarehouseDTO updateWarehouse(Long id,WarehouseDTO warehouseDTO);
    void deleteWarehouse(Long id);

    List<String> getAllCities();

    List<String> getDistrictsByCity(String city);

    List<ShipmentDTO> getWarehouseShipments(Long warehouse);

    double calculateDistance(double lat1,double lon1,double lat2,double lon2);

    double getRealDrivingDistance(double lat1, double lon1, double lat2, double lon2);
}
