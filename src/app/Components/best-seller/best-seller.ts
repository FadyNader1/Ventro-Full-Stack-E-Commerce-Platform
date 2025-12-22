import { Component, OnInit } from '@angular/core';

import { ProductServices } from './../../Services/product-services';
import { Iproduct } from '../../Interfaces/iproduct';
import { NgClass, NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icategory } from '../../Interfaces/icategory';
import { FeaturedItems } from '../featured-items/featured-items';
import { NgxFadeComponent } from "@omnedia/ngx-fade";

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.html',
  styleUrls: ['./best-seller.css'],
  imports: [NgIf, RouterLink, FeaturedItems, NgxFadeComponent],

})
export class BestSeller implements OnInit {
  bestSeller: Iproduct[] = [];
  displayedProducts: Iproduct[] = [];
  categories: Icategory[] = []; 

  constructor(private productService: ProductServices) {}

  ngOnInit(): void {
    this.productService.getHomeData().subscribe((response) => {
      this.bestSeller = response.featuredProducts || [];
      this.displayedProducts = [...this.bestSeller];
      // لو عايز تجيب categories كمان
      // this.categories = response.categories;
    });
  }

  calculateDiscount(oldPrice: number, newPrice: number): number {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }

  getRandomReviews(): number {
    return Math.floor(Math.random() * 1500) + 300;
  }

  getRandomSoldToday(): number {
    return Math.floor(Math.random() * 140) + 10;
  }

  filterByCategory(event: any) {
    const catId = event.target.value;
    if (!catId) {
      this.displayedProducts = [...this.bestSeller];
    } else {
      this.displayedProducts = this.bestSeller.filter(p => p.category.id === +catId);
    }
  }

  sortProducts(event: any) {
    const value = event.target.value;
    const temp = [...this.displayedProducts];

    switch (value) {
      case 'price-low':
        temp.sort((a, b) => a.newPrice - b.newPrice);
        break;
      case 'price-high':
        temp.sort((a, b) => b.newPrice - a.newPrice);
        break;
      case 'rating':
        // لو مفيش rating حقيقي، خليه default
        break;
      default:
        temp.sort((a, b) => this.bestSeller.indexOf(a) - this.bestSeller.indexOf(b));
    }
    this.displayedProducts = temp;
  }
}