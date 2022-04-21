import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginForm } from '../common/login.form';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  checked = false;
  isLoginFailed = false;
  errorMessage = "";
  returnUrl: string | undefined;

  loginForm: LoginForm = new LoginForm();

  loginFormValid = {
    phoneNumber: false,
    password: false,
  }

  constructor(public appComponent: AppComponent, private authService: AuthService, private tokenStorage: TokenStorageService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    if(this.appComponent.isLoggedIn && this.tokenStorage.getToken()) {
      this.appComponent.router.navigate(['home']);
    }
  }

  onKeyPhone(event: any) {
    if (this.checked) {
      this.loginFormValid.phoneNumber = this.checkPhone();
    }
  }

  checkPhone(): boolean {
    if (this.loginForm.phoneNumber.length != 9) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      let temp = this.loginForm.phoneNumber.charCodeAt(i);
      if (temp >= 48 && temp <= 57) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  onKeyPassword(event: any) {
    if (this.checked) {
      this.loginFormValid.password = this.checkPassword();
    }
  }

  checkPassword(): boolean {
    for (let i = 0; i < this.loginForm.password.length; i++) {
      if (this.loginForm.password.charCodeAt(i) == 32) {
        return false;
      }
    }
    if (this.loginForm.password.length < 6 || this.loginForm.password.length > 32) {
      return false;
    }
    return true;
  }

  checkValid(): boolean {
    if (!this.loginFormValid.phoneNumber) {
      return false;
    }
    if (!this.loginFormValid.password) {
      return false;
    }
    return true;
  }

  setProcessingInDom(processing: any) {
    if(processing == true) {
      document.getElementById("btn_submit")?.setAttribute('disabled', 'true');
      document.getElementById("spinner")?.removeAttribute('hidden');
    } else {
      document.getElementById("btn_submit")?.removeAttribute('disabled');
      document.getElementById("spinner")?.setAttribute('hidden', 'true');
    }
  }

  checkForm(): void {
    this.isLoginFailed = false;
    this.loginFormValid.phoneNumber = this.checkPhone();
    this.loginFormValid.password = this.checkPassword();
    if (this.checkValid()) {
      this.setProcessingInDom(true);
      this.authService.login(this.loginForm).subscribe(
        (data: HttpResponse<LoginForm>) => {
          this.tokenStorage.saveToken(data.headers.get('auth-token'));
          this.tokenStorage.saveUser(data.body);
          window.location.href = this.returnUrl!;
        },
        err => {
          this.isLoginFailed = true;
          this.errorMessage = err.error;
          window.scrollTo(0, 0);
          this.setProcessingInDom(false);
        }
      );
      this.loginForm.phoneNumber = this.loginForm.phoneNumber.substring(4);
    } else {
      this.checked = true;
    }
  }
}
