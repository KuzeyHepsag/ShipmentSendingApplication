package com.kargo.kargotakip.Service.impl;

import com.kargo.kargotakip.Dto.ShipmentMovementDTO;
import com.kargo.kargotakip.Entity.ShipmentMovement;
import com.kargo.kargotakip.Mapper.ShipmentMovementMapper;
import com.kargo.kargotakip.Repository.ShipmentMovementRepository;
import com.kargo.kargotakip.Service.ShipmentMovementService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ShipmentMovementServiceImpl implements ShipmentMovementService {
    private final ShipmentMovementRepository movementRepository;
    private final ShipmentMovementMapper movementMapper;
    @Override
    @Transactional
    public ShipmentMovementDTO createMovement(ShipmentMovementDTO movementDTO) {
        ShipmentMovement movement=movementMapper.toEntity(movementDTO);
        return movementMapper.toDto(movementRepository.save(movement));
    }

    @Override
    public ShipmentMovementDTO getMovementById(Long id) {
        ShipmentMovement movement=movementRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Hareket kaydı bulunamadı"));
        return movementMapper.toDto(movement);
    }

    @Override
    public List<ShipmentMovementDTO> getAllMovements() {
        Iterable<ShipmentMovement> movements=movementRepository.findAll();
        List<ShipmentMovementDTO> shipmentMovementDTOList=new ArrayList<>();
        for (ShipmentMovement movement : movements){
            shipmentMovementDTOList.add(movementMapper.toDto(movement));
        }
        return shipmentMovementDTOList;
    }

    @Override
    public List<ShipmentMovementDTO> getMovementsByShipmentId(Long shipmentId) {
        Iterable<ShipmentMovement> allMovements=movementRepository.findAll();
        List<ShipmentMovementDTO> filteredList=new ArrayList<>();
        for (ShipmentMovement shipmentMovement: allMovements){
            if (shipmentMovement.getShipment()!=null && shipmentMovement.getShipment().getId()==shipmentId){
                filteredList.add(movementMapper.toDto(shipmentMovement));
            }
        }
        return filteredList;
    }


}
