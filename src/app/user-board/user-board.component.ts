import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { AppComponent } from '../app.component';
import { UserBoardService } from '../_services/user-board/user-board.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.scss']
})
export class UserBoardComponent implements OnInit {

  firstNameEditing: boolean = false;
  emailEditing: boolean = false;
  passwordEditing: boolean = false;

  processUpdate: boolean = false;

  oldPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  errorMessage = "";

  errorModal: Modal | undefined;
  mainPhonePoppover: bootstrap.Popover | undefined;

  constructor(public appComponent: AppComponent, private userBoardService: UserBoardService) { }

  ngOnInit(): void {
    
  }

  
  ngAfterViewInit() {
      this.errorModal = new bootstrap.Modal(document.getElementById('errorModal')!);
      this.mainPhonePoppover = new bootstrap.Popover(document.getElementById('main-phone-popover')!);
  }

  public editFirstName() {
    this.firstNameEditing = true;
    this.enableEditingField("#firstNameEditableField", this.appComponent.user!.firstName);
  }

  public editEmail() {
    this.emailEditing = true;
    this.enableEditingField("#emailEditableField", this.appComponent.user!.email);
  }

  public editPassword() {
    this.oldPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
    this.passwordEditing = true;
  }

  public changeFirstName(confirm: boolean) {
    this.processUpdate = true;
    const firstNameField = $('#firstNameEditableField');

    if (!confirm) {
      firstNameField.val(this.appComponent.user!.firstName);
      this.firstNameEditing = false;
      this.processUpdate = false;
      return;
    }

    const firstName = firstNameField.val() as string;
    this.userBoardService.changeFirstName(this.appComponent.user!, firstName)
    .then(() => { this.firstNameEditing = false })
    .catch(() => {
      this.errorMessage = "Пожалуйста, введите корректное имя";
      this.errorModal?.show(); 
    })
    .finally(() => this.processUpdate = false);
  }

  public changePassword(confirm: boolean) {
    this.processUpdate = true;
    if (!confirm) {
      this.passwordEditing = false;
      this.processUpdate = false;
      return;
    }

    this.userBoardService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword)
    .then(() => {
      this.passwordEditing = false;
    })
    .catch(err => {
      this.errorMessage = err;
      this.errorModal?.show();
    })
    .finally(() => {
      this.processUpdate = false;
    });
  }

  public changeAvatar(target: EventTarget) {
    const img = (target as HTMLInputElement).files![0];
    if (!img) {
      return;
    }

    this.processUpdate = true;
    this.userBoardService.changeAvatar(this.appComponent.user!, img)
    .catch(() => {
      this.errorMessage = "Новый аватар не загружен. Пожалуйста, используйте изображения формата .jpeg, .jpg, .png";
      this.errorModal?.show();
    })
    .finally(() => {
      this.processUpdate = false;
    });
  }

  public setDefaultAvatar() {
    this.processUpdate = true;
    this.userBoardService.setDefaultAvatar(this.appComponent.user!).finally(() => {
      this.processUpdate = false;
    });
  }

  public changeEmail(confirm: boolean) {
    this.processUpdate = true;
    const emailField = $('#emailEditableField');

    if (!confirm) {
      emailField.val(this.appComponent.user!.email);
      this.emailEditing = false;
      this.processUpdate = false;
      return;
    }

    const email = emailField.val() as string;
    this.userBoardService.changeEmail(this.appComponent.user!, email)
    .then(() => { this.emailEditing = false })
    .catch((err) => {
      console.log(err);
      this.errorMessage = err;
      this.errorModal?.show();
    })
    .finally(() => {
      this.processUpdate = false;
    });
  }

  private enableEditingField(id: string, value: string) {
    $(id).prop('disabled', false);
    $(id).val("").trigger('focus').val(value);
  }

}
