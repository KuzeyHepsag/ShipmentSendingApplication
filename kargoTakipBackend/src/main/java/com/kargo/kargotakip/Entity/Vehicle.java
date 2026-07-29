package com.kargo.kargotakip.Entity;

import com.kargo.kargotakip.Enumerations.VehicleStatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter 
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "VEHICLE")
public class Vehicle {
    @Id
    @SequenceGenerator(name = "VEHICLE_ID_GENERATOR", sequenceName = "VEHICLE_ID_GEN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "VEHICLE_ID_GENERATOR")
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(name = "PLATE_NUMBER", length = 20, unique = true)
    private String plateNumber;
    /*
    @Column(name = "IS_AVAILABLE")
    private Boolean isAvailable=true;
     */
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private List<Shipment> shipments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_warehouse_id")
    private Warehouse currentWarehouse;

    @Column(name= "LOAD")
    private Long load;

    @Column(name = "STATUS")
    private VehicleStatusEnum status;

}
