package com.kargo.kargotakip.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Builder
public class WarehouseDTO implements Serializable {
    private Long id;
    private String name;
    private String city;
    private String district;
    private String address;
    private String phone;
    private Double latitude;
    private Double longitude;
}
