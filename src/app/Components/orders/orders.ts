import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CheckoutServices } from '../../Services/checkout-services';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-orders',
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
orders: any[] = [];
isLogin!:boolean;
constructor(private checkoutService: CheckoutServices,private authService:AuthService) {}

ngOnInit(): void {
this.authService.isLogin.subscribe(
  r=>{
    this.isLogin=r;
    if(this.isLogin)
      this.LoadOrders();
  },
  error=>{}
);

}

LoadOrders(): void {
  this.checkoutService.GetOrdersForCurrentUser().subscribe(res => {
    this.orders = res;
  });
}

downloadInvoice(orderId: number) {
  this.checkoutService.getInvoicePdf(orderId).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ventro-Invoice-#${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error downloading invoice', err);
      // يفضل تعرض toast error هنا
    }
  });
}

}