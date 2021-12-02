import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterForm } from '../common/register.form';

const AUTH_API = 'https://syrovatki-business.herokuapp.com/auth/';
const AUTH_API2 = 'http://localhost:8080/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', { username, password });
  }

  register(registerForm: RegisterForm): Observable<HttpResponse<RegisterForm>> {
    registerForm.phoneNumber = '+375' + registerForm.phoneNumber;
    return this.http.post<RegisterForm>(AUTH_API + 'signup', registerForm, { observe: 'response' });
  }
}
