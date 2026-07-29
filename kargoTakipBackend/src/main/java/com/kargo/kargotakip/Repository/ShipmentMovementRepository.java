package com.kargo.kargotakip.Repository;


import com.kargo.kargotakip.Entity.Customer;
import com.kargo.kargotakip.Entity.ShipmentMovement;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipmentMovementRepository extends PagingAndSortingRepository<ShipmentMovement,Long>, JpaSpecificationExecutor<ShipmentMovement>, CrudRepository<ShipmentMovement,Long> {
    void deleteByShipmentId(Long shipmentId);
}
