import { NgClass, NgIf } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { BasketServices } from '../../../Services/basket-services';
import { BehaviorSubject } from 'rxjs';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../Services/auth-service';
import { WishlistService } from '../../../Services/wishlist-service';
import { CheckoutServices } from '../../../Services/checkout-services';
import { FormsModule } from '@angular/forms'; 

 @Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, RouterModule, MatButtonModule, MatMenuModule, NgIf,FormsModule],
templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
iscliked:boolean = false;
isMobileMenuOpen = false; // Mobile menu toggle
constructor(private router:Router,private basket:BasketServices,private authService:AuthService,private wishlistService:WishlistService,private ordersService:CheckoutServices){
}

cartCount!: number;
wishlistCount!:number ;
isLogin:boolean =false;
ordersCount:number = 1;

ngOnInit(): void {

  this.basket.countitems.subscribe(c => this.cartCount = c);

  this.wishlistService.wishlistCount.subscribe(c => {
    this.wishlistCount = c;
  });

  this.authService.isLogin.subscribe(v => {
    this.isLogin = v;
  });

  this.ordersService.OrdersCount.subscribe(c => {
    this.ordersCount = c;
  });

}


clickToggle() {
this.iscliked = !this.iscliked
}

GoToBasket(){
  this.router.navigate(['basket'])
}

Logout() {
  this.authService.Logout().subscribe({
    next: () => {
      this.authService.getCurrentUser().subscribe();
      this.router.navigate(['login']);
    },
    error: (err) => {
      console.warn('Logout error (already logged out)', err);
   
      this.router.navigate(['login']);
    }
  });
}

isMenuOpen: boolean = false;

closeMenu() {
  this.isMenuOpen = false;
}


}