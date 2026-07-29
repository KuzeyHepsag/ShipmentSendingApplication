package com.kargo.kargotakip.Service.impl;

import com.kargo.kargotakip.Dto.DriverDTO;
import com.kargo.kargotakip.Entity.Driver;
import com.kargo.kargotakip.Mapper.DriverMapper;
import com.kargo.kargotakip.Repository.DriverRepository;
import com.kargo.kargotakip.Service.DriverService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {
    private final DriverMapper driverMapper;
    private final DriverRepository driverRepository;

    @Override
    @Transactional
    public DriverDTO createDriver(DriverDTO driverDTO) {
        Driver driver=driverMapper.toEntity(driverDTO);
        return driverMapper.toDto(driverRepository.save(driver));
    }

    @Override
    public DriverDTO getDriverById(Long id) {
        Driver driver=driverRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Sürücü bulunamadı!"));
        return driverMapper.toDto(driver);
    }

    @Override
    public List<DriverDTO> getAllDrivers() {
        Iterable<Driver> drivers=driverRepository.findAll();
        List<DriverDTO> driverDTOList=new ArrayList<>();
        for (Driver driver : drivers){
            driverDTOList.add(driverMapper.toDto(driver));
        }
        return driverDTOList;
    }

    @Override
    @Transactional
    public DriverDTO updateDriver(Long id, DriverDTO driverDTO) {
        Driver existingDriver=driverRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Güncellenecek sürücü bulunamadı"));
        Driver updatedDriver=Driver.builder()
                .id(existingDriver.getId())
                .firstName(driverDTO.getFirstName())
                .lastName(driverDTO.getLastName())
                .phone(driverDTO.getPhone())
                .licenseNumber(driverDTO.getLicenseNumber())
                .build();
        return driverMapper.toDto(driverRepository.save(updatedDriver));
    }

    @Override
    @Transactional
    public void deleteDriver(Long id) {
        if (!driverRepository.existsById(id)) throw new EntityNotFoundException("Silinecek sürücü bulunamadı!");
        driverRepository.deleteById(id);
    }
}
