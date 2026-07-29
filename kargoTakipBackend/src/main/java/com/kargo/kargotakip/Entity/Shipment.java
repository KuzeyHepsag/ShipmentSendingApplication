package com.kargo.kargotakip.Entity;


import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Table(name = "SHIPMENT")
public class Shipment {
    @Id
    @SequenceGenerator(name = "SHIPMENT_ID_GENERATOR", sequenceName = "SHIPMENT_ID_GEN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SHIPMENT_ID_GENERATOR")
    @Column(unique = true, nullable = false)
    private Long id;
    @Column(name = "TRACKING_NUMBER", length = 50, unique = true, nullable = false)
    private String trackingNumber;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SENDER_ID",nullable = false)
    private Customer sender;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECEIVER_ID", nullable = false)
    private Customer receiver;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 30)
    private ShipmentStatusEnum status;

    @Column(name = "WEIGHT")
    private Double weight;

    //uygulamaya find warehouse by id ekleriz warehouse listesi olur hangi depoda seçeneği olur ona tıkladığımızda direkt olarak search yapıp depoyu gösterir.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_warehouse_id")
    private Warehouse currentWarehouse;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="to_warehouse_id")
    private Warehouse toWarehouse;
}
