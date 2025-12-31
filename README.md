# Ventro - Full-Stack E-Commerce Platform

**Ventro** is a modern, full-stack e-commerce platform featuring a powerful **ASP.NET Core Web API** backend and a high-performance **Angular 17+ (Standalone Components)** frontend.

- 🌐 **Live Demo**: [https://ventro-gold.vercel.app](https://ventro-gold.vercel.app/)
- 🔗 **Backend API Swagger**: [https://ventro.runasp.net/swagger/index.html](https://ventro.runasp.net/swagger/index.html)

The project delivers a complete shopping experience with authentication, product management, wishlist, cart, payments, orders, and more.

---

## ✨ Features

### Shared Features
- Full user authentication (Register, Login, JWT + Refresh Token)
- Social login with **Google** and **Facebook**
- Product browsing with filtering, sorting, pagination, and search
- Wishlist management
- Redis-powered shopping cart
- Secure checkout with **Stripe** payments
- Order history and PDF invoice download
- Responsive, mobile-first design

### Backend-Specific
- Built with **ASP.NET Core Web API**
- **Clean Architecture** (Core → Infrastructure → Application/Services → Presentation)
- **SOLID Principles** & Design Patterns
- **Entity Framework Core** + Unit of Work + Generic Repository + Specification Pattern
- **AutoMapper**, **Redis**, **Stripe**, **SendGrid/SMTP** for emails
- Image uploads stored in `wwwroot/images`
- PDF invoice generation
- Fully tested with **Postman** and **Swagger**

### Frontend-Specific
- Built with **Angular 17+** using **Standalone Components**
- Efficient state management with **RxJS** and **Angular Signals**
- Styling with **Tailwind CSS** + **Lucide Icons**
- HTTP Interceptors for JWT and refresh token handling
- Multi-step checkout flow
- User dashboard with order tracking
- Deployed on **Vercel**

---

## 🛠️ Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- Redis
- Stripe
- JWT + ASP.NET Core Identity
- AutoMapper
- Specification Pattern

### Frontend
- Angular (Standalone Components)
- RxJS & Signals
- Tailwind CSS
- Lucide Icons
- Angular HttpClient + Interceptors
- Vercel Deployment

---

## 🚀 Backend API Endpoints

Base URL: `https://ventro.runasp.net/api`

### Products (`/product`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| GET    | `/getallproducts`                 | All products (filter/sort/paginate)               | No   |
| POST   | `/addproduct`                     | Add product + images                             | Admin|
| GET    | `/getproductbyid/{id}`            | Get product by ID                                | No   |
| DELETE | `/deleteproduct/{id}`             | Delete product + images                          | Admin|
| PUT    | `/updateproduct`                  | Update product + replace images                  | Admin|
| GET    | `/home`                           | Home data (Latest/Featured/Offers)                | No   |

### Wishlist (`/WishList`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| POST   | `/add-wishlist?productId={id}`    | Add to wishlist                                  | Yes  |
| GET    | `/get-wishlists-for-current-user` | Get user wishlist                                | Yes  |
| DELETE | `/remove-from-wishlist?productId={id}` | Remove from wishlist                        | Yes  |
| GET    | `/is-product-in-wishlist?productId={id}` | Check if in wishlist                      | Yes  |

### Basket (`/Basket`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| GET    | `/CreateBasketId`                 | Generate new basket ID                            | No   |
| POST   | `/AddToBasket`                    | Add item to basket                               | No   |
| DELETE | `/RemoveItemFromBasket`           | Remove item                                      | No   |
| GET    | `/GetBasket?basketId={id}`        | Get basket                                       | No   |
| DELETE | `/ClearBasket?basketId={id}`      | Clear basket                                     | No   |

### Orders (`/Order`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| POST   | `/create-order`                   | Create order                                     | Yes  |
| GET    | `/get-order?id={id}`              | Get order by ID                                  | Yes  |
| GET    | `/get-orders-for-user`            | Get all user orders                              | Yes  |
| GET    | `/{orderId}/invoice-pdf`          | Download PDF invoice                             | Yes  |

### Payment (`/Payment`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| POST   | `/Create-payment-intent?basketId={id}` | Create Stripe Payment Intent                | No   |

### Delivery Methods (`/DeliveryMethod`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| GET    | `/get-all-delivery-methods`       | List all                                         | No   |
| POST   | `/add-delivery-method`            | Add new                                          | Admin|
| GET    | `/get-delivery-method?id={id}`    | Get by ID                                        | No   |
| PUT    | `/update-delivery-method`         | Update                                           | Admin|
| DELETE | `/delete-delivery-method?id={id}` | Delete                                           | Admin|

### Categories (`/Category`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| GET    | `/get-all-categories`             | List all                                         | No   |
| GET    | `/get-category/{id}`              | Get by ID                                        | No   |
| POST   | `/add-category`                   | Add new                                          | Admin|
| PUT    | `/update-category`                | Update                                           | Admin|
| DELETE | `/delete-category/{id}`           | Delete                                           | Admin|

### Auth (`/Auth`)
| Method | Endpoint                          | Description                                      | Auth |
|--------|-----------------------------------|--------------------------------------------------|------|
| POST   | `/register`                       | Register user                                    | No   |
| POST   | `/Login`                          | Login → JWT + Refresh Token                      | No   |
| POST   | `/confirm-email`                  | Confirm email                                    | No   |
| PATCH  | `/change-password`                | Change password                                  | Yes  |
| POST   | `/refresh-token`                  | Refresh JWT                                      | No   |
| POST   | `/forgot-password`                | Send reset link                                  | No   |
| POST   | `/reset-password`                 | Reset password                                   | No   |
| GET    | `/get-current-user`               | Get authenticated user                           | Yes  |
| GET    | `/signin-google`                  | Start Google login                               | No   |
| GET    | `/signin-facebook`                | Start Facebook login                             | No   |
| POST   | `/logout`                         | Logout                                           | Yes  |

---

## 🚀 Frontend Setup & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FadyNader1/Ventro.git
   cd Ventro
