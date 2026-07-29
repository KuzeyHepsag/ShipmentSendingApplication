package com.kargo.kargotakip.Controller;

import com.kargo.kargotakip.Dto.CustomerDTO;
import com.kargo.kargotakip.Entity.Customer;
import com.kargo.kargotakip.Entity.User;
import com.kargo.kargotakip.Repository.CustomerRepository;
import com.kargo.kargotakip.Repository.UserRepository;
import com.kargo.kargotakip.Service.CustomerService;
import com.kargo.kargotakip.Utils.ResponsePayload; // Kendi paket yoluna göre düzelt
import com.kargo.kargotakip.Enumerations.ResponseEnum; // Kendi paket yoluna göre düzelt
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;



    @PostMapping
    public ResponseEntity<ResponsePayload<CustomerDTO>> createCustomer(@RequestBody CustomerDTO customerDTO) {
        CustomerDTO createdCustomer = customerService.createCustomer(customerDTO);

        ResponsePayload<CustomerDTO> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Müşteri başarıyla oluşturuldu.");
        payload.setSuccess(true);
        payload.setData(createdCustomer);
        payload.setResponseEnum(ResponseEnum.OK);

        return new ResponseEntity<>(payload, HttpStatus.CREATED);
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ResponsePayload<CustomerDTO>> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);

        ResponsePayload<CustomerDTO> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(customer);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @GetMapping
    public ResponseEntity<ResponsePayload<List<CustomerDTO>>> getAllCustomers() {
        List<CustomerDTO> customerDTOList = customerService.getAllCustomers();

        ResponsePayload<List<CustomerDTO>> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(customerDTOList);
        payload.setResponseEnum(ResponseEnum.OK);

        return ResponseEntity.ok(payload);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponsePayload<CustomerDTO>> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);

        ResponsePayload<CustomerDTO> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setSuccess(true);
        payload.setData(updatedCustomer);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponsePayload<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);

        ResponsePayload<Void> payload = new ResponsePayload<>();
        payload.setCode(ResponseEnum.OK.getHttpStatusCode());
        payload.setMessage("Müşteri başarıyla silindi.");
        payload.setSuccess(true);
        payload.setResponseEnum(ResponseEnum.OK);
        return ResponseEntity.ok(payload);
    }
    @GetMapping("/my-id")
    public ResponseEntity<Long> getMyCustomerId(Authentication authentication){
        Long id=customerService.getMyCustomerId(authentication);
        return ResponseEntity.ok(id);
    }
    @GetMapping("/me")
    public ResponseEntity<CustomerDTO> getMyProfile(Authentication authentication) {
        Long myId = customerService.getMyCustomerId(authentication);
        return ResponseEntity.ok(customerService.getCustomerById(myId));
    }
}