import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Components/Navbar/navbar/navbar';
import { SpinnerComponent } from './Components/SpinnerComponent/spinner-component';
import { WishlistService } from './Services/wishlist-service';
import { AuthService } from './Services/auth-service';
import { catchError, of } from 'rxjs';
import { CheckoutServices } from './Services/checkout-services';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, SpinnerComponent, ToastModule ],
templateUrl: './app.html',
  styleUrl: './app.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App implements OnInit {
  protected readonly title = signal('Ventro');

  constructor(private wishlistService:WishlistService,private authService:AuthService,private orderServices:CheckoutServices){}

 
ngOnInit(): void {
  this.authService.getCurrentUser()
    .pipe(
      catchError(err => {
        // لو 401 أو أي خطأ تاني → اعتبر المستخدم مش مسجل دخول
        console.log('User not logged in, wishlist not loaded');
        return of(null); // ترجع observable فارغ
      })
    )
    .subscribe(user => {
      if (user) {
        // لو مسجل دخول
        this.wishlistService.getWishlist().subscribe({
          next: () => console.log('Wishlist loaded'),
          error: err => console.error('Failed to load wishlist', err)
        });
        this.orderServices.GetOrdersForCurrentUser().subscribe();
      }
    });
}

}
