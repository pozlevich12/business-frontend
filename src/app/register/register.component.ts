import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  checked = false;
  changedPassword = false;

  registerForm = {
    firstName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  registerFormValid = {
    firstName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false
  }

  constructor(private appComponent: AppComponent) {
    this.appComponent.components = [false, true];
  }

  ngOnInit(): void {

  }

  onKeyName(event: any) {
    if (this.checked) {
      this.registerFormValid.firstName = this.checkName();
    }
  }

  onKeyPhone(event: any) {
    if (this.checked) {
      this.registerFormValid.phoneNumber = this.checkPhone();
    }
  }

  onKeyEmail(event: any) {
    if (this.checked) {
      this.registerFormValid.email = this.checkEmail();
    }
  }

  onKeyPassword(event: any) {
    this.changedPassword = true;
    if (this.checked) {
      this.registerFormValid.password = this.checkPassword();
      this.registerFormValid.confirmPassword = this.checkConfirmPassword();
    }
  }

  onKeyConfirmPassword(event: any) {
    this.changedPassword = true;
    this.registerFormValid.confirmPassword = this.checkConfirmPassword();
  }

  checkConfirmPassword(): boolean {
    if (this.registerForm.password == this.registerForm.confirmPassword) {
      return true;
    }
    return false;
  }

  checkPassword(): boolean {
    for(let i = 0; i<this.registerForm.password.length; i++) {
      if(this.registerForm.password.charCodeAt(i) == 32) {
        return false;
      }
    }
    if (this.registerForm.password.length < 6 || this.registerForm.password.length > 32) {
      return false;
    }
    return true;
  }

  checkEmail(): boolean {
    this.registerForm.email = this.registerForm.email.trim();

    if (this.registerForm.email.length == 0) {
      return true;
    }

    if (this.registerForm.email.length < 8 || this.registerForm.email.length > 32) {
      return false;
    }

    let splitEmail = this.registerForm.email.split('@');
    if (splitEmail.length != 2) {
      return false;
    }

    if (splitEmail[0].length < 2 || splitEmail[1].length < 5) {
      return false;
    }

    splitEmail = splitEmail[1].split('.');
    if (splitEmail.length < 2) {
      return false;
    }

    for (let i = 0; i < splitEmail.length; i++) {
      if (splitEmail[i].length < 2) {
        return false;
      }
      for (let j = 0; j < splitEmail[i].length; j++) {
        if (splitEmail[i].charCodeAt(j) >= 65 && splitEmail[i].charCodeAt(j) <= 90) {
          continue;
        } else if (splitEmail[i].charCodeAt(j) >= 97 && splitEmail[i].charCodeAt(j) <= 122) {
          continue;
        } else {
          return false;
        }
      }
    }

    return true;
  }

  checkPhone(): boolean {
    if (this.registerForm.phoneNumber.length != 9) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      let temp = this.registerForm.phoneNumber.charCodeAt(i);
      if (temp >= 48 && temp <= 57) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  checkName(): boolean {
    for (let i = 0; i < this.registerForm.firstName.length; i++) {
      let temp = this.registerForm.firstName.charCodeAt(i);
      if (temp >= 1040 && temp <= 1103) {
        continue;
      } else if (temp == 1025 || temp == 1105 || temp == 32) {
        continue;
      } else if (temp >= 97 && temp <= 122) {
        continue;
      } else if (temp >= 65 && temp <= 90) {
        continue;
      } else if (temp >= 48 && temp <= 57) {
        continue;
      } else {
        return false;
      }
    }
    this.registerForm.firstName = this.registerForm.firstName.trim();
    return this.registerForm.firstName.length >= 3 && this.registerForm.firstName.length <= 32 ? true : false;
  }

  checkForm(): void {
    this.checked = true;
    this.registerFormValid.firstName = this.checkName();
    this.registerFormValid.phoneNumber = this.checkPhone();
    this.registerFormValid.email = this.checkEmail();
    this.registerFormValid.password = this.checkPassword();
  }
}
