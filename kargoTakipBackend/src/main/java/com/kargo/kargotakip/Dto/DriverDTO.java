package com.kargo.kargotakip.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class DriverDTO implements Serializable {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String licenseNumber;
}
