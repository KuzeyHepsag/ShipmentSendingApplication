package com.kargo.kargotakip.Dto;


import com.kargo.kargotakip.Entity.Warehouse;
import com.kargo.kargotakip.Enumerations.VehicleStatusEnum;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleDTO implements Serializable {
    private Long id;
    private String plateNumber;
    private VehicleStatusEnum status;
    private List<ShipmentDTO> shipmentDTOList;
    private Warehouse currentWarehouse;
    private Long load;

}
