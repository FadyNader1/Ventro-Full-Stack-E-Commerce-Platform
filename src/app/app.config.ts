import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Interceptors/authInterceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // ✅ Scroll to top عند أي تنقّل
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // الصفحة تبدأ من فوق
        anchorScrolling: 'enabled'         // لو في anchor links
      })
    ),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    provideAnimations(),

    MessageService,

    providePrimeNG({
      theme: { preset: Aura }
    })
  ]
};
