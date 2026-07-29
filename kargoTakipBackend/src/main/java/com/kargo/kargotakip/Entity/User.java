package com.kargo.kargotakip.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.concurrent.ThreadLocalRandom;

@Entity
@Table(name = "USERS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;

    @Column(unique = true)
    private String username;

    private String password;

    private String role;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = ThreadLocalRandom.current().nextLong(10_000_000_000L, 100_000_000_000L);
        }
    }
}
