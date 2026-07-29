package com.kargo.kargotakip.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "WAREHOUSE")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {
    @Id
    @SequenceGenerator(name = "WAREHOUSE_ID_GENERATOR", sequenceName = "WAREHOUSE_ID_GEN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "WAREHOUSE_ID_GENERATOR")
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(name = "NAME", length = 100)
    private String name;

    @Column(name = "CITY", length = 50)
    private String city;

    @Column(name = "DISTRICT", length = 50)
    private String district;

    @Column(name = "ADDRESS", length = 500)
    private String address;

    @Column(name = "PHONE", length = 20)
    private String phone;

    @Column(name = "LATITUDE")
    private Double latitude;

    @Column(name = "LONGITUDE")
    private Double longitude;
}
