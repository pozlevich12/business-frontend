import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { AppComponent } from '../app.component';
import { RegisterForm } from '../common/RegisterForm';
import { RegisterFormValidation } from '../common/validation-models/RegisterFormValidation';
import { AuthService } from '../_services/auth/auth.service';

const ID_REGISTER_FORM_MODAL = 'registerFormModal';
const ID_FIRST_NAME_INPUT = 'firstNameRegister';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerFormModal: bootstrap.Modal | undefined;
  registerForm: RegisterForm = new RegisterForm();
  registerFormValid: RegisterFormValidation | undefined;
  processRegister: boolean | undefined;
  errorMessage: string | undefined;

  constructor(public appComponent: AppComponent, public authService: AuthService) {
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const htmlModalElement = document.getElementById(ID_REGISTER_FORM_MODAL);
    this.registerFormModal = new bootstrap.Modal(htmlModalElement!);
    htmlModalElement?.addEventListener('shown.bs.modal', function () {
      (document.getElementById(ID_FIRST_NAME_INPUT) as HTMLInputElement).focus();
    });
  }

  public onKeyName() {
    if (this.registerFormValid) {
      this.registerFormValid.firstName = this.authService.checkFirstName(this.registerForm.firstName);
    }
  }

  public onKeyPhone() {
    if (this.registerFormValid) {
      this.registerFormValid.phoneNumber = this.authService.checkPhone(this.registerForm.phoneNumber);
    }
  }

  public onKeyEmail() {
    if (this.registerFormValid) {
      this.registerFormValid.email = this.authService.checkEmail(this.registerForm.email);
    }
  }

  public onKeyPassword() {
    if (this.registerFormValid) {
      this.registerFormValid.password = this.authService.checkPassword(this.registerForm.password);
      this.onKeyConfirmPassword();
    }
  }

  public onKeyConfirmPassword() {
    if (this.registerFormValid) {
      this.registerFormValid.confirmPassword = this.authService
        .checkEqualsPasswords(this.registerForm.password, this.registerForm.confirmPassword);
    }
  }

  signup() {
    this.processRegister = true;
    if (!this.registerFormValid) {
      this.registerFormValid = new RegisterFormValidation();
    }

    this.authService.signup(this.registerForm, this.registerFormValid)
      .then(() => window.location.reload())
      .catch(errorMsg => {
        this.errorMessage = errorMsg;
        this.processRegister = false;
      });
  }
}