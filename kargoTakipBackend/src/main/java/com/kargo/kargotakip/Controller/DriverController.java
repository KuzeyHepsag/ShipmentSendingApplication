package com.kargo.kargotakip.Controller;


import com.kargo.kargotakip.Dto.CustomerDTO;
import com.kargo.kargotakip.Dto.DriverDTO;
import com.kargo.kargotakip.Entity.Driver;
import com.kargo.kargotakip.Enumerations.ResponseEnum;
import com.kargo.kargotakip.Service.DriverService;
import com.kargo.kargotakip.Utils.ResponsePayload;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriverController {
    private final DriverService service;

    @PostMapping
    public ResponseEntity<ResponsePayload<DriverDTO>> createDriver(@RequestBody DriverDTO driverDTO){
        DriverDTO driverDTO1=service.createDriver(driverDTO);
        ResponsePayload<DriverDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Sürücü başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(driverDTO1);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponsePayload<DriverDTO>> getDriverById(@PathVariable Long id){
        DriverDTO driverDTO=service.getDriverById(id);
        ResponsePayload<DriverDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(driverDTO);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @GetMapping
    public ResponseEntity<ResponsePayload<List<DriverDTO>>> getAllDrivers(){
        List<DriverDTO> driverDTOList = service.getAllDrivers();

        ResponsePayload<List<DriverDTO>> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(driverDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponsePayload<DriverDTO>> updateDriver(@PathVariable Long id,@RequestBody DriverDTO driverDTO){
        DriverDTO updatedDriver = service.updateDriver(id, driverDTO);

        ResponsePayload<DriverDTO> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(updatedDriver);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponsePayload<Void>> deleteDriver(@PathVariable Long id){
        service.deleteDriver(id);

        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Sürücü başarıyla silindi.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
}
