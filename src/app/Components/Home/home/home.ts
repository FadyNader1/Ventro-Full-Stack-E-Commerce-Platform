import { Component, OnInit } from '@angular/core';
import { Checkout } from "../../checkout/checkout";
import { NgxGradientTextComponent } from '@omnedia/ngx-gradient-text';
import { RouterLink, Data } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Icategory } from '../../../Interfaces/icategory';
import { CategoryService } from '../../../Services/category-service';
import { ProductServices } from '../../../Services/product-services';
import { Iproduct } from '../../../Interfaces/iproduct';
import { FeaturedItems } from "../../featured-items/featured-items";
import { OfferProducts } from "../../offer-products/offer-products";
import {  NgxSplitTextComponent } from '@omnedia/ngx-split-text';
    import { NgxFadeComponent } from '@omnedia/ngx-fade';
import { AuthService } from '../../../Services/auth-service';
@Component({
  selector: 'app-home',
  imports: [NgxGradientTextComponent, RouterLink, NgFor, OfferProducts, CommonModule, NgxSplitTextComponent, NgxFadeComponent],
templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private categoryService:CategoryService,private productService:ProductServices,private auth:AuthService){

  }
  categories: Icategory[]=[];
offerItems: Iproduct[]=[];
newArrivals: Iproduct[]=[];
  ngOnInit(): void {  

    this.categoryService.GetAllCategory().subscribe(
      (res) =>
      this.categories=res.data
    );    

    this.productService.getHomeData().subscribe(
      (res) =>{
      this.newArrivals=res.latestProducts;
      this.offerItems=res.offerProducts;
      }
    );


  }

}

