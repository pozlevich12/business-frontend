import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { LoginForm } from './common/login.form';
import { Theme } from './common/Theme';
import { User } from './common/User';
import { LoginFormValidation } from './common/validation-models/LoginFormValidation';
import { AuthService } from './_services/auth/auth.service';
import { TokenStorageService } from './_services/auth/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  colorPicker = false;
  theme: Theme = new Theme();
  dropdown: bootstrap.Dropdown | undefined;
  user: User | undefined;

  /*  Login form modal  */

  loginModal: bootstrap.Modal | undefined;
  loginForm: LoginForm = new LoginForm();
  loginFormValid: LoginFormValidation | undefined;
  processLogin: boolean | undefined;
  errorMessage: string | undefined;

  constructor(public tokenStorageService: TokenStorageService, private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    document.title = "Ежа";
    $('html').css('background-color', this.theme.backgroundColor);
    $('body').css('background-color', this.theme.backgroundColor);
    this.user = this.tokenStorageService.getUser();
  }

  ngAfterViewInit(): void {
    if (this.user) {
      this.dropdown = new bootstrap.Dropdown(document.querySelector('#dropdownUser1')!);
    } else {
      this.loginModal = new bootstrap.Modal(document.getElementById('loginFormModal')!);
    }
  }

  public toggleDropdownMenuUser() {
    this.dropdown?.toggle();
  }

  // remove if color is choised
  public updateBackgroundBody() {
    $('html').css('background-color', this.theme.backgroundColor);
    $('body').css('background-color', this.theme.backgroundColor);
  }

  public toggleColorPicker() {
    this.colorPicker = !this.colorPicker;
  }

  public onKeyPhone() {
    if (this.loginFormValid) {
      this.loginFormValid.phoneNumber = this.authService.checkPhone(this.loginForm.phoneNumber);
    }
  }

  public onKeyPassword() {
    if (this.loginFormValid) {
      this.loginFormValid.password = this.authService.checkPassword(this.loginForm.password);
    }
  }

  public login() {
    if (!this.loginFormValid) {
      this.loginFormValid = new LoginFormValidation();
    }

    if (this.authService.checkLoginForm(this.loginForm, this.loginFormValid)) {
      this.processLogin = true;
      this.authService.login(this.loginForm)
        .then(() => {
          this.user = this.tokenStorageService.getUser();
          window.location.reload();
        })
        .catch(errorMsg => {
          this.errorMessage = errorMsg;
          this.processLogin = false;
        });
    }
  }

  public logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
