package com.springboot.e_com_project.service;

import com.springboot.e_com_project.model.Product;
import com.springboot.e_com_project.repository.Productrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class Productservice {
    @Autowired
        Productrepo repo;
    public List<Product> getallproducts() {
        return repo.findAll();
    }

    public Product addproducts(Product product, MultipartFile image) throws IOException {
        product.setImagename(image.getOriginalFilename());
        product.setImagetype(image.getContentType());
        product.setImagedata(image.getBytes());
        return repo.save(product);
    }

    public Product getproduct(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product updateproduct(int id, Product product, MultipartFile image) throws IOException {
        Product product1 = repo.findById(id).orElse(null);
        if(product1==null){
            return null;
        }
            product1.setName(product.getName());
            product1.setDescription(product.getDescription());
            product1.setPrice(product.getPrice());
            product1.setAvailable(product.isAvailable());
            product1.setBrand(product.getBrand());
            product1.setCategory(product.getCategory());
            product1.setQuantity(product.getQuantity());
            product1.setRealsedate(product.getRealsedate());
            if(image!=null &&!image.isEmpty()){
                product1.setImagetype(image.getContentType());
                product1.setImagename(image.getOriginalFilename());
                product1.setImagedata(image.getBytes());
            }
        return repo.save(product1);
    }

    public void deleteproduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> getproducts(String keyword) {
        return  repo.searchproducts(keyword);
    }
}
