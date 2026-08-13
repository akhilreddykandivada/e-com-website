# Full E-Commerce React Frontend

This is a complete React frontend, not only an Add Product page.

## Pages

- `/` — Home page with products fetched from Spring Boot
- `/add-product` — Add product + image upload
- `/product/:id` — Product details + image
- `/category/:categoryName` — Products filtered by category
- `/cart` — Shopping cart
- 404 page

## Components

- Navbar
- ProductCard
- ProductGrid
- Footer
- CartContext

## API expected

The frontend assumes the Spring Boot application runs on:

`http://localhost:8080`

Endpoints used:

```text
GET  /api/products
GET  /api/product/{id}
GET  /api/product/{id}/image
POST /api/product
```

If your backend has different endpoint names, edit only:

`src/api/productApi.js`

## Image upload

Add Product sends:

```text
multipart/form-data
product = JSON
image   = selected image file
```

It is intended for a Spring Boot controller similar to:

```java
@PostMapping("/product")
public Product addProduct(
        @RequestPart Product product,
        @RequestPart MultipartFile image) throws IOException {
    return service.addProduct(product, image);
}
```

## Your Product fields

The frontend uses your exact field:

```text
id
name
description
brand
price
realsedate
category
available
quantity
imagename
imagetype
imagedata
```

Notice that the frontend uses **description**, not `desc`.

`imagename`, `imagetype`, and `imagedata` are normally populated by the backend from the uploaded MultipartFile. They do not need to be manually entered in the form.

## Run

```bash
npm install
npm run dev
```

Open:

`http://localhost:5173`

## Date warning

In Java, use:

```java
@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
private Date realsedate;
```

`MM` means month. `mm` means minutes.

## CORS

If needed:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

or configure global CORS.

## Categories

The UI supports:

- Electronics
- Mobiles
- Laptops
- Accessories
- Clothing
- Home

You can add/change categories in `Navbar.jsx` and `AddProduct.jsx`.


## Smart Search
The search bar now sends the typed keyword to Spring Boot and shows matching products as suggestions while typing.
For example, searching `vivo` should return products where `vivo` occurs in the name, brand, category, or description.
The existing Add Product, Update Product, Delete Product, cart, categories, and product-detail features are preserved.

**Backend requirement:** update the Spring Boot search repository/service to search all desired product fields. React cannot search a field that the backend does not return.
