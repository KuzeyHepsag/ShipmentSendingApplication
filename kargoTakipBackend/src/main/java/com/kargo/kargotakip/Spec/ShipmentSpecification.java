package com.kargo.kargotakip.Spec;

import com.kargo.kargotakip.Entity.Shipment;
import com.kargo.kargotakip.Enumerations.ShipmentStatusEnum;
import org.springframework.data.jpa.domain.Specification;

public class ShipmentSpecification {

    public static Specification<Shipment> hasStatus(ShipmentStatusEnum status){
        return (root, query, criteriaBuilder) -> {
            if (status==null) return null;
            return criteriaBuilder.equal(root.get("status"),status);
        };
    }

    public static Specification<Shipment> hasTrackingNumber(String trackingNumber){
        return (root, query, criteriaBuilder) -> {
            if (trackingNumber==null || trackingNumber.isEmpty()) return null;
            return criteriaBuilder.equal(root.get("trackingNumber"),trackingNumber);
        };
    }

    public static Specification<Shipment> weightGreaterThan(Double minWeight){
        return (root, query, criteriaBuilder) -> {
          if (minWeight==null) return null;
          return criteriaBuilder.greaterThanOrEqualTo(root.get("weight"),minWeight);
        };
    }

}
