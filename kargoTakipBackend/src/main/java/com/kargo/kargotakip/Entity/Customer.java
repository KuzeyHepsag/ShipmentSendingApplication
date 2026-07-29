package com.kargo.kargotakip.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.concurrent.ThreadLocalRandom;

@Entity
@Table(name = "CUSTOMER")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(name = "FIRST_NAME", length = 50)
    private String firstName;

    @Column(name = "LAST_NAME", length = 50)
    private String lastName;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "PHONE", length = 20, unique = true)
    private String phone;

    @Column(name = "ADDRESS", length = 500)
    private String address;

    @Column(name = "LATITUDE")
    private Double latitude;

    @Column(name = "LONGITUDE")
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closest_warehouse_id")
    private Warehouse closestWarehouse;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = ThreadLocalRandom.current().nextLong(10_000_000_000L, 100_000_000_000L);
        }
    }
}