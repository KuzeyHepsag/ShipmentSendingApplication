package com.kargo.kargotakip.Repository;


import com.kargo.kargotakip.Dto.ShipmentDTO;
import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentRepository extends PagingAndSortingRepository<Shipment,Long>, JpaSpecificationExecutor<Shipment>, CrudRepository<Shipment,Long> {
    List<Shipment> findBySender_IdOrReceiver_Id(Long senderId, Long receiverId);
    List<Shipment> findAllByCurrentWarehouseId(Long warehouseId);
}
