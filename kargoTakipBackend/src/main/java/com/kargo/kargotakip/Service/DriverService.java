package com.kargo.kargotakip.Service;

import com.kargo.kargotakip.Dto.DriverDTO;

import java.util.List;

public interface DriverService {
    DriverDTO createDriver(DriverDTO driverDTO);
    DriverDTO getDriverById(Long id);
    List<DriverDTO> getAllDrivers();
    DriverDTO updateDriver(Long id, DriverDTO driverDTO);
    void deleteDriver(Long id);
}
