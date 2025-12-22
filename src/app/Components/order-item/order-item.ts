import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutServices } from '../../Services/checkout-services';
import { OrderResponse } from '../../Interfaces/Iorder-dto';

@Component({
  selector: 'app-order-item',
  imports: [RouterLink, DatePipe, NgFor, NgIf],
  templateUrl: './order-item.html',
  styleUrl: './order-item.css',
})
export class OrderItem implements OnInit {
order!:OrderResponse;

constructor(private checkoutService:CheckoutServices,private route:ActivatedRoute) {}
ngOnInit(): void {
  this.route.params.subscribe(params => {
    const orderId = params['id'];
    this.checkoutService.GetOrderById(orderId).subscribe(res => {
      this.order = res;
    });
  })
}
}
