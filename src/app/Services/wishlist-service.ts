import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Iapiresponse } from '../Interfaces/iapiresponse';
import { ApiResponse, Item } from './../Interfaces/IcustomerBasket';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private http:HttpClient){

  }

  wishlistCount=new BehaviorSubject<number>(0);
//wishListCount!:number;
  baseUrl: string = 'https://ventro.runasp.net/api/';
  AddToWishList(productId: number): Observable<ApiResponse> {
    let param=new HttpParams;
    param=param.append("productId",productId);
    return this.http.post<ApiResponse>(this.baseUrl+'WishList/add-wishlist',{},{params:param})
  
}
RemoveFromWishList(productId: number): Observable<Iapiresponse> {
  let param=new HttpParams;
  param=param.append("productId",productId);
  return this.http.delete<any>(this.baseUrl+'WishList/remove-from-wishlist',{params:param});
}

getWishlist(): Observable<Iapiresponse> {
  return this.http.get<Iapiresponse>(this.baseUrl+'WishList/get-wishlists-for-current-user')
   .pipe(
      tap((res)=>{
        this.wishlistCount.next(res.data.length);
      })
    );

}


}