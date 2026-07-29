package com.kargo.kargotakip.Service.impl;

import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.WarehouseDTO;
import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Entity.Warehouse;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import com.kargo.kargotakip.Mapper.ShipmentMapper;
import com.kargo.kargotakip.Mapper.WarehouseMapper;
import com.kargo.kargotakip.Repository.ShipmentRepository;
import com.kargo.kargotakip.Repository.WarehouseRepository;
import com.kargo.kargotakip.Service.WarehouseService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {
    private final WarehouseMapper warehouseMapper;
    private final WarehouseRepository warehouseRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentMapper shipmentMapper;

    @Override
    @Transactional
    public WarehouseDTO createWarehouse(WarehouseDTO warehouseDTO) {
        Iterable<Warehouse> warehouses=warehouseRepository.findAll();
        for (Warehouse warehouse : warehouses){
            if (warehouse.getPhone().equals(warehouseDTO.getPhone()) || warehouse.getName().equals(warehouseDTO.getName())){
                throw new RuntimeException("Bu telefon numarasına veya isime ait bir depo zaten mevcut!!");
            }
        }
        Warehouse warehouse=warehouseMapper.toEntity(warehouseDTO);
        return warehouseMapper.toDto(warehouseRepository.save(warehouse));
    }

    @Override
    public WarehouseDTO getWarehouseById(Long id) {
        Warehouse warehouse=warehouseRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Depo bulunamadı!"));
        return warehouseMapper.toDto(warehouse);
    }

    @Override
    public List<WarehouseDTO> getAllWarehouses() {
        Iterable<Warehouse> warehouses=warehouseRepository.findAll();
        List<WarehouseDTO> warehouseDTOList=new ArrayList<>();
        for (Warehouse warehouse : warehouses){
            warehouseDTOList.add(warehouseMapper.toDto(warehouse));
        }
        return warehouseDTOList;
    }

    @Override
    @Transactional
    public WarehouseDTO updateWarehouse(Long id, WarehouseDTO warehouseDTO) {
        Warehouse existingWarehouse=warehouseRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Güncellenecek depo bulunamadı"));
        Warehouse updatedWarehouse=Warehouse.builder()
                .id(existingWarehouse.getId())
                .name(warehouseDTO.getName())
                .city(warehouseDTO.getCity())
                .district(warehouseDTO.getDistrict())
                .address(warehouseDTO.getAddress())
                .phone(warehouseDTO.getPhone())
                .latitude(warehouseDTO.getLatitude())
                .longitude(warehouseDTO.getLongitude())
                .build();
        updatedWarehouse=warehouseRepository.save(updatedWarehouse);
        return warehouseMapper.toDto(updatedWarehouse);
    }

    @Override
    @Transactional
    public void deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)){
            throw new EntityNotFoundException("Silinecek depo bulunamadı!");
        }
        warehouseRepository.deleteById(id);
    }

    @Override
    public List<String> getAllCities() {
        /*
        Iterable<Warehouse> allWarehouses=warehouseRepository.findAll();
        List<String> cities=new ArrayList<>();
        for (Warehouse warehouse : allWarehouses){
            if (!cities.contains(warehouse.getCity())) cities.add(warehouse.getCity());
        }
        return cities;
         */
        Iterable<Warehouse> allWarehouses = warehouseRepository.findAll();
        Set<String> citySet = new HashSet<>(); // Set yapısı mükerrer kayıtları engeller

        for (Warehouse warehouse : allWarehouses) {
            if (warehouse.getCity() != null) {
                citySet.add(warehouse.getCity());
            }
        }
        return new ArrayList<>(citySet); // Set'i tekrar List'e çeviriyoruz
    }

    @Override
    public List<String> getDistrictsByCity(String city) {
        /*
        Iterable<Warehouse> allWarehouses=warehouseRepository.findAll();
        List<String> districts=new ArrayList<>();
        for (Warehouse warehouse : allWarehouses){
            if (warehouse.getCity().equals(city) && !districts.contains(warehouse.getDistrict())) districts.add(warehouse.getDistrict());
        }
        return districts;
         */
        Iterable<Warehouse> allWarehouses = warehouseRepository.findAll();
        Set<String> districtSet = new HashSet<>();

        for (Warehouse warehouse : allWarehouses) {
            if (city.equalsIgnoreCase(warehouse.getCity()) && warehouse.getDistrict() != null) {
                districtSet.add(warehouse.getDistrict());
            }
        }
        return new ArrayList<>(districtSet);
    }

    @Override
    public List<ShipmentDTO> getWarehouseShipments(Long warehouseId) {
        Warehouse warehouse=warehouseRepository.findById(warehouseId).orElseThrow(()->new EntityNotFoundException("DEPO BULUNAMADI"));
        List<Shipment> shipments = shipmentRepository.findAllByCurrentWarehouseId(warehouse.getId());
        List<ShipmentDTO> warehouseShipments = new ArrayList<>();
        for (Shipment shipment : shipments) {
            if (shipment.getStatus()== ShipmentStatusEnum.PENDING_APPROVAL || shipment.getStatus()==ShipmentStatusEnum.REJECTED || shipment.getStatus()==ShipmentStatusEnum.IN_TRANSIT) continue;
            warehouseShipments.add(shipmentMapper.toDto(shipment));
        }
        return warehouseShipments;
    }

    @Override
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Override
    public double getRealDrivingDistance(double lat1, double lon1, double lat2, double lon2) {
        try {
            String url = "http://router.project-osrm.org/route/v1/driving/" +
                    lon1 + "," + lat1 + ";" + lon2 + "," + lat2 + "?overview=false";

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            double distanceInMeters = root.path("routes").get(0).path("distance").asDouble();
            return distanceInMeters / 1000.0;

        } catch (Exception e) {
            System.err.println("OSRM API Hatası! Gerçek yol hesaplanamadı, kuş uçuşuna dönülüyor...");
            return calculateDistance(lat1, lon1, lat2, lon2);
        }
    }


}
