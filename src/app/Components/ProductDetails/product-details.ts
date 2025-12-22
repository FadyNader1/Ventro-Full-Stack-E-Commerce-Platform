import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf, NgClass, CurrencyPipe } from '@angular/common';

import { Iproduct } from '../../Interfaces/iproduct';
import { ShippingAddress } from '../../Interfaces/Iorder-dto';
import { AddToBasketDto, ApiResponse } from '../../Interfaces/IcustomerBasket';
import { BasketServices } from '../../Services/basket-services';
import { ProductServices } from '../../Services/product-services';
import { SpinnerService } from '../../Services/spinner-service';
import { WishlistService } from '../../Services/wishlist-service';
import { AuthService } from '../../Services/auth-service';
import { MessageService } from 'primeng/api';

import { Iapiresponse } from '../../Interfaces/iapiresponse';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, RouterLink, NgClass],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  productId!: number;
  CategoryName: string = '';
  productDetails: Iproduct = {} as Iproduct;
  mainImage: string = '';
  keySpecsArray: string[] = [];
  discountPercentage: number = 0;
  shippingAddress: ShippingAddress | null = null;
  deliveryMethodId: number = 0;
  categoryId: number = 0;
  loading: boolean = true;
  relatedProducts: Iproduct[] = [];
  addBasketDto!: AddToBasketDto;
  
  wishlistProductIds: Set<number> = new Set<number>();

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productServices: ProductServices,
    private spinner: SpinnerService,
    private basket: BasketServices,
    private messageService: MessageService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  isLogin:boolean=false;
  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.productId = Number(param.get('id'));
      this.LoadProductDetails();
    });
    

    this.authService.isLogin.subscribe(
      r=>{
        this.isLogin=r;
        if(this.isLogin)
            this.loadWishlist();
      }
    );

    this.LoadRelatedProducts();
  }

  /* ==================== Load Product Details ==================== */
  LoadProductDetails(): void {
    this.productServices.GetProductById(this.productId).subscribe({
      next: (response) => {
        this.productDetails = response.data;
        this.CategoryName = this.productDetails.category?.name || '';
        this.categoryId = this.productDetails.category.id;

        this.mainImage = encodeURI(this.productDetails.photos?.[0] || '');

        // Key Specs
        this.keySpecsArray = this.productDetails.keySpecs
          ? this.productDetails.keySpecs.split(',').map(s => s.trim())
          : [];

        // Discount
        if (this.productDetails.oldPrice && this.productDetails.newPrice) {
          this.discountPercentage = Math.round(
            100 - (this.productDetails.newPrice / this.productDetails.oldPrice * 100)
          );
        }
      },
      complete: () => {
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  /* ==================== Related Products ==================== */
  LoadRelatedProducts(): void {
    this.productServices.GetAllProducts(this.categoryId).subscribe({
      next: (res) => this.relatedProducts = res.data || []
    });
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  /* ==================== Basket ==================== */
  AddToCart(productId: number, quantity: number, shippingAddress: ShippingAddress | null): void {
    this.addBasketDto = {
      basketId: '',
      productId,
      quantity,
      deliveryMethodId: null,
      shippingAddress: null,
      ShipPrice: null,
      EmailBuyer: null
    };

    this.basket.AddItem(this.addBasketDto).subscribe(() => {
      this.showToast();
    });
  }

  showToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart 🛒',
      detail: 'The item has been added successfully!'
    });
  }

 /* ==================== Wishlist ==================== */
private loadWishlist(): void {
  this.wishlistService.getWishlist().subscribe({
    next: (res: Iapiresponse) => {
      if (!Array.isArray(res.data)) return;

      res.data.forEach((item: any) => {
        const productId = item.product?.id;
        if (productId) this.wishlistProductIds.add(productId);
      });

      this.wishlistService.wishlistCount.next(this.wishlistProductIds.size);
    },
    error: (err) => console.log(err)
  });
}

isInWishlist(productId: number): boolean {
  return this.wishlistProductIds.has(productId);
}

toggleWishlist(productId: number): void {
  if (!this.isLogin) return;

  this.isInWishlist(productId)
    ? this.removeFromWishlist(productId)
    : this.addToWishlist(productId);
}

private addToWishlist(productId: number): void {
  this.wishlistService.AddToWishList(productId).subscribe({
    next: (res) => {
      if (!this.wishlistProductIds.has(productId)) {
        this.wishlistProductIds.add(productId);
        this.wishlistService.wishlistCount.next(this.wishlistProductIds.size);

        // Toast عند الإضافة
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Wishlist ❤️',
          detail: 'Product added to your wishlist successfully!',
          life: 2000
        });
      }
    },
    error: (err) => {
      if (err?.error?.message?.includes('already')) {
        this.wishlistProductIds.add(productId);
        this.messageService.add({
          severity: 'info',
          summary: 'Already in Wishlist',
          detail: 'This product is already in your wishlist.',
          life: 2000
        });
      }
    }
  });
}

private removeFromWishlist(productId: number): void {
  this.wishlistService.RemoveFromWishList(productId).subscribe({
    next: (res) => {
      this.wishlistProductIds.delete(productId);
      this.wishlistService.wishlistCount.next(this.wishlistProductIds.size);

      // Toast عند الإزالة
     this.messageService.add({
  severity: 'warn',
  summary: 'Removed from Wishlist 💔',
  detail: 'Product removed from your wishlist.',
  life: 2000,
  styleClass: 'custom-red-toast'
});

    },
    error: (err) => console.log(err?.error?.message)
  });
}

}
