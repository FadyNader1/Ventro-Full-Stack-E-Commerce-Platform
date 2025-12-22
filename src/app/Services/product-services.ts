import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeProducts, Iproduct } from '../Interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductServices {
  constructor(private httpClient: HttpClient) {}

  baseUrl: string = 'https://ventro.runasp.net/api/';

  GetAllProducts(categoryId?: number,sort?:string,SearchByName?:string,PageIndex?:number,PageSize?:number): Observable<any> {
    var param=new HttpParams();
    if (categoryId) {
      param=param.append('CategoryId',categoryId);
    }
    if (sort) {
      param=param.append('Sort',sort);
    }
    if (SearchByName) {
      param=param.append('SearchByName',SearchByName);
    }
    if (PageIndex) {
      param=param.append('PageIndex',PageIndex);
    }
    if (PageSize) {
      param=param.append('PageSize',PageSize);
    }
  return this.httpClient.get(this.baseUrl + 'Product/getallproducts',{params:param});
  }

  GetProductById(id: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'Product/getproductbyid/' + id);
  }

  getHomeData() :Observable<HomeProducts> {
  return this.httpClient.get<HomeProducts>(this.baseUrl + 'Product/home');
}

}
