package com.kargo.kargotakip.Controller;


import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.VehicleDTO;
import com.kargo.kargotakip.Enumerations.ResponseEnum;
import com.kargo.kargotakip.Service.VehicleService;
import com.kargo.kargotakip.Utils.ResponsePayload;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<VehicleDTO>> createVehicle(@RequestBody VehicleDTO vehicleDTO){
        VehicleDTO vehicleDTO1=service.createVehicle(vehicleDTO);
        ResponsePayload<VehicleDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Araç başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(vehicleDTO1);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<VehicleDTO>> getVehicleById(@PathVariable Long id) {
        VehicleDTO vehicleDTO=service.getVehicleById(id);
        ResponsePayload<VehicleDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(vehicleDTO);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<List<VehicleDTO>>> getAllVehicles() {
        List<VehicleDTO> vehicleDTOList=service.getAllVehicles();
        ResponsePayload<List<VehicleDTO>> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(vehicleDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<VehicleDTO>> updateVehicle(@PathVariable Long id, @RequestBody VehicleDTO vehicleDTO) {
        VehicleDTO vehicleDTO1=service.updateVehicle(id,vehicleDTO);
        ResponsePayload<VehicleDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(vehicleDTO1);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<Void>> deleteVehicle(@PathVariable Long id) {
        service.deleteVehicle(id);
        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Araç başarıyla silindi.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
    @PostMapping("/{vehicleId}/dispatch/{warehouseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<String>> dispatchVehicle(@PathVariable Long vehicleId, @PathVariable Long warehouseId) {
        service.loadAndDispatch(vehicleId, warehouseId);
        ResponsePayload<String> payload = new ResponsePayload<>();
        payload.setMessage("Araç başarıyla dağıtıma çıkarıldı.");
        payload.setSuccess(true);
        return ResponseEntity.ok(payload);
    }
    @PostMapping("/{vehicleId}/deload/{warehouseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<String>> deloadVehicle(@PathVariable Long vehicleId, @PathVariable Long warehouseId) {
        service.deload(vehicleId, warehouseId);
        ResponsePayload<String> payload = new ResponsePayload<>();
        payload.setMessage("Araçtaki ilgili kargolar başarıyla depoya boşaltıldı.");
        payload.setSuccess(true);
        return ResponseEntity.ok(payload);
    }
    @GetMapping("/{id}/shipments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<List<ShipmentDTO>>> getVehicleShipments(@PathVariable Long id) {
        VehicleDTO vehicleDTO = service.getVehicleById(id);
        List<ShipmentDTO> shipments = vehicleDTO.getShipmentDTOList();
        ResponsePayload<List<ShipmentDTO>> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Aracın kargoları başarıyla getirildi.");
        payload.setSuccess(true);
        payload.setData(shipments);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
}
