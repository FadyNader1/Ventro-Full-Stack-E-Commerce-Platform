import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';
import { catchError, map, of } from 'rxjs';

export const authGardGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // إذا تم التأكد مسبقاً (بعد Refresh أو تنقل داخلي)
  if (auth.isInitialized) {
    return auth.isLogin.value ? true : router.createUrlTree(['/login']);
  }

  // إذا كانت هذه أول مرة يفتح فيها المستخدم الموقع (أو عمل Refresh صلب)
  // ننتظر السيرفر يخبرنا بحالة الكوكيز
  return auth.getCurrentUser().pipe(
    map(res => {
      if (auth.isLogin.value) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    }),
    // في حالة وجود خطأ (مثل 401)
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};