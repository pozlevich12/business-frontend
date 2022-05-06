import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { AppComponent } from '../app.component';
import { LoginForm } from '../common/login.form';
import { LoginFormValidation } from '../common/validation-models/LoginFormValidation';
import { AuthService } from '../_services/auth/auth.service';

const ID_LOGIN_FORM_MODAL = 'loginFormModal';
const ID_PHONE_INPUT = 'phoneLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginModal: bootstrap.Modal | undefined;
  loginForm: LoginForm = new LoginForm();
  loginFormValid: LoginFormValidation | undefined;
  processLogin: boolean | undefined;
  errorMessage: string | undefined;

  constructor(public appComponent: AppComponent, public authService: AuthService) { }

  ngOnInit(): void {

    const htmlModalElement = document.getElementById(ID_LOGIN_FORM_MODAL);
    this.loginModal = new bootstrap.Modal(htmlModalElement!);
    htmlModalElement?.addEventListener('shown.bs.modal', function () {
      (document.getElementById(ID_PHONE_INPUT) as HTMLInputElement).focus();
    });

    htmlModalElement?.addEventListener('hide.bs.modal', function (event) {
      if (window.location.pathname == '/create-ad' || window.location.pathname == '/favorite-board'
        || window.location.pathname.includes('/ad-edit')) {
        if (confirm('Вы будете перенаправлены на главную страницу')) {
          window.location.href = '/';
        } else {
          event.preventDefault();
          (document.getElementById(ID_PHONE_INPUT) as HTMLInputElement).focus();
        }
      }
    });
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
    this.processLogin = true;
    if (!this.loginFormValid) {
      this.loginFormValid = new LoginFormValidation();
    }

    this.authService.login(this.loginForm, this.loginFormValid)
      .then(() => window.location.reload())
      .catch(errorMsg => {
        this.errorMessage = errorMsg;
        this.processLogin = false;
      });
  }
}
