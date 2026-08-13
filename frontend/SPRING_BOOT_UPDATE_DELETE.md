# Spring Boot endpoints required by the new React features

The existing React features are unchanged. The new pages call these two endpoints:

## Delete

```text
DELETE /api/product/{id}
```

Example:

```text
DELETE http://localhost:8080/api/product/103
```

## Update

```text
PUT /api/product/{id}
Content-Type: multipart/form-data
```

Multipart parts:

- `product` = JSON product object
- `image` = optional image file

Example:

```text
PUT http://localhost:8080/api/product/103
```

The React frontend sends the same product JSON shape used by Add Product and sends an image only when the user chooses a new image.

## New frontend routes

```text
/manage-products
/update-product/{id}
```

The old routes remain:

```text
/
/add-product
/product/{id}
/category/{categoryName}
/cart
```
