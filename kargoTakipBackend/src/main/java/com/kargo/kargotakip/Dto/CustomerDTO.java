package com.kargo.kargotakip.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO implements Serializable {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;
    private WarehouseDTO closestWarehouse;
}
