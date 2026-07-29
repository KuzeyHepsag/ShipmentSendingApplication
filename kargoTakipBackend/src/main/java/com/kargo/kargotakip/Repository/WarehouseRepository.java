package com.kargo.kargotakip.Repository;


import com.kargo.kargotakip.Entity.Customer;
import com.kargo.kargotakip.Entity.Warehouse;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarehouseRepository extends PagingAndSortingRepository<Warehouse,Long>, JpaSpecificationExecutor<Warehouse>, CrudRepository<Warehouse,Long> {
    Optional<Warehouse> findFirstByCityIgnoreCaseAndDistrictIgnoreCase(String city,String district);
    Optional<Warehouse> findByName(String name);
}
