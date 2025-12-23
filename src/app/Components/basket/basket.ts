import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasketServices } from '../../Services/basket-services';
import { AddToBasketDto, Item } from '../../Interfaces/IcustomerBasket';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ShippingAddress } from '../../Interfaces/Iorder-dto';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-basket',
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './basket.html',
  styleUrls: ['./basket.css'],  // ✅ صححتها
})

export class Basket {
  basketId: string = '';
  AllItemsInBasket!: Item[];
  basUrl: string = 'https://ventro.runasp.net/';
  quantity: number = 1;
  shippingAddress:ShippingAddress | null = null;
  deliveryMethodId:number =0;
  isLogin!:boolean;

  @Input() items: Item[] = [];
  @Output() changeQuantity = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() checkout = new EventEmitter<void>();

  constructor(private basketservice: BasketServices, private route: Router,private authService:AuthService) {

  }

 ngOnInit(): void {
  this.basketservice.basketId.subscribe(id => {
    if(id) this.GetBasket();
  });

  this.authService.isLogin.subscribe(
    r=>{
      this.isLogin=r;
    }
  );
}

 GetBasket(): void {
  if(!this.basketservice.basketId.value)
     return;
    
  this.basketservice.GetBasket().subscribe((response: any) => {
      this.AllItemsInBasket = response?.data?.items ?? [];
    this.items = this.AllItemsInBasket;
    
  });
}

  // Go to shopping
  gotoshopping() {
    this.route.navigate(['shopping']);
  }

  trackById(index: number, item: Item) {
    return item.productId;
  }
addBasketDto!:AddToBasketDto;

  increase(item: Item) {
    this.addBasketDto={basketId:'',productId:item.productId,quantity:1,deliveryMethodId:null,shippingAddress:null,ShipPrice:null,EmailBuyer:null};
    this.basketservice.AddItem(this.addBasketDto).subscribe(() => {
      this.GetBasket();  // تحديث السلة فورًا
    });
  }

  decrease(item: Item) {
    if (item.quantity > 1) {
      this.addBasketDto={basketId:'',productId:item.productId,quantity:-1,deliveryMethodId:null,shippingAddress:null,ShipPrice:null,EmailBuyer:null};
      this.basketservice.AddItem(this.addBasketDto).subscribe(() => {
        this.GetBasket();
      });
    }
  }

  removeItem(itemId: number) {
    this.basketservice.RemoveItem(itemId).subscribe(() => {
      this.GetBasket();  // تحديث السلة بعد الحذف
    });
  }

 ClearBasket() {
  this.basketservice.ClrearBasket().subscribe(() => {
    this.items = [];  // السلة تظهر فاضية فورًا بدون Refresh


  });
}

  get subtotal() {
    return this.items.reduce((sum, it) => sum + it.newPrice * it.quantity, 0);
  }
}
