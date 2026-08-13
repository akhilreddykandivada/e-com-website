package com.springboot.e_com_project.controller;

import com.springboot.e_com_project.model.Product;
import com.springboot.e_com_project.service.Productservice;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")@RequestMapping("/api")
public class Productcontroller {
    @Autowired
    private Productservice productservice;
        @RequestMapping("/")
    public  String greeting(){
            return "hello namaste akhil";
        }
        @GetMapping("/products")
    public ResponseEntity<List<Product>> getallproductss(){
            return new ResponseEntity<>(productservice.getallproducts(), HttpStatus.OK);
        }
        @PostMapping("/product")
    public  ResponseEntity<?> addproducts(@RequestPart("product") Product product, @RequestPart("image") MultipartFile image) {
            try {
                Product product1 = productservice.addproducts(product, image);
                return new ResponseEntity<>(product1,HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        @GetMapping("/product/{id}")
    public ResponseEntity<Product> getproduct(@PathVariable int id) {
            Product product = productservice.getproduct(id);
            if (product != null) {
                return new ResponseEntity<>(product, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        @GetMapping("/product/{productid}/image")
    public ResponseEntity<byte[]>getimagebyid(@PathVariable int productid){
            Product product=productservice.getproduct(productid);
            byte[]image=product.getImagedata();
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(product.getImagetype())).body(image);
        }
        @PutMapping("/product/{id}")
    public ResponseEntity<String>updateproducts(@PathVariable int id,@RequestPart Product product, @RequestPart(value="image",required=false) MultipartFile image){
            Product product1= null;
            try {
                product1 = productservice.updateproduct(id,product,image);
            } catch (IOException e) {
                return new ResponseEntity<>("failed to update",HttpStatus.BAD_REQUEST);
            }
            if(product1!=null){
                return new ResponseEntity<>("updated",HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("unable to updated",HttpStatus.BAD_REQUEST);
            }
        }
        @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteproduct(@PathVariable int id){
            Product product=productservice.getproduct(id);
            if(product!=null){
                productservice.deleteproduct(id);
                return new ResponseEntity<>("deleted succesfully",HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("no such element present",HttpStatus.NOT_FOUND);
            }
        }
        @GetMapping("/product/search")
    public ResponseEntity<List<Product>> searchproducts(@RequestParam String keyword){
            List<Product> products=productservice.getproducts(keyword);
            return new ResponseEntity<>(products,HttpStatus.OK);
        }

}
