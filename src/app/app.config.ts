import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { tokenInterceptorFactory } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide app's routes
    provideRouter(routes),

    // Provide HttpClient with "withInterceptorsFromDi" so we can attach interceptors from the DI container
    provideHttpClient(
      withInterceptorsFromDi() 
    ),

    // Provide the TokenInterceptor via a factory
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: tokenInterceptorFactory,
      multi: true
    }
  ]
};
