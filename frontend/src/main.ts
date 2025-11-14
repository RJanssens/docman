import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideOAuthClient(),
    importProvidersFrom(QuillModule.forRoot())
  ]
}).catch((err) => console.error(err));
