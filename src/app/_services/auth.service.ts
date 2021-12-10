import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterForm } from '../common/register.form';
import { LoginForm } from '../common/login.form';

const AUTH_API = 'https://syrovatki-business.herokuapp.com/auth/';
const AUTH_API2 = 'http://localhost:8080/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm): Observable<HttpResponse<LoginForm>> {
    loginForm.phoneNumber = '+375' + loginForm.phoneNumber;
    return this.http.post<LoginForm>(AUTH_API + 'login', loginForm, { observe: 'response' });
  }

  register(registerForm: RegisterForm): Observable<HttpResponse<RegisterForm>> {
    registerForm.phoneNumber = '+375' + registerForm.phoneNumber;
    return this.http.post<RegisterForm>(AUTH_API + 'signup', registerForm, { observe: 'response' });
  }
}
