package com.kargo.kargotakip.Repository;


import com.kargo.kargotakip.Entity.Customer;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends PagingAndSortingRepository<Customer,Long>, JpaSpecificationExecutor<Customer>, CrudRepository<Customer,Long> {
}
