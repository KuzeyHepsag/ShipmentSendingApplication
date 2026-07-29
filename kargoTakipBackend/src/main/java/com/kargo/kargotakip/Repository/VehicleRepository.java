package com.kargo.kargotakip.Repository;


import com.kargo.kargotakip.Entity.Customer;
import com.kargo.kargotakip.Entity.Vehicle;
import com.kargo.kargotakip.Enumerations.VehicleStatusEnum;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends PagingAndSortingRepository<Vehicle,Long>, JpaSpecificationExecutor<Vehicle>, CrudRepository<Vehicle,Long> {
    //List<Vehicle> findByIsAvailableTrue();
    List<Vehicle> findByStatus(VehicleStatusEnum status);
}
