import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../Interfaces/IcustomerBasket';

@Injectable({
  providedIn: 'root',
})
export class PayService {
    basUrl: string = 'https://ventro.runasp.net/api/';

  constructor(private httpclient:HttpClient){

  }
  CreatePaymentIntent(basketId:string):Observable<Data>{
    let param=new HttpParams();
    param=param.append("basketId",basketId);
    return this.httpclient.post<Data>(this.basUrl+'Payment/Create-payment-intent',{},{params:param});
  }
  
}
