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

const PHONE_NUMBER_REGEX = /^[0-9]{9}$/;
const FIRST_NAME_REGEX = /^[a-z|а-я|ё|-]{3,32}$/i;
const EMAIL_REGEX = /^[.-\w]{2,25}@[a-z]{2,15}\.(com|ru|by)$/i;
const PASSWORD_REGEX = /^.{6,18}$/;

const PHONE_NUMBER_PREFIX = '+375';

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
    firstName = firstName.trim();
    return !firstName.includes('  ') && FIRST_NAME_REGEX.test(firstName);
  }

  public checkPhone(phoneNumber: string): boolean {
    return PHONE_NUMBER_REGEX.test(phoneNumber);
  }

  public checkPassword(password: string): boolean {
    return !password.includes(' ') && PASSWORD_REGEX.test(password);
  }

  public checkEqualsPasswords(password1: string, password2: string): boolean {
    return password1 == password2;
  }

  public checkEmail(email: string): boolean {
    email = email.trim();
    if (!email.length) {
      return true;
    }

    return EMAIL_REGEX.test(email);
  }

  /*  Util  */

  private getPreparedLoginForm(loginForm: LoginForm): LoginForm {
    const preparedLoginForm = new LoginForm();
    preparedLoginForm.phoneNumber = PHONE_NUMBER_PREFIX + loginForm.phoneNumber;
    preparedLoginForm.password = loginForm.password;
    return preparedLoginForm;
  }

  private getPreparedRegisterForm(registerForm: RegisterForm): RegisterForm {
    const preparedRegisterForm = new RegisterForm();
    preparedRegisterForm.firstName = registerForm.firstName.trim();
    preparedRegisterForm.email = registerForm.email.trim();
    preparedRegisterForm.phoneNumber = PHONE_NUMBER_PREFIX + registerForm.phoneNumber;
    preparedRegisterForm.password = registerForm.password;
    return preparedRegisterForm;
  }

  /*  API  */

  private loginApi(loginForm: LoginForm): Observable<HttpResponse<LoginForm>> {
    return this.http.post<LoginForm>(BASE_URL + LOGIN_API, loginForm, { observe: 'response' });
  }

  private signupApi(registerForm: RegisterForm): Observable<HttpResponse<RegisterForm>> {
    return this.http.post<RegisterForm>(BASE_URL + SINGUP_API, registerForm, { observe: 'response' });
  }
}
