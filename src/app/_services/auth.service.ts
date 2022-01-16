import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterForm } from '../common/register.form';
import { LoginForm } from '../common/login.form';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm): Observable<HttpResponse<LoginForm>> {
    loginForm.phoneNumber = '+375' + loginForm.phoneNumber;
    return this.http.post<LoginForm>(BASE_URL + 'auth/login', loginForm, { observe: 'response' });
  }

  register(registerForm: RegisterForm): Observable<HttpResponse<RegisterForm>> {
    registerForm.phoneNumber = '+375' + registerForm.phoneNumber;
    return this.http.post<RegisterForm>(BASE_URL + 'auth/signup', registerForm, { observe: 'response' });
  }
}
