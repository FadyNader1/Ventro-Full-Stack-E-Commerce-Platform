import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BasketServices } from '../../Services/basket-services';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutServices } from '../../Services/checkout-services';

@Component({
  selector: 'app-checkout-success',
  imports: [CurrencyPipe,RouterLink],
templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess implements OnInit {
 totalAmount: number = 0;
orderId!:number;
customerName:string = '';
  constructor(private basketService:BasketServices,private route:ActivatedRoute,private chechoutService:CheckoutServices) {}

ngOnInit(): void {

  this.route.params.subscribe(params => {
    this.orderId = params['id'];
    this.chechoutService.GetOrderById(this.orderId).subscribe(res => {
      this.customerName = res.shippingAddress.fullName;;
      this.totalAmount = res.total;
    });
  });
}

 
}
