import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {  IDeliveryMethodResponse, OrderDto, OrderResponse } from '../Interfaces/Iorder-dto';
@Injectable({
  providedIn: 'root',
})
export class CheckoutServices {
    basUrl: string = 'https://ventro.runasp.net/api/';

    constructor(private http: HttpClient) {}

    CreateOrder(order: OrderDto): Observable<OrderResponse> {
      return this.http.post<any>(this.basUrl + 'Order/create-order', order);
    }

    GetOrderById(id:number): Observable<OrderResponse> {
      let param=new HttpParams();
      param=param.append("id",id);
      return this.http.get<any>(this.basUrl + 'Order/get-order',{params:param});
    }

    OrdersCount=new BehaviorSubject<number>(0);
    GetOrdersForCurrentUser(): Observable<OrderResponse[]> {
      return this.http.get<OrderResponse[]>(this.basUrl + 'Order/get-orders-for-user')
      .pipe(
        tap((res:OrderResponse[]) => {
          this.OrdersCount.next(res.length);
        })
      )
    }

    GetAllDeliveryMethods(): Observable<IDeliveryMethodResponse> {
      return this.http.get<IDeliveryMethodResponse>(this.basUrl + 'DeliveryMethod/get-all-delivery-methods');
    }

    GetDeliveryMethodById(id:number): Observable<IDeliveryMethodResponse> {
      let param=new HttpParams();
      param=param.append("id",id);
      return this.http.get<IDeliveryMethodResponse>(this.basUrl + 'DeliveryMethod/get-delivery-method',{params:param});
    }

    getInvoicePdf(orderId: number): Observable<Blob> {
  return this.http.get(this.basUrl + `Order/${orderId}/invoice-pdf`, {
    responseType: 'blob'  // مهم جدًا
  });
}

  
  
}
