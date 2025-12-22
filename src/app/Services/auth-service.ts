import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseAuth, IConfirmEmail, IForgotPassword, ILogin, IRegister, IResetPassword } from './../Interfaces/IAuth';
import { BehaviorSubject, Observable, observable, tap } from 'rxjs';
import { ForgotPassword } from './../Components/forgot-password/forgot-password';
import { ConfirmEmail } from './../Components/confirm-email/confirm-email';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl:string="https://ventro.runasp.net";
  constructor(private http:HttpClient) {
    //this.getCurrentUser().subscribe();
  }
  

Register(form:IRegister):Observable<ApiResponseAuth>{
  return this.http.post<ApiResponseAuth>(this.baseUrl+'/api/Auth/register',form);
}

Login(form:ILogin):Observable<ApiResponseAuth>{
  localStorage.removeItem('Token');
localStorage.removeItem('RefreshToken');
  return this.http.post<ApiResponseAuth>(this.baseUrl+'/api/Auth/login',form)
  .pipe(
    tap((res)=>{
    this.getCurrentUser().subscribe();
  }))
}

ForgotPassword(email:string):Observable<string>{
  let param=new HttpParams();
  param=param.append("email",email)
  return this.http.post<string>(this.baseUrl+'/api/Auth/forgot-password',{},{params:param});
}

ResetPassword(form: IResetPassword): Observable<string> {
    let params = new HttpParams();
    params = params.append('newPassword', form.newPassword);
    params = params.append('token', form.token);
    params = params.append('email', form.email);

    return this.http.post<string>(
      `${this.baseUrl}/api/Auth/reset-password`,
      {},
      { params }
    );
  }  

  ConfirmEmail(token:string ,userId:string):Observable<string>{
    let param=new HttpParams();
    param=param.append("token",token);
    param=param.append("userId",userId);
    return this.http.post<string>(this.baseUrl+'/api/Auth/confirm-email',{},{params:param});
  }

  ResendConfirmEmail(email:string):Observable<string>{
    let param=new HttpParams();
    param=param.append("email",email);
    return this.http.post<string>(this.baseUrl+'/api/Auth/resend-confirm-email',{},{params:param})
  
  }

 

loginWithGoogle(): void {
localStorage.removeItem('Token');
localStorage.removeItem('RefreshToken');
  window.location.href = this.baseUrl + '/api/Auth/signin-google';
}
LoginWithFacebook(): void {
localStorage.removeItem('Token');
localStorage.removeItem('RefreshToken');
  window.location.href = this.baseUrl + '/api/Auth/signin-facebook';    
}

Logout(): Observable<ApiResponseAuth> {
localStorage.removeItem('Token');
localStorage.removeItem('RefreshToken');
this.isLogin.next(false);
this.initialCheckDone = false;
 return this.http.post<ApiResponseAuth>(this.baseUrl + '/api/Auth/logout',{});
}

private initialCheckDone = false;
get isInitialized(): boolean {
    return this.initialCheckDone;
  }
isLogin=new BehaviorSubject<boolean>(false);
private currentUserSubscription$: Observable<ApiResponseAuth> | null = null;
getCurrentUser(): Observable<ApiResponseAuth> {
   
    if (this.currentUserSubscription$) {
      return this.currentUserSubscription$;
    }

    this.currentUserSubscription$ = this.http.get<ApiResponseAuth>(this.baseUrl + '/api/Auth/get-current-user').pipe(
      tap({
        next: () => {
          this.isLogin.next(true);
          this.initialCheckDone = true;
        },
        error: () => {
          this.isLogin.next(false);
          this.initialCheckDone = true;
        },
        finalize: () => {
          // بمجرد انتهاء الطلب، نصفر المتغير للسماح بطلبات مستقبلية إذا لزم الأمر
          this.currentUserSubscription$ = null;
        }
      })
    );
    return this.currentUserSubscription$;
  }

RefreshToken(): Observable<ApiResponseAuth> {
  // بنبعث طلب فاضي لأن التوكنز موجودة في الكوكيز والباك هيعرف يقرأها
  return this.http.post<ApiResponseAuth>(`${this.baseUrl}/api/Auth/refresh-token`, {}, {
    withCredentials: true
  });
}

}