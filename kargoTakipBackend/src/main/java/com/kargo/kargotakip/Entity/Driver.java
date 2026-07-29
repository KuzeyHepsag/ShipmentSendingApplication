package com.kargo.kargotakip.Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "DRIVER")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Driver {
    @Id
    @SequenceGenerator(name = "DRIVER_ID_GENERATOR", sequenceName = "DRIVER_ID_GEN", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DRIVER_ID_GENERATOR")
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(name = "FIRST_NAME", length = 50)
    private String firstName;

    @Column(name = "LAST_NAME", length = 50)
    private String lastName;

    @Column(name = "PHONE", length = 20)
    private String phone;

    @Column(name = "LICENSE_NUMBER", length = 30)
    private String licenseNumber;
}
