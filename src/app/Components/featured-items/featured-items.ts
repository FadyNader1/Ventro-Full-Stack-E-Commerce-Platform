import { Component, OnInit } from '@angular/core';
import { ProductServices } from '../../Services/product-services';
import { Iproduct } from '../../Interfaces/iproduct';
  import { NgIf, NgFor, NgClass } from '@angular/common';
import { BasketServices } from '../../Services/basket-services';
import { AddToBasketDto } from '../../Interfaces/IcustomerBasket';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { WishlistService } from '../../Services/wishlist-service';
import { Iapiresponse } from '../../Interfaces/iapiresponse';
import { AuthService } from '../../Services/auth-service';
@Component({
  selector: 'app-featured-items',
  imports: [NgIf, NgFor, NgClass],
templateUrl: './featured-items.html',
  styleUrl: './featured-items.css'
})
export class FeaturedItems implements OnInit {

  constructor(private productService:ProductServices,
    private basketService:BasketServices,
     private messageService: MessageService,
     private wishlistService:WishlistService,
    private authService:AuthService){}


  featuredItems: Iproduct[]=[];
ngOnInit(): void {
  this.productService.getHomeData().subscribe((response) => {
    this.featuredItems = response.featuredProducts || []; 

  })

  this.authService.isLogin.subscribe(
      r=>{
        this.isLogin=r;
        if(this.isLogin)
            this.loadWishlist();
      }
    );
  
}
basketDto!: AddToBasketDto
addToCart(item:Iproduct){
  this.basketDto = {
    basketId:this.basketService.basketId.value!,
    productId: item.id,
    quantity: 1,
    deliveryMethodId: null,
    shippingAddress: null,
    ShipPrice: null,
    EmailBuyer: null
  };
  this.basketService.AddItem(this.basketDto).subscribe(() => {
    this.basketService.GetCount(); 
    this.showToast();
  }); 
}

  wishlistProductIds: Set<number> = new Set<number>();
    isLogin:boolean=false;

showToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart 🛒',
      detail: 'The item has been added successfully!',
      life: 2000
    });
  }
  
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
          life: 1000
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
  life: 1000,
  styleClass: 'custom-red-toast'
});

    },
    error: (err) => console.log(err?.error?.message)
  });
}

}
