package com.kargo.kargotakip.Dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendShipmentRequest {
    private Long receiverId;
    private Double weight;
}
