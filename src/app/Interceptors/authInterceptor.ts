import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  throwError,
  catchError,
  switchMap,
  filter,
  take,
  finalize
} from 'rxjs';
import { SpinnerService } from '../Services/spinner-service';
import { AuthService } from '../Services/auth-service';

// 🔁 Queue management
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const spinner = inject(SpinnerService);
  const authService = inject(AuthService);

  spinner.show();

  // 🔹 Clone request withCredentials so cookies are sent
  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {

      // ❌ لو الـ refresh نفسه فشل → logout فورًا
      if (error.status === 401 && req.url.includes('refresh-token')) {
        authService.Logout();
        return throwError(() => error);
      }

      // 🔁 لو 401 و مش refresh
      if (error.status === 401 && !req.url.includes('refresh-token')) {

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.RefreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshTokenSubject.next(true);

              // 🔄 أعد الطلب الأصلي بنفس الـ cookies
              const retryReq = req.clone({ withCredentials: true });
              return next(retryReq);
            }),
            catchError(err => {
              isRefreshing = false;
              authService.Logout();
              return throwError(() => err);
            })
          );
        }

        // 🧵 لو في refresh شغال → استنى
        return refreshTokenSubject.pipe(
          filter(result => result === true),
          take(1),
          switchMap(() => {
            const retryReq = req.clone({ withCredentials: true });
            return next(retryReq);
          })
        );
      }

      return throwError(() => error);
    }),
    finalize(() => {
      setTimeout(() => spinner.hide(), 200);
    })
  );
};
