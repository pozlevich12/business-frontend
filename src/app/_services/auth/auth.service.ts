import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterForm } from '../../common/register.form';
import { LoginForm } from '../../common/login.form';
import { environment } from 'src/environments/environment';
import { LoginFormValidation } from 'src/app/common/validation-models/LoginFormValidation';
import { TokenStorageService } from './token-storage.service';

const BASE_URL = environment.url;
const LOGIN_API = 'auth/login';

const AUTH_TOKEN_HEADER = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private localStorageService: TokenStorageService) { }

  public login(loginForm: LoginForm): Promise<void> {
    const prepareLoginForm = new LoginForm();
    prepareLoginForm.phoneNumber = '+375' + loginForm.phoneNumber;
    prepareLoginForm.password = loginForm.password;

    return new Promise((resolve, reject) => {
      this.loginApi(prepareLoginForm).subscribe(response => {
        this.localStorageService.saveToken(response.headers.get(AUTH_TOKEN_HEADER));
        this.localStorageService.saveUser(response.body);
        resolve();
      },
        err => reject(err.error));
    });
  }

  public checkLoginForm(loginForm: LoginForm, loginFormValid: LoginFormValidation): boolean {
    loginFormValid.phoneNumber = this.checkPhone(loginForm.phoneNumber);
    loginFormValid.password = this.checkPassword(loginForm.password);
    return loginFormValid.phoneNumber && loginFormValid.password;
  }

  public checkPhone(phoneNumber: string): boolean {
    if (phoneNumber.length != 9) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      let char = phoneNumber.charCodeAt(i);
      if (char < 48 || char > 57) {
        return false;
      }
    }

    return true;
  }

  public checkPassword(password: string): boolean {
    if (password.length < 6 || password.length > 18) {
      return false;
    }

    for (let i = 0; i < password.length; i++) {
      if (password.charCodeAt(i) == 32) {
        return false;
      }
    }

    return true;
  }

  /*  API  */

  private loginApi(loginForm: LoginForm): Observable<HttpResponse<LoginForm>> {
    return this.http.post<LoginForm>(BASE_URL + LOGIN_API, loginForm, { observe: 'response' });
  }

  register(registerForm: RegisterForm): Observable<HttpResponse<RegisterForm>> {
    registerForm.phoneNumber = '+375' + registerForm.phoneNumber;
    return this.http.post<RegisterForm>(BASE_URL + 'auth/signup', registerForm, { observe: 'response' });
  }
}
