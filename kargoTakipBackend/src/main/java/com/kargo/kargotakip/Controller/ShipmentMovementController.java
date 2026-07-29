package com.kargo.kargotakip.Controller;


import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.ShipmentMovementDTO;
import com.kargo.kargotakip.Enumerations.ResponseEnum;
import com.kargo.kargotakip.Service.ShipmentMovementService;
import com.kargo.kargotakip.Utils.ResponsePayload;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/movements")
public class ShipmentMovementController {
    private final ShipmentMovementService service;

    @PostMapping
    public ResponseEntity<ResponsePayload<ShipmentMovementDTO>> createMovement(@RequestBody ShipmentMovementDTO shipmentMovementDTO){
        ShipmentMovementDTO shipmentMovementDTO1=service.createMovement(shipmentMovementDTO);
        ResponsePayload<ShipmentMovementDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Hareket başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(shipmentMovementDTO1);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);

    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponsePayload<ShipmentMovementDTO>> getMovementById(@PathVariable Long id) {
        ShipmentMovementDTO shipmentMovementDTO=service.getMovementById(id);
        ResponsePayload<ShipmentMovementDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(shipmentMovementDTO);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @GetMapping
    public ResponseEntity<ResponsePayload<List<ShipmentMovementDTO>>> getAllMovements() {
        List<ShipmentMovementDTO> shipmentMovementDTOList=service.getAllMovements();
        ResponsePayload<List<ShipmentMovementDTO>> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(shipmentMovementDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<ResponsePayload<List<ShipmentMovementDTO>>> getMovementsByShipmentId(@PathVariable Long shipmentId) {
        List<ShipmentMovementDTO> shipmentMovementDTOList=service.getMovementsByShipmentId(shipmentId);
        ResponsePayload<List<ShipmentMovementDTO>> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(shipmentMovementDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
}
