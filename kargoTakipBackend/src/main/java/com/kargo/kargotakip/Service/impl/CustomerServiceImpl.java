package com.kargo.kargotakip.Service.impl;


import com.kargo.kargotakip.Dto.CustomerDTO;
import com.kargo.kargotakip.Entity.Customer;
import com.kargo.kargotakip.Entity.User;
import com.kargo.kargotakip.Entity.Warehouse;
import com.kargo.kargotakip.Mapper.CustomerMapper;
import com.kargo.kargotakip.Mapper.WarehouseMapper;
import com.kargo.kargotakip.Repository.CustomerRepository;
import com.kargo.kargotakip.Repository.UserRepository;
import com.kargo.kargotakip.Repository.WarehouseRepository;
import com.kargo.kargotakip.Service.CustomerService;
import com.kargo.kargotakip.Service.WarehouseService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserRepository userRepository;
    private final WarehouseMapper warehouseMapper;
    private final WarehouseRepository warehouseRepository;
    private final WarehouseService warehouseService;
    @Override
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer=customerMapper.toEntity(customerDTO);
        assignClosestWarehouse(customer);
        return customerMapper.toDto(customerRepository.save(customer));
    }

    @Override
    public CustomerDTO getCustomerById(Long id) {
        Customer customer=customerRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Müşteri bulunamadı!"));
        return customerMapper.toDto(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        Iterable<Customer> customers=customerRepository.findAll();
        List<CustomerDTO> customerDTOList=new ArrayList<>();
        for (Customer customer : customers){
            customerDTOList.add(customerMapper.toDto(customer));
        }
        return customerDTOList;
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Güncellenecek müşteri bulunamadı"));
        if (customerDTO.getFirstName() != null) existingCustomer.setFirstName(customerDTO.getFirstName());
        if (customerDTO.getLastName() != null) existingCustomer.setLastName(customerDTO.getLastName());
        if (customerDTO.getEmail() != null) existingCustomer.setEmail(customerDTO.getEmail());
        if (customerDTO.getPhone() != null) existingCustomer.setPhone(customerDTO.getPhone());
        if (customerDTO.getAddress() != null) existingCustomer.setAddress(customerDTO.getAddress());
        if (customerDTO.getLatitude() != null) existingCustomer.setLatitude(customerDTO.getLatitude());
        if (customerDTO.getLongitude() != null) existingCustomer.setLongitude(customerDTO.getLongitude());
        assignClosestWarehouse(existingCustomer);
        existingCustomer = customerRepository.save(existingCustomer);
        return customerMapper.toDto(existingCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) throw new EntityNotFoundException("Silinecek müşteri bulunamadı");
        customerRepository.deleteById(id);
    }

    @Override
    public Long getMyCustomerId(Authentication authentication) {
        String username=authentication.getName();
        User user=userRepository.findByUsername(username).orElseThrow(()->new RuntimeException("Kullanıcı Bulunamadı"));
        return user.getCustomer().getId();
    }

    private void assignClosestWarehouse(Customer customer) {
        if (customer.getLatitude() != null && customer.getLongitude() != null) {
            Iterable<Warehouse> warehouses = warehouseRepository.findAll();
            Warehouse closest = null;
            double minDistance = Double.MAX_VALUE;

            for (Warehouse warehouse : warehouses) {
                if (warehouse.getLatitude() != null && warehouse.getLongitude() != null) {
                    double distance = warehouseService.getRealDrivingDistance(
                            customer.getLatitude(), customer.getLongitude(),
                            warehouse.getLatitude(), warehouse.getLongitude()
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closest = warehouse;
                    }
                }
            }

            customer.setClosestWarehouse(closest);
        }
    }
}
