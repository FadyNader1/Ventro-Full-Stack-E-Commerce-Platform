import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../Services/wishlist-service';
import { BasketServices } from '../../Services/basket-services';
import { AddToBasketDto } from '../../Interfaces/IcustomerBasket';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, ToastModule, ButtonModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'], // Important: keep 'styleUrls' plural
})
export class Wishlist implements OnInit {
  wishlistItems: any[] = [];
  wishlistProductIds: Set<number> = new Set<number>();
  basketDto!: AddToBasketDto;

  constructor(
    private wishlistService: WishlistService,
    private basketService: BasketServices,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  calculateDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  private loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        if (!Array.isArray(res.data)) return;
        this.wishlistItems = res.data;
        this.wishlistProductIds.clear();
        res.data.forEach((item: any) => {
          this.wishlistProductIds.add(item.product.id);
        });
        this.wishlistService.wishlistCount.next(this.wishlistItems.length);
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
        this.showToast('error', 'Error', 'Failed to load wishlist');
      }
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.has(productId);
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.RemoveFromWishList(productId).subscribe({
      next: () => {
        this.wishlistProductIds.delete(productId);
        this.loadWishlist();
        this.showToast('warn', 'Removed', 'Product successfully removed from wishlist');
      },
      error: (err) => {
        console.error(err?.error?.message);
        this.showToast('error', 'Error', 'Failed to remove product from wishlist');
      }
    });
  }

  addToCart(productId: number): void {
    this.basketDto = {
      basketId: '',
      productId,
      quantity: 1,
      deliveryMethodId: null,
      shippingAddress: null,
      ShipPrice: null,
      EmailBuyer: null
    };

    this.basketService.AddItem(this.basketDto).subscribe({
      next: () => {
        this.showToast('success', 'Added 🛒', 'Product successfully added to cart');
      },
      error: () => {
        this.showToast('error', 'Error', 'Failed to add product to cart');
      }
    });
  }

  private showToast(
    severity: 'success' | 'error' | 'warn' | 'info',
    summary: string,
    detail: string,
    life: number = 1000
  ): void {
    this.messageService.add({ severity, summary, detail, life });
  }
}
