package com.kargo.kargotakip.Service.impl;

import com.kargo.kargotakip.Dto.SendShipmentRequest;
import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.ShipmentMovementDTO;
import com.kargo.kargotakip.Entity.*;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import com.kargo.kargotakip.Gateway.SmsGateway;
import com.kargo.kargotakip.Mapper.CustomerMapper;
import com.kargo.kargotakip.Mapper.ShipmentMapper;
import com.kargo.kargotakip.Mapper.ShipmentMovementMapper;
import com.kargo.kargotakip.Mapper.WarehouseMapper;
import com.kargo.kargotakip.Repository.*;
import com.kargo.kargotakip.Service.ShipmentMovementService;
import com.kargo.kargotakip.Service.ShipmentService;
import com.kargo.kargotakip.Spec.ShipmentSpecification;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {
    private final ShipmentRepository shipmentRepository;
    private final ShipmentMapper shipmentMapper;
    private final SmsGateway smsGateway;
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserRepository userRepository;
    private final ShipmentMovementRepository movementRepository;
    private final WarehouseRepository warehouseRepository;
    private final ShipmentMovementService movementService;
    private final ShipmentMovementMapper shipmentMovementMapper;
    private final WarehouseMapper warehouseMapper;
    @Override
    @Transactional
    public ShipmentDTO createShipment(ShipmentDTO shipmentDTO) {
        Customer sender = customerRepository.findById(shipmentDTO.getSender().getId())
                .orElseThrow(() -> new EntityNotFoundException("Gönderici bulunamadı!"));

        Customer receiver = customerRepository.findById(shipmentDTO.getReceiver().getId())
                .orElseThrow(() -> new EntityNotFoundException("Alıcı bulunamadı!"));

        Shipment shipment = shipmentMapper.toEntity(shipmentDTO);
        shipment.setSender(sender);
        shipment.setReceiver(receiver);

        Shipment savedShipment = shipmentRepository.save(shipment);


        return shipmentMapper.toDto(savedShipment);
    }

    @Override
    public ShipmentDTO getShipmentById(Long id) {
        Shipment shipment=shipmentRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Kargo bulunamadı!"));
        return shipmentMapper.toDto(shipment);
    }

    @Override
    public List<ShipmentDTO> getAllShipments() {
        Iterable<Shipment> shipments=shipmentRepository.findAll();
        List<ShipmentDTO> shipmentDTOList=new ArrayList<>();
        for (Shipment shipment : shipments){
            shipmentDTOList.add(shipmentMapper.toDto(shipment));
        }
        return shipmentDTOList;
    }

    @Override
    @Transactional
    public ShipmentDTO updateShipmentStatus(Long id, ShipmentStatusEnum newStatus, String notes) {
        Shipment existingShipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kargo bulunamadı!"));
        if (existingShipment.getStatus() == ShipmentStatusEnum.PENDING_APPROVAL ||
                existingShipment.getStatus() == ShipmentStatusEnum.REJECTED) {
            throw new IllegalStateException("Kargo henüz onaylanmadığı veya reddedildiği için durum güncellenemez.");
        }
        Warehouse oldWarehouse=existingShipment.getCurrentWarehouse();
        if (newStatus == ShipmentStatusEnum.IN_TRANSIT || newStatus==ShipmentStatusEnum.OUT_FOR_DELIVERY) {
            existingShipment.setCurrentWarehouse(null);
        }

        existingShipment.setStatus(newStatus);



        Shipment savedShipment = shipmentRepository.save(existingShipment);

        ShipmentMovementDTO movementDTO=new ShipmentMovementDTO();
        movementDTO.setShipmentId(savedShipment.getId());
        movementDTO.setFromWarehouse(warehouseMapper.toDto(oldWarehouse));
        movementDTO.setToWarehouse(warehouseMapper.toDto(existingShipment.getToWarehouse()));
        movementDTO.setStatus(newStatus);
        movementDTO.setMovementDate(LocalDateTime.now());
        movementDTO.setDescription("Durum Güncellendi "+newStatus + ".Not:"+notes);
        movementService.createMovement(movementDTO);


        return shipmentMapper.toDto(savedShipment);
    }

    @Override
    @Transactional
    public void deleteShipment(Long id) {
        if (!shipmentRepository.existsById(id)){
            throw new EntityNotFoundException("Silinecek kargo bulunamadı");
        }

        movementRepository.deleteByShipmentId(id);
        shipmentRepository.deleteById(id);
    }

    @Override
    public List<ShipmentDTO> searchShipments(ShipmentStatusEnum status, String trackingNumber, Double minWeight) {
        Specification<Shipment> spec = Specification.where(ShipmentSpecification.hasStatus(status))
                .and(ShipmentSpecification.hasTrackingNumber(trackingNumber))
                .and(ShipmentSpecification.weightGreaterThan(minWeight));
        Iterable<Shipment> shipments=shipmentRepository.findAll(spec);
        List<ShipmentDTO> shipmentDTOList=new ArrayList<>();
        for (Shipment shipment : shipments){
            shipmentDTOList.add(shipmentMapper.toDto(shipment));
        }
        return shipmentDTOList;
    }

    @Override
    public List<ShipmentDTO> getMyShipments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + username));

        if (user.getCustomer() == null) {
            return new ArrayList<>(); // Müşteri kaydı yoksa boş liste dön
        }

        return shipmentRepository.findBySender_IdOrReceiver_Id(
                        user.getCustomer().getId(),
                        user.getCustomer().getId()
                ).stream()
                .map(shipmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ShipmentDTO sendShipment(SendShipmentRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User senderUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Gönderici bulunamadı!"));
        Customer sender = senderUser.getCustomer();
        Warehouse senderWarehouse = sender.getClosestWarehouse();
        if (senderWarehouse == null) {
            throw new RuntimeException("Profilinize tanımlı bir çıkış deposu bulunamadı. Lütfen konum bilginizi güncelleyin.");
        }
        Customer receiver = customerRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Bu ID'ye ait bir alıcı bulunamadı!"));
        Warehouse receiverWarehouse = receiver.getClosestWarehouse();
        if (receiverWarehouse == null) {
            throw new RuntimeException("Alıcıya tanımlı bir varış deposu bulunamadı. Alıcının konum bilgisi eksik.");
        }
        if (getMyShipments(senderUser.getUsername()).size() > 10) {
            throw new RuntimeException("En fazla 10 adet kargo gönderebilirsiniz.");
        }

        String generatedTrackingNumber = "TRK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Shipment shipment = new Shipment();
        shipment.setTrackingNumber(generatedTrackingNumber);
        shipment.setWeight(request.getWeight());
        shipment.setStatus(ShipmentStatusEnum.PENDING_APPROVAL);
        shipment.setSender(sender);
        shipment.setReceiver(receiver);
        shipment.setCurrentWarehouse(senderWarehouse);
        shipment.setToWarehouse(receiverWarehouse);
        Shipment savedShipment = shipmentRepository.save(shipment);
        ShipmentMovementDTO shipmentMovementDTO = new ShipmentMovementDTO();
        shipmentMovementDTO.setShipmentId(savedShipment.getId());
        shipmentMovementDTO.setMovementDate(LocalDateTime.now());
        shipmentMovementDTO.setStatus(savedShipment.getStatus());
        shipmentMovementDTO.setFromWarehouse(warehouseMapper.toDto(senderWarehouse));
        shipmentMovementDTO.setDescription("Kargo " + senderWarehouse.getName() + " üzerinden oluşturuldu ve onay bekliyor.");

        movementService.createMovement(shipmentMovementDTO);

        return shipmentMapper.toDto(savedShipment);
    }

    @Override
    @Transactional
    public void approveShipment(Long id) {
        Shipment shipment=shipmentRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Kargo bulunamadı."));
        shipment.setStatus(ShipmentStatusEnum.APPROVED);
        ShipmentMovementDTO shipmentMovementDTO=new ShipmentMovementDTO();
        shipmentMovementDTO.setShipmentId(shipment.getId());
        shipmentMovementDTO.setMovementDate(LocalDateTime.now());
        shipmentMovementDTO.setStatus(ShipmentStatusEnum.APPROVED);
        shipmentMovementDTO.setFromWarehouse(warehouseMapper.toDto(shipment.getCurrentWarehouse()));
        shipmentMovementDTO.setDescription("Kargo onaylandı.");
        movementService.createMovement(shipmentMovementDTO);
        shipmentRepository.save(shipment);
    }

    @Override
    @Transactional
    public void rejectShipment(Long id) {
        Shipment shipment=shipmentRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Kargo bulunamadı."));
        shipment.setStatus(ShipmentStatusEnum.REJECTED);
        ShipmentMovementDTO shipmentMovementDTO=new ShipmentMovementDTO();
        shipmentMovementDTO.setShipmentId(shipment.getId());
        shipmentMovementDTO.setMovementDate(LocalDateTime.now());
        shipmentMovementDTO.setStatus(ShipmentStatusEnum.REJECTED);
        shipmentMovementDTO.setFromWarehouse(warehouseMapper.toDto(shipment.getCurrentWarehouse()));
        shipmentMovementDTO.setDescription("Kargo reddedildi.");
        movementService.createMovement(shipmentMovementDTO);
        shipmentRepository.save(shipment);
    }




}
