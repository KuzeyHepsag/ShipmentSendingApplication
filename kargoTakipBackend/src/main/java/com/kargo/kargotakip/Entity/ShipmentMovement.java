package com.kargo.kargotakip.Entity;


import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "SHIPMENT_MOVEMENT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ShipmentMovement {
    @Id
    @SequenceGenerator(name = "MOVEMENT_ID_GENERATOR", sequenceName = "MOVEMENT_ID_GEN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MOVEMENT_ID_GENERATOR")
    @Column(unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SHIPMENT_ID", nullable = false)
    private Shipment shipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FROM_WAREHOUSE_ID")
    private Warehouse fromWarehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TO_WAREHOUSE_ID")
    private Warehouse toWarehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VEHICLE_ID")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DRIVER_ID")
    private Driver driver;

    @Column(name = "MOVEMENT_DATE")
    private LocalDateTime movementDate;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private ShipmentStatusEnum status;

}
