package com.springboot.e_com_project.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer  id;
    private  String name;
    private  String description;
    private String brand;
    private BigDecimal price;
    @JsonFormat(shape=JsonFormat.Shape.STRING,pattern = "dd-MM-yyyy")
    private Date realsedate;
    private  String category;
    private  boolean available;
    private  int quantity;
    private  String imagename;
    private  String imagetype;
    @JsonIgnore
    @Lob
    private byte[] imagedata;


}
