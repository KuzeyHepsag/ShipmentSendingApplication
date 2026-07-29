package com.kargo.kargotakip.Controller;


import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.VehicleDTO;
import com.kargo.kargotakip.Dto.WarehouseDTO;
import com.kargo.kargotakip.Entity.Warehouse;
import com.kargo.kargotakip.Enumerations.ResponseEnum;
import com.kargo.kargotakip.Service.WarehouseService;
import com.kargo.kargotakip.Utils.ResponsePayload;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<WarehouseDTO>> createWarehouse(@RequestBody WarehouseDTO warehouseDTO){
        WarehouseDTO warehouseDTO1=service.createWarehouse(warehouseDTO);
        ResponsePayload<WarehouseDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Depo başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(warehouseDTO1);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponsePayload<WarehouseDTO>> getWarehouseById(@PathVariable Long id){
        WarehouseDTO warehouseDTO=service.getWarehouseById(id);
        ResponsePayload<WarehouseDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(warehouseDTO);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @GetMapping
    public ResponseEntity<ResponsePayload<List<WarehouseDTO>>> getAllWarehouses(){
        List<WarehouseDTO> warehouseDTOList=service.getAllWarehouses();
        ResponsePayload<List<WarehouseDTO>> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(warehouseDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<WarehouseDTO>> updateWarehouse(@PathVariable Long id,@RequestBody WarehouseDTO warehouseDTO){
        WarehouseDTO warehouseDTO1=service.updateWarehouse(id,warehouseDTO);
        ResponsePayload<WarehouseDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(warehouseDTO1);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<Void>> deleteWarehouse(@PathVariable Long id){
        service.deleteWarehouse(id);
        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Depo başarıyla silindi.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
    @GetMapping("/cities")
    public ResponseEntity<ResponsePayload<List<String>>> getAllCities() {
        List<String> cities = service.getAllCities(); // Service metodunu aşağıda yazacağız
        ResponsePayload<List<String>> payload = new ResponsePayload<>();
        payload.setSuccess(true);
        payload.setData(cities);
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/districts/{city}")
    public ResponseEntity<ResponsePayload<List<String>>> getDistrictsByCity(@PathVariable String city) {
        List<String> districts = service.getDistrictsByCity(city);
        ResponsePayload<List<String>> payload = new ResponsePayload<>();
        payload.setSuccess(true);
        payload.setData(districts);
        return ResponseEntity.ok(payload);
    }
    @GetMapping("/{warehouseId}/shipments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ShipmentDTO>> getShipmentsByWarehouse(@PathVariable Long warehouseId) {
        List<ShipmentDTO> shipments = service.getWarehouseShipments(warehouseId);
        return ResponseEntity.ok(shipments);

    }
}
