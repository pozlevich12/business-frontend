import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { NEVER, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';
let currentUrl: string | undefined;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private token: TokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    currentUrl = this.router.url;
    let authReq = req;
    const token = this.token.getToken();
    if (token != null && !req.url.includes('/public/')) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq).pipe(
      catchError(error => {
        if (!!error.status && error.status === 401) {
          this.token.signOut();
          window.location.href = '/login?returnUrl=' + currentUrl;
          return NEVER;
        }
        return throwError(error);
      }),
      map(response => response));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];