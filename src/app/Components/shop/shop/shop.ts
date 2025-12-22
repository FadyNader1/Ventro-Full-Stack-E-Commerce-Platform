import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG Imports (تأكد من إضافة ToastModule هنا ليظهر التوستر)
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { Iproduct } from '../../../Interfaces/iproduct';
import { AddToBasketDto } from '../../../Interfaces/IcustomerBasket';
import { BasketServices } from '../../../Services/basket-services';
import { WishlistService } from '../../../Services/wishlist-service';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-shop',
  standalone: true,
  // أضفنا ToastModule هنا ليعمل التوستر داخل هذا المكون
  imports: [NgFor, NgIf, NgClass, CurrencyPipe, RouterLink, ToastModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  @Input() allProducts: Iproduct[] = [];
  
  wishlistProductIds = new Set<number>();
  isLogin: boolean = false;

  constructor(
    private basketService: BasketServices,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.authService.isLogin.subscribe({
      next: (loggedIn) => {
        this.isLogin = loggedIn;
        if (this.isLogin) this.loadWishlist();
      },
      error: () => (this.isLogin = false)
    });
  }

  /* ================= Basket Logic ================= */
  
  addToBasket(productId: number, quantity: number = 1): void {
    const addBasketDto: AddToBasketDto = {
      basketId: '', // الخدمة تتعامل مع المعرف داخلياً عادةً
      productId,
      quantity,
      deliveryMethodId: null,
      shippingAddress: null,
      ShipPrice: null,
      EmailBuyer: null
    };

    this.basketService.AddItem(addBasketDto).subscribe({
      next: () => {
        this.basketService.GetCount();
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Added to Cart', 
          detail: 'Item added successfully',
          life: 1000
        });
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Could not add item to cart' 
        });
      }
    });
  }

  /* ================= Wishlist Logic ================= */

  private loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistProductIds.clear();
        if (res?.data && Array.isArray(res.data)) {
          res.data.forEach((item: any) => this.wishlistProductIds.add(item.product.id));
          this.wishlistService.wishlistCount.next(this.wishlistProductIds.size);
        }
      }
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.has(productId);
  }

  toggleWishlist(productId: number): void {
    if (!this.isLogin) {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Login Required', 
        detail: 'Please login to manage your wishlist' 
      });
      return;
    }

    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  private addToWishlist(productId: number): void {
    this.wishlistService.AddToWishList(productId).subscribe({
      next: () => {
        this.wishlistProductIds.add(productId);
        this.updateWishlistCount();
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Wishlist Updated', 
          detail: 'Product added ❤️' ,
          life: 1000
        });
      }
    });
  }

  private removeFromWishlist(productId: number): void {
    this.wishlistService.RemoveFromWishList(productId).subscribe({
      next: () => {
        this.wishlistProductIds.delete(productId);
        this.updateWishlistCount();
        this.messageService.add({ 
          severity: 'warn', 
          summary: 'Wishlist Updated', 
          detail: 'Product removed 💔' ,
          life: 1000
        });
      }
    });
  }

  private updateWishlistCount(): void {
    this.wishlistService.wishlistCount.next(this.wishlistProductIds.size);
  }
}