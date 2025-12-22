import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl:string='https://ventro.runasp.net/api/'
  constructor(private httpclient:HttpClient){

  }

  GetAllCategory():Observable<any>{
    return this.httpclient.get(this.baseUrl+'Category/get-all-categories');
  }
  



}
