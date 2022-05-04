import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterForm } from '../../common/RegisterForm';
import { LoginForm } from '../../common/login.form';
import { environment } from 'src/environments/environment';
import { LoginFormValidation } from 'src/app/common/validation-models/LoginFormValidation';
import { TokenStorageService } from './token-storage.service';
import { RegisterFormValidation } from 'src/app/common/validation-models/RegisterFormValidation';
import { User } from 'src/app/common/User';

const BASE_URL = environment.url;
const LOGIN_API = 'auth/login';
const SINGUP_API = 'auth/signup';
const AUTH_TOKEN_HEADER = 'auth-token';
const INVALID_INPUT_FORM_MESSAGE = 'Пожалуйста, проверьте правильность заполнения формы';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient, private localStorageService: TokenStorageService) { }

  public login(loginForm: LoginForm, loginFormValid: LoginFormValidation): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.checkLoginForm(loginForm, loginFormValid)) {
        reject(INVALID_INPUT_FORM_MESSAGE);
        return;
      }

      this.loginApi(this.getPreparedLoginForm(loginForm)).subscribe(response => {
        this.localStorageService.saveToken(response.headers.get(AUTH_TOKEN_HEADER));
        this.localStorageService.saveUser(response.body);
        resolve();
      },
        err => reject(err.error));
    });
  }

  public signup(registerForm: RegisterForm, registerFormValid: RegisterFormValidation): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.checkRegisterForm(registerForm, registerFormValid)) {
        reject(INVALID_INPUT_FORM_MESSAGE);
        return;
      };

      this.signupApi(this.getPreparedRegisterForm(registerForm)).subscribe(response => {
        this.localStorageService.saveToken(response.headers.get(AUTH_TOKEN_HEADER));
        this.localStorageService.saveUser(response.body);
        resolve();
      },
        err => reject(err.error));
    });
  }

  public getUser(): User | undefined {
    return this.localStorageService.getUser();
  }

  public signOut() {
    this.localStorageService.signOut();
  }

  private checkLoginForm(loginForm: LoginForm, loginFormValid: LoginFormValidation): boolean {
    loginFormValid.phoneNumber = this.checkPhone(loginForm.phoneNumber);
    loginFormValid.password = this.checkPassword(loginForm.password);
    return loginFormValid.phoneNumber && loginFormValid.password;
  }

  private checkRegisterForm(registerForm: RegisterForm, registerFormValidation: RegisterFormValidation) {
    registerFormValidation.firstName = this.checkFirstName(registerForm.firstName);
    registerFormValidation.email = this.checkEmail(registerForm.email);
    registerFormValidation.phoneNumber = this.checkPhone(registerForm.phoneNumber);
    registerFormValidation.password = this.checkPassword(registerForm.password);
    registerFormValidation.confirmPassword = this.checkEqualsPasswords(registerForm.password, registerForm.confirmPassword);

    return registerFormValidation.firstName && registerFormValidation.email && registerFormValidation.phoneNumber
      && registerFormValidation.password && registerFormValidation.confirmPassword;
  }

  public checkFirstName(firstName: string): boolean {
    firstName = firstName.toLocaleLowerCase().trim();
    if (firstName.length < 3 || firstName.length > 32 || firstName.includes('  ')) {
      return false;
    }
    return this.checkRegexForEachLetter(firstName, /[a-z|а-я|ё| ]/);
  }

  public checkPhone(phoneNumber: string): boolean {
    return phoneNumber.length == 9
      && this.checkRegexForEachLetter(phoneNumber, /[0-9]/);
  }

  public checkPassword(password: string): boolean {
    return password.length >= 6 && password.length <= 18
      && !password.includes(' ');
  }

  public checkEqualsPasswords(password1: string, password2: string): boolean {
    return password1 == password2;
  }

  public checkEmail(email: string): boolean {

    email = email.toLowerCase().trim();
    if (!email.length) {
      return true;
    }

    if (email.includes(' ') || email.length > 32 || !/(\w|.){2}@[a-z]{2,}\.(com|ru|by)$/.test(email)) {
      return false;
    }

    const leftPart = email.split('@')[0];
    const middlePart = email.split('@')[1].split('.')[0];

    return this.checkRegexForEachLetter(leftPart, /\w|\./)
      && this.checkRegexForEachLetter(middlePart, /[a-z]/);
  }

  /*  Util  */

  private getPreparedLoginForm(loginForm: LoginForm): LoginForm {
    const preparedLoginForm = new LoginForm();
    preparedLoginForm.phoneNumber = '+375' + loginForm.phoneNumber;
    preparedLoginForm.password = loginForm.password;
    return preparedLoginForm;
  }

  private getPreparedRegisterForm(registerForm: RegisterForm): RegisterForm {
    const preparedRegisterForm = new RegisterForm();
    preparedRegisterForm.firstName = registerForm.firstName.trim();
    preparedRegisterForm.email = registerForm.email.trim();
    preparedRegisterForm.phoneNumber = '+375' + registerForm.phoneNumber;
    preparedRegisterForm.password = registerForm.password;
    return preparedRegisterForm;
  }

  private checkRegexForEachLetter(line: string, regex: RegExp): boolean {
    for (let i = 0; i < line.length; i++) {
      if (!regex.test(line[i])) {
        return false;
      }
    }

    return true;
  }

  /*  API  */

  private loginApi(loginForm: LoginForm): Observable<HttpResponse<LoginForm>> {
    return this.http.post<LoginForm>(BASE_URL + LOGIN_API, loginForm, { observe: 'response' });
  }

  private signupApi(registerForm: RegisterForm): Observable<HttpResponse<RegisterForm>> {
    return this.http.post<RegisterForm>(BASE_URL + SINGUP_API, registerForm, { observe: 'response' });
  }
}
