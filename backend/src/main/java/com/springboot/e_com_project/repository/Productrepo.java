package com.springboot.e_com_project.repository;

import com.springboot.e_com_project.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Productrepo extends JpaRepository<Product, Integer> {




    @Query("""
        SELECT p FROM Product p
        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    List<Product> searchproducts( String keyword);
}