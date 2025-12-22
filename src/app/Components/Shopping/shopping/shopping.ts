import { Component, ViewChild, AfterViewInit, ElementRef, NgModule } from '@angular/core';
import { Shop } from "../../shop/shop/shop";
import { Icategory } from '../../../Interfaces/icategory';
import { CategoryService } from '../../../Services/category-service';
import { Iproduct } from '../../../Interfaces/iproduct';
import { ProductServices } from '../../../Services/product-services';
import { NgClass, NgFor } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { pipe } from 'rxjs';
import { ProductParams } from '../../../../Modlies/ProductParams';
import { Ripple } from 'primeng/ripple';
import { CheckoutServices } from '../../../Services/checkout-services';
import { NgxGradientTextComponent } from "@omnedia/ngx-gradient-text";
import { NgxFadeComponent } from "@omnedia/ngx-fade";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [Shop, NgFor, MatPaginator, NgxGradientTextComponent, NgxFadeComponent,RouterLink],
  templateUrl: './shopping.html',
  styleUrl: './shopping.css',

})
export class Shopping  {

  productParams = new ProductParams();
  allcategorys!: Icategory[];
  categoryErrors: any;

  allproducts!: Iproduct[];
  productErrors: any;

  CategoryId?: number;
  selectedSort?: string;

  // استخدمنا ElementRef + optional لأن الـ ViewChild بيبقى undefined في البداية
  @ViewChild('searchinput') searchinput?: ElementRef<HTMLInputElement>;
  @ViewChild('sortvalue') sortvalue?: ElementRef<HTMLSelectElement>;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductServices,
    private orderService:CheckoutServices
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

 
  // ======== Load Categories ==========
  loadCategories() {
    this.categoryService.GetAllCategory().subscribe(
      res => this.allcategorys = res.data,
      err => this.categoryErrors = err
    );

this.orderService.GetOrdersForCurrentUser().subscribe();
  }

  // =========== Load Products With Pagination ===========
  loadProducts() {
  this.productService.GetAllProducts(
    this.CategoryId,
    this.selectedSort,
    this.searchinput?.nativeElement?.value?.trim() || "",
    this.productParams.pageIndex + 1,   // ← هنا +1 عشان الـ API بيشتغل من 1
    this.productParams.pageSize
  ).subscribe({
    next: (response: any) => {
      this.allproducts = response.data;

      this.productParams.count = response.meta.count;
      this.productParams.pageSize = response.meta.pageSize;
      this.productParams.pageIndex = response.meta.pageIndex - 1;
    },
    error: (err) => this.productErrors = err
  });
  }

  // =========== Category Filter ===========
  SelectCategoryId(categoryId: number) {
    this.CategoryId = categoryId;
    this.productParams.pageIndex = 0;
    this.loadProducts();
  }

  // =========== Sorting ===========
  SelectOptions = [
    { value: 'name', name: 'Name' },
    { value: 'priceAsc', name: 'Price (min → max)' },
    { value: 'priceDesc', name: 'Price (max → min)' }
  ];

  selectsort(event: Event) {
    this.selectedSort = (event.target as HTMLSelectElement).value;
    this.productParams.pageIndex = 0;
    this.loadProducts();
  }

  // =========== Search ===========
  onsearch(value?: string) {
    this.productParams.pageIndex = 0;
    this.loadProducts();
  }

  // =========== Reset ===========
  onReset() {
    this.CategoryId = 0;
    this.selectedSort = '';
    this.productParams.pageIndex = 0;

    if (this.searchinput?.nativeElement) {
      this.searchinput.nativeElement.value = '';
    }
    if (this.sortvalue?.nativeElement) {
      this.sortvalue.nativeElement.value = 'name';
    }

    this.loadProducts();
  }

// =========== Pagination Handler ===========
onpagginator(event: PageEvent) {
  // event.pageIndex بيجي من 0 دايمًا في mat-paginator
  this.productParams.pageIndex = event.pageIndex;    // ← خد القيمة زي ما هي (من 0)
  this.productParams.pageSize = event.pageSize;

  this.loadProducts(); // داخل loadProducts هيضيف +1 تلقائي قبل ما يبعت للـ API
}


}