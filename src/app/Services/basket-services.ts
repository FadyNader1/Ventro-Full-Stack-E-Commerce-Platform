import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AddToBasketDto, ApiResponse, Item } from '../Interfaces/IcustomerBasket';
import { ShippingAddress } from '../Interfaces/Iorder-dto';
import { Iapiresponse } from '../Interfaces/iapiresponse';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BasketServices {

  basUrl: string = 'https://ventro.runasp.net/api/';
  countitems = new BehaviorSubject<number>(0);
  basketId = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.initBasket();
    this.GetCount();
  }

  // ---------------------------------------------------------
  // Initialize BasketId
  // ---------------------------------------------------------
  initBasket() {
    const savedBasketId = localStorage.getItem('BasketId');

    if (savedBasketId) {
      this.basketId.next(savedBasketId);
    } else {
      this.creaeteBasket().subscribe((response) => {
        localStorage.setItem('BasketId', response.basketId);
        this.basketId.next(response.basketId);
      });
    }
  }

  creaeteBasket(): Observable<any> {
    return this.http.get(this.basUrl + 'Basket/CreateBasketId');
  }

  // ---------------------------------------------------------
  // Get Basket
  // ---------------------------------------------------------
GetBasket(): Observable<ApiResponse>{ 
  let param = new HttpParams().append('basketId', this.basketId.value!);

  return this.http.get<ApiResponse>(this.basUrl + `Basket/GetBasket`, { params: param })
    .pipe(
      tap((response) => {
        const itemsCount = response?.data?.items.length ?? 0;
        this.countitems.next(itemsCount);
      })
    );
}
  // ---------------------------------------------------------
  // Sync count manually
  // ---------------------------------------------------------
  GetCount() {
    // بس خليها ترجع الكاونت اللي جوا GetBasket
    this.GetBasket().subscribe();
  }

  // ---------------------------------------------------------
  // Add Item
  // ---------------------------------------------------------
  AddItem(addBasketDto:AddToBasketDto): Observable<ApiResponse> {
    addBasketDto.basketId = this.basketId.value!;
    const body: AddToBasketDto = addBasketDto;
      
    return this.http.post<ApiResponse>(this.basUrl + 'Basket/AddToBasket',body)
      .pipe(
        tap(() => {
          this.GetCount(); // 🔥 بعد الإضافة حدّث الكاونت فورًا
        })
      );
  }

  // ---------------------------------------------------------
  // Remove Item
  // ---------------------------------------------------------
  RemoveItem(itemId: number): Observable<any> {
    let param = new HttpParams()
      .append("basketId", this.basketId.value!)
      .append("productId", itemId);

    return this.http.delete(this.basUrl + 'Basket/RemoveItemFromBasket', { params: param })
      .pipe(
        tap(() => {
          this.GetCount(); // 🔥 تحديث بعد الحذف
        })
      );
  }

  // ---------------------------------------------------------
  // Clear Basket
  // ---------------------------------------------------------
  ClrearBasket(): Observable<any> {
    let param = new HttpParams().append("basketId", this.basketId.value!);

    return this.http.delete(this.basUrl + 'Basket/ClearBasket', { params: param })
      .pipe(
        tap(() => {
          this.countitems.next(0);  // 🔥 يمسح العداد مباشرة
        })
      );
  }
}
