package com.kargo.kargotakip.Service;


import com.kargo.kargotakip.Dto.CustomerDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface CustomerService {
    CustomerDTO createCustomer(CustomerDTO customerDTO);
    CustomerDTO getCustomerById(Long id);
    List<CustomerDTO> getAllCustomers();
    CustomerDTO updateCustomer(Long id,CustomerDTO customerDTO);
    void deleteCustomer(Long id);
    Long getMyCustomerId(Authentication authentication);
}
