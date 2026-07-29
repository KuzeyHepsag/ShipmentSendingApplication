package com.kargo.kargotakip.Controller;


import com.kargo.kargotakip.Dto.SendShipmentRequest;
import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Dto.WarehouseDTO;
import com.kargo.kargotakip.Entity.User;
import com.kargo.kargotakip.Enumerations.ResponseEnum;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import com.kargo.kargotakip.Repository.UserRepository;
import com.kargo.kargotakip.Service.ShipmentService;
import com.kargo.kargotakip.Service.WarehouseService;
import com.kargo.kargotakip.Utils.ResponsePayload;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    private final ShipmentService service;
    private final WarehouseService warehouseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<ShipmentDTO>> createShipment(@RequestBody ShipmentDTO shipmentDTO){
        ShipmentDTO createdShipment=service.createShipment(shipmentDTO);
        ResponsePayload<ShipmentDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Kargo başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(createdShipment);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponsePayload<ShipmentDTO>> getShipmentById(@PathVariable Long id){
        ShipmentDTO shipmentDTO=service.getShipmentById(id);
        ResponsePayload<ShipmentDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(shipmentDTO);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsePayload<List<ShipmentDTO>>> getAllShipment(){
        List<ShipmentDTO> shipmentDTOList=service.getAllShipments();
        ResponsePayload<List<ShipmentDTO>> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(shipmentDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponsePayload<ShipmentDTO>> updateShipmentStatus(@PathVariable Long id, @RequestParam ShipmentStatusEnum status,@RequestParam(required = false, defaultValue = "Durum güncellendi.") String notes){
        ShipmentDTO updatedShipment=service.updateShipmentStatus(id,status,notes);
        ResponsePayload<ShipmentDTO> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(updatedShipment);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponsePayload<Void>> deleteShipment(@PathVariable Long id){
        service.deleteShipment(id);
        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Kargo başarıyla silindi.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
    @GetMapping("/search")
    public ResponseEntity<ResponsePayload<List<ShipmentDTO>>> searchShipments(@RequestParam(required = false)ShipmentStatusEnum status,@RequestParam(required = false) String trackingNumber,@RequestParam(required = false) Double minWeight){
        List<ShipmentDTO> searchResults=service.searchShipments(status,trackingNumber,minWeight);
        ResponsePayload<List<ShipmentDTO>> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(searchResults);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @GetMapping("/my-shipments")
    public ResponseEntity<ResponsePayload<List<ShipmentDTO>>> getMyShipments(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Kullanıcı girişi doğrulanmadı!");
        }

        String username = authentication.getName();

        List<ShipmentDTO> myShipments = service.getMyShipments(username);

        ResponsePayload<List<ShipmentDTO>> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(myShipments);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @PostMapping("/send")
    public ResponseEntity<ResponsePayload<ShipmentDTO>> sendShipment(@RequestBody SendShipmentRequest request) {
        ShipmentDTO createdShipment = service.sendShipment(request);
        ResponsePayload<ShipmentDTO> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Kargo başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(createdShipment);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ResponsePayload<Void>> approveShipment(@PathVariable Long id){
        service.approveShipment(id);
        ResponsePayload<Void> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Kargo onaylandı.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
    @PutMapping("/{id}/reject")
    public ResponseEntity<ResponsePayload<Void>> rejectShipment(@PathVariable Long id){
        service.rejectShipment(id);
        ResponsePayload<Void> payload=new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Kargo reddedildi.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }



}
