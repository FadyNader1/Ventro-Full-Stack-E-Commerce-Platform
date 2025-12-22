import { Routes } from '@angular/router';
import { Home } from './Components/Home/home/home';
import { Basket } from './Components/basket/basket';
import { authGardGuard } from './Gard/auth-gard-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component:Home },
    {path:'shopping', 
        loadComponent:() => import('./Components/Shopping/shopping/shopping').then(m=>m.Shopping)
    },
     {path:'about', 
        loadComponent:() => import('./Components/about/about').then(m=>m.About)
    }, 

     {path:'details/:id',
         loadComponent:()=>import('./Components/ProductDetails/product-details').then(m=>m.ProductDetails)
     },
      {path:'basket',
         loadComponent:()=>import('./Components/basket/basket').then(m=>m.Basket)
     },
     {path:'register',
         loadComponent:()=>import('./Components/register/register').then(m=>m.Register)
     },
     {
       path:'login',
       loadComponent:()=>import('./Components/login/login').then(m=>m.LoginComponent)
     },
     {
       path:'forgot-password',
       loadComponent:()=>import('./Components/forgot-password/forgot-password').then(m=>m.ForgotPassword)
     },
     {
       path:'reset-password',
       loadComponent:()=>import('./Components/reset-password/reset-password').then(m=>m.ResetPasswordComponent)
     },
     {
       path:'confirm-email',
       loadComponent:()=>import('./Components/confirm-email/confirm-email').then(m=>m.ConfirmEmail)
     },
      {
       path:'best-seller',
       loadComponent:()=>import('./Components/best-seller/best-seller').then(m=>m.BestSeller)
     },
     {
       path:'google-success',
       canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/google-success/google-success').then(m=>m.GoogleSuccess)
     },
     {
       path:'facebook-success',
              canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/facebook-success/facebook-success').then(m=>m.FacebookSuccess)
     },
     {
       path:'checkout',
              canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/checkout/checkout').then(m=>m.Checkout)
     },
      {
       path:'checkout-success/:id',
              canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/checkout-success/checkout-success').then(m=>m.CheckoutSuccess)
     },
     {
       path:'order-item/:id',
              canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/order-item/order-item').then(m=>m.OrderItem)
     },
      {
       path:'wishlist',
              canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/wishlist/wishlist').then(m=>m.Wishlist)
     },
     {
       path:'orders',
              canActivate:[authGardGuard],
       loadComponent:()=>import('./Components/orders/orders').then(m=>m.Orders)
     },
     {
       path:'not-found',
       loadComponent:()=>import('./Components/notfound/notfound').then(m=>m.Notfound)
     },

    {path:'**', redirectTo: 'not-found', pathMatch: 'full'}
   
];
