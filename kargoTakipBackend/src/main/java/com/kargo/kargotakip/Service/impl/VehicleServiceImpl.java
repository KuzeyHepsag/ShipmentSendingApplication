package com.kargo.kargotakip.Service.impl;

import com.kargo.kargotakip.Dto.ShipmentMovementDTO;
import com.kargo.kargotakip.Dto.VehicleDTO;
import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Entity.Vehicle;
import com.kargo.kargotakip.Entity.Warehouse;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import com.kargo.kargotakip.Enumerations.VehicleStatusEnum; // EKLENDİ
import com.kargo.kargotakip.Mapper.ShipmentMapper;
import com.kargo.kargotakip.Mapper.VehicleMapper;
import com.kargo.kargotakip.Mapper.WarehouseMapper;
import com.kargo.kargotakip.Repository.ShipmentRepository;
import com.kargo.kargotakip.Repository.VehicleRepository;
import com.kargo.kargotakip.Repository.WarehouseRepository;
import com.kargo.kargotakip.Service.ShipmentMovementService;
import com.kargo.kargotakip.Service.VehicleService;
import com.kargo.kargotakip.Service.WarehouseService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;
    private final ShipmentMapper shipmentMapper;
    private final ShipmentRepository shipmentRepository;
    private final WarehouseService warehouseService;
    private final WarehouseRepository warehouseRepository;

    private final ShipmentMovementService movementService;
    private final WarehouseMapper warehouseMapper;

    @Override
    @Transactional
    public VehicleDTO createVehicle(VehicleDTO vehicleDTO) {
        Vehicle vehicle = vehicleMapper.toEntity(vehicleDTO);

        // Yeni araç eklerken default değerleri set ediyoruz
        if (vehicle.getLoad() == null) vehicle.setLoad(0L);
        if (vehicle.getStatus() == null) vehicle.setStatus(VehicleStatusEnum.AVAILABLE);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(savedVehicle);
    }

    @Override
    public VehicleDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Araç bulunamadı!"));
        return vehicleMapper.toDto(vehicle);
    }

    @Override
    public List<VehicleDTO> getAllVehicles() {
        Iterable<Vehicle> vehicles = vehicleRepository.findAll();
        List<VehicleDTO> vehicleDTOList = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            vehicleDTOList.add(vehicleMapper.toDto(vehicle));
        }
        return vehicleDTOList;
    }

    @Override
    public VehicleDTO updateVehicle(Long id, VehicleDTO vehicleDTO) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Güncellenecek araç bulunamadı!"));
        if (vehicleDTO.getCurrentWarehouse() != null) {
            Long newWarehouseId = vehicleDTO.getCurrentWarehouse().getId();
            Long oldWarehouseId = existingVehicle.getCurrentWarehouse() != null ? existingVehicle.getCurrentWarehouse().getId() : null;
            if (!newWarehouseId.equals(oldWarehouseId)) {
                existingVehicle.setCurrentWarehouse(vehicleDTO.getCurrentWarehouse());
                long currentLoad = existingVehicle.getLoad() != null ? existingVehicle.getLoad() : 0L;
                if (currentLoad < 100) {
                    existingVehicle.setStatus(VehicleStatusEnum.AVAILABLE);
                }
                else {
                    boolean inecekKargoVarMi = false;
                    if (existingVehicle.getShipments() != null) {
                        for (Shipment s : existingVehicle.getShipments()) {
                            if (s.getToWarehouse() != null && s.getToWarehouse().getId().equals(newWarehouseId)) {
                                inecekKargoVarMi = true;
                                break;
                            }
                        }
                    }
                    if (inecekKargoVarMi) {
                        existingVehicle.setStatus(VehicleStatusEnum.AVAILABLE);
                    } else {
                        existingVehicle.setStatus(VehicleStatusEnum.FULL);
                    }
                }
            }
            else {
                if (vehicleDTO.getStatus() != null) {
                    existingVehicle.setStatus(vehicleDTO.getStatus());
                }
            }
        }
        else {
            if (vehicleDTO.getStatus() != null) {
                existingVehicle.setStatus(vehicleDTO.getStatus());
            }
        }
        if (vehicleDTO.getLoad() != null) {
            existingVehicle.setLoad(vehicleDTO.getLoad());
        }
        return vehicleMapper.toDto(vehicleRepository.save(existingVehicle));
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) throw new EntityNotFoundException("Silinecek araç bulunamadı");
        vehicleRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void loadAndDispatch(Long vehicleId, Long warehouseId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Araç bulunamadı"));

        if (vehicle.getStatus() == VehicleStatusEnum.ON_WAY) {
            throw new RuntimeException("Bu araç zaten yolda!");
        }

        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new EntityNotFoundException("Depo bulunamadı"));

        if (vehicle.getCurrentWarehouse() == null || !vehicle.getCurrentWarehouse().getId().equals(warehouse.getId())) {
            String currentLoc = (vehicle.getCurrentWarehouse() != null) ? vehicle.getCurrentWarehouse().getName() : "Belirsiz";
            throw new RuntimeException("Bu işlem yapılamaz! Araç şu anda bu depoda değil. (Mevcut Konum: " + currentLoc + ")");
        }


        long currentLoad = vehicle.getLoad() != null ? vehicle.getLoad() : 0L;
        if (currentLoad >= 100) {
            throw new RuntimeException("Araç kapasitesi dolu (100 kargo)! Daha fazla yükleme yapılamaz.");
        }

        List<Shipment> warehouseShipments = shipmentRepository.findAllByCurrentWarehouseId(warehouseId);

        Shipment mainShipment = warehouseShipments.stream()
                        .filter(s -> s.getStatus() != ShipmentStatusEnum.IN_TRANSIT && s.getStatus() != ShipmentStatusEnum.DELIVERED)
                .max((s1, s2) -> Double.compare(
                        warehouseService.getRealDrivingDistance(warehouse.getLatitude(), warehouse.getLongitude(), s1.getToWarehouse().getLatitude(), s1.getToWarehouse().getLongitude()),
                        warehouseService.getRealDrivingDistance(warehouse.getLatitude(), warehouse.getLongitude(), s2.getToWarehouse().getLatitude(), s2.getToWarehouse().getLongitude())
                )).orElseThrow(() -> new RuntimeException("Yüklenecek kargo yok!"));

        double maxDistance = warehouseService.getRealDrivingDistance(
                warehouse.getLatitude(), warehouse.getLongitude(),
                mainShipment.getToWarehouse().getLatitude(), mainShipment.getToWarehouse().getLongitude()
        );

        List<Shipment> loadedShipments = vehicle.getShipments();
        if(loadedShipments == null) loadedShipments = new ArrayList<>();


        loadedShipments.add(mainShipment);
        currentLoad++;


        for (Shipment s : warehouseShipments) {
            if (currentLoad >= 100) {
                break;
            }

            if (s.getStatus() == ShipmentStatusEnum.IN_TRANSIT || s.getId().equals(mainShipment.getId()) || s.getStatus() == ShipmentStatusEnum.DELIVERED) continue;
            if (s.getToWarehouse() == null || s.getToWarehouse().getLatitude() == null) continue;

            double distanceToIntermediate = warehouseService.getRealDrivingDistance(
                    warehouse.getLatitude(), warehouse.getLongitude(),
                    s.getToWarehouse().getLatitude(), s.getToWarehouse().getLongitude()
            );

            double distanceFromIntermediateToFarthest = warehouseService.getRealDrivingDistance(
                    s.getToWarehouse().getLatitude(), s.getToWarehouse().getLongitude(),
                    mainShipment.getToWarehouse().getLatitude(), mainShipment.getToWarehouse().getLongitude()
            );

            double detour = (distanceToIntermediate + distanceFromIntermediateToFarthest) - maxDistance;

            if (detour <= 50.0) {
                loadedShipments.add(s);
                currentLoad++;
            }
        }


        vehicle.setLoad(currentLoad);
        vehicle.setStatus(VehicleStatusEnum.ON_WAY);
        vehicleRepository.save(vehicle);


        for (Shipment s : loadedShipments) {
            s.setCurrentWarehouse(null);
            s.setStatus(ShipmentStatusEnum.IN_TRANSIT);
            shipmentRepository.save(s);

            ShipmentMovementDTO movementDTO = new ShipmentMovementDTO();
            movementDTO.setShipmentId(s.getId());
            movementDTO.setFromWarehouse(warehouseMapper.toDto(warehouse));
            movementDTO.setToWarehouse(warehouseMapper.toDto(s.getToWarehouse()));
            movementDTO.setStatus(ShipmentStatusEnum.IN_TRANSIT);
            movementDTO.setMovementDate(LocalDateTime.now());
            movementDTO.setDescription("Kargo, " + vehicle.getPlateNumber() + " plakalı araca yüklendi ve yola çıktı. (Kapasite: " + currentLoad + "/100)");
            movementService.createMovement(movementDTO);
        }
    }

    @Override
    @Transactional
    public void deload(Long vehicleId, Long warehouseId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Araç bulunamadı"));

        Warehouse currentWarehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new EntityNotFoundException("Depo bulunamadı"));

        vehicle.setCurrentWarehouse(currentWarehouse);

        List<Shipment> vehicleShipments = vehicle.getShipments();
        List<Shipment> toRemove = new ArrayList<>();

        long currentLoad = vehicle.getLoad() != null ? vehicle.getLoad() : 0L;

        if (vehicleShipments != null && !vehicleShipments.isEmpty()) {
            for (Shipment shipment : vehicleShipments) {
                Long targetWarehouseId = (shipment.getToWarehouse() != null) ? shipment.getToWarehouse().getId() : null;

                if (targetWarehouseId != null) {
                    if (targetWarehouseId.longValue() == currentWarehouse.getId().longValue()) {
                        shipment.setStatus(ShipmentStatusEnum.DELIVERED);
                        shipment.setCurrentWarehouse(currentWarehouse);
                        shipmentRepository.save(shipment);
                        toRemove.add(shipment);

                        currentLoad--;

                        ShipmentMovementDTO movementDTO = new ShipmentMovementDTO();
                        movementDTO.setShipmentId(shipment.getId());
                        movementDTO.setToWarehouse(warehouseMapper.toDto(currentWarehouse));
                        movementDTO.setStatus(ShipmentStatusEnum.DELIVERED);
                        movementDTO.setMovementDate(LocalDateTime.now());
                        movementDTO.setDescription("Kargo, " + vehicle.getPlateNumber() + " plakalı araç tarafından depoya indirildi.");
                        movementService.createMovement(movementDTO);
                    }
                }
            }
            vehicleShipments.removeAll(toRemove);
        }

        if (currentLoad < 0) currentLoad = 0L;

        if (!vehicleShipments.isEmpty() && currentLoad < 100) {

            Shipment mainShipment = vehicleShipments.stream()
                    .max((s1, s2) -> Double.compare(
                            warehouseService.getRealDrivingDistance(currentWarehouse.getLatitude(), currentWarehouse.getLongitude(), s1.getToWarehouse().getLatitude(), s1.getToWarehouse().getLongitude()),
                            warehouseService.getRealDrivingDistance(currentWarehouse.getLatitude(), currentWarehouse.getLongitude(), s2.getToWarehouse().getLatitude(), s2.getToWarehouse().getLongitude())
                    )).orElse(null);

            if (mainShipment != null) {
                double maxDistance = warehouseService.getRealDrivingDistance(
                        currentWarehouse.getLatitude(), currentWarehouse.getLongitude(),
                        mainShipment.getToWarehouse().getLatitude(), mainShipment.getToWarehouse().getLongitude()
                );

                // Bu depodaki bekleyen diğer kargoları çek
                List<Shipment> waitingShipments = shipmentRepository.findAllByCurrentWarehouseId(warehouseId);

                for (Shipment s : waitingShipments) {
                    if (currentLoad >= 100) break;

                    if (s.getStatus() == ShipmentStatusEnum.IN_TRANSIT || s.getStatus() == ShipmentStatusEnum.DELIVERED) continue;
                    if (s.getToWarehouse() == null || s.getToWarehouse().getLatitude() == null) continue;

                    double distanceToIntermediate = warehouseService.getRealDrivingDistance(
                            currentWarehouse.getLatitude(), currentWarehouse.getLongitude(),
                            s.getToWarehouse().getLatitude(), s.getToWarehouse().getLongitude()
                    );

                    double distanceFromIntermediateToFarthest = warehouseService.getRealDrivingDistance(
                            s.getToWarehouse().getLatitude(), s.getToWarehouse().getLongitude(),
                            mainShipment.getToWarehouse().getLatitude(), mainShipment.getToWarehouse().getLongitude()
                    );

                    double detour = (distanceToIntermediate + distanceFromIntermediateToFarthest) - maxDistance;


                    if (detour <= 50.0) {
                        s.setCurrentWarehouse(null);
                        s.setStatus(ShipmentStatusEnum.IN_TRANSIT);
                        shipmentRepository.save(s);

                        vehicleShipments.add(s);
                        currentLoad++;

                        ShipmentMovementDTO loadMovement = new ShipmentMovementDTO();
                        loadMovement.setShipmentId(s.getId());
                        loadMovement.setFromWarehouse(warehouseMapper.toDto(currentWarehouse));
                        loadMovement.setToWarehouse(warehouseMapper.toDto(s.getToWarehouse()));
                        loadMovement.setStatus(ShipmentStatusEnum.IN_TRANSIT);
                        loadMovement.setMovementDate(LocalDateTime.now());
                        loadMovement.setDescription("Kargo, rotasına devam eden " + vehicle.getPlateNumber() + " plakalı araca yol üstü durağından (" + currentWarehouse.getName() + ") yüklendi.");
                        movementService.createMovement(loadMovement);
                    }
                }
            }
        }

        vehicle.setLoad(currentLoad);


        if (currentLoad == 0) {
            vehicle.setStatus(VehicleStatusEnum.AVAILABLE);
        } else if (currentLoad == 100) {
            vehicle.setStatus(VehicleStatusEnum.FULL);
        } else {
            vehicle.setStatus(VehicleStatusEnum.ON_WAY);
        }

        vehicleRepository.save(vehicle);
    }
}