package com.kargo.kargotakip.Dto;


import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShipmentDTO implements Serializable {
    private Long id;
    private String trackingNumber;
    private CustomerDTO sender;
    private CustomerDTO receiver;
    private ShipmentStatusEnum status;
    private Double weight;
    private String currentWarehouseName;
    private String toWarehouseName;
}
