# 🚀 Ventro API - Endpoints Documentation

This document provides a comprehensive list of all available API endpoints for the **Ventro E-Commerce System**.

**Base URL (Local):** `https://localhost:7155`  
**Live API:** [ventro.runasp.net](https://ventro.runasp.net/)

---

### 🛒 1. Product Controller
*Base Path: `/api/Product`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | [/api/Product/getallproducts](https://localhost:7155/api/Product/getallproducts) | Get all products with (Filter/Sort/Paging) |
| `POST` | [/api/Product/addproduct](https://localhost:7155/api/Product/addproduct) | Add a new product (Admin) |
| `GET` | [/api/Product/getproductbyid/{id}](https://localhost:7155/api/Product/getproductbyid/{id}) | Get product details by ID |
| `DELETE` | [/api/Product/deleteproduct/{id}](https://localhost:7155/api/Product/deleteproduct/{id}) | Delete product and its images |
| `PUT` | [/api/Product/updateproduct](https://localhost:7155/api/Product/updateproduct) | Update existing product data |
| `GET` | [/api/Product/home](https://localhost:7155/api/Product/home) | Home data (Latest, Featured, Offers) |

---

### 🔐 2. Auth Controller
*Base Path: `/api/Auth`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | [/api/Auth/register](https://localhost:7155/api/Auth/register) | Create a new user account |
| `POST` | [/api/Auth/Login](https://localhost:7155/api/Auth/Login) | User login (returns JWT) |
| `POST` | [/api/Auth/confirm-email](https://localhost:7155/api/Auth/confirm-email) | Verify user email |
| `PATCH` | [/api/Auth/change-password](https://localhost:7155/api/Auth/change-password) | Update user password |
| `POST` | [/api/Auth/refresh-token](https://localhost:7155/api/Auth/refresh-token) | Get new JWT via Refresh Token |
| `POST` | [/api/Auth/forgot-password](https://localhost:7155/api/Auth/forgot-password) | Request password reset link |
| `POST` | [/api/Auth/reset-password](https://localhost:7155/api/Auth/reset-password) | Set new password |
| `GET` | [/api/Auth/get-current-user](https://localhost:7155/api/Auth/get-current-user) | Get logged-in user profile |
| `GET` | [/api/Auth/signin-google](https://localhost:7155/api/Auth/signin-google) | External Auth: Google |
| `GET` | [/api/Auth/signin-facebook](https://localhost:7155/api/Auth/signin-facebook) | External Auth: Facebook |
| `POST` | [/api/Auth/logout](https://localhost:7155/api/Auth/logout) | Clear session and cookies |

---

### 🧺 3. Basket Controller (Redis)
*Base Path: `/api/Basket`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | [/api/Basket/CreateBasketId](https://localhost:7155/api/Basket/CreateBasketId) | Generate a unique Basket ID |
| `POST` | [/api/Basket/AddToBasket](https://localhost:7155/api/Basket/AddToBasket) | Add/Update items in Redis basket |
| `GET` | [/api/Basket/GetBasket](https://localhost:7155/api/Basket/GetBasket) | Retrieve basket items |
| `DELETE` | [/api/Basket/RemoveItemFromBasket](https://localhost:7155/api/Basket/RemoveItemFromBasket) | Delete specific item |
| `DELETE` | [/api/Basket/ClearBasket](https://localhost:7155/api/Basket/ClearBasket) | Delete entire basket |

---

### ❤️ 4. WishList Controller
*Base Path: `/api/WishList`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | [/api/WishList/add-wishlist](https://localhost:7155/api/WishList/add-wishlist) | Add product to favorites |
| `GET` | [/api/WishList/get-wishlists-for-current-user](https://localhost:7155/api/WishList/get-wishlists-for-current-user) | Get user's favorites |
| `DELETE` | [/api/WishList/remove-from-wishlist](https://localhost:7155/api/WishList/remove-from-wishlist) | Remove from favorites |
| `GET` | [/api/WishList/is-product-in-wishlist](https://localhost:7155/api/WishList/is-product-in-wishlist) | Check if item is favorited |

---

### 📦 5. Order & Payment
*Base Path: `/api/Order` & `/api/Payment`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | [/api/Order/create-order](https://localhost:7155/api/Order/create-order) | Convert basket to an order |
| `GET` | [/api/Order/get-order](https://localhost:7155/api/Order/get-order) | Get order details by ID |
| `GET` | [/api/Order/get-orders-for-user](https://localhost:7155/api/Order/get-orders-for-user) | List all user orders |
| `GET` | [/api/Order/{orderId}/invoice-pdf](https://localhost:7155/api/Order/1/invoice-pdf) | Download PDF Invoice |
| `POST` | [/api/Payment/Create-payment-intent](https://localhost:7155/api/Payment/Create-payment-intent) | Initialize Stripe Payment |

---

### 🏷️ 6. Categories & Delivery
| Method | Controller | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `GET` | Category | [/api/Category/get-all-categories](https://localhost:7155/api/Category/get-all-categories) | List all categories |
| `POST` | Category | [/api/Category/add-category](https://localhost:7155/api/Category/add-category) | Add new category |
| `GET` | Delivery | [/api/DeliveryMethod/get-all-delivery-methods](https://localhost:7155/api/DeliveryMethod/get-all-delivery-methods) | List shipping options |

---
_Generated with ❤️ for Ventro E-Commerce Project_
