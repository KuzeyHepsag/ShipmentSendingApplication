package com.kargo.kargotakip.Dto;


import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ShipmentMovementDTO implements Serializable {
    private Long id;
    private Long shipmentId;
    private WarehouseDTO fromWarehouse;
    private WarehouseDTO toWarehouse;
    private VehicleDTO vehicle;
    private DriverDTO driver;
    private LocalDateTime movementDate;
    private String description;
    private ShipmentStatusEnum status;
}
