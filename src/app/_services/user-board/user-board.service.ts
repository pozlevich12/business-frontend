import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/common/User';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';

const BASE_URL = environment.url;
const CHANGE_FIRST_NAME_API = 'user-board/change-first-name';
const CHANGE_AVATAR_API = BASE_URL + 'user-board/change-avatar';
const SET_DEFAULT_AVATAR_URL = 'user-board/set-default-avatar';
const CHANGE_EMAIL_API = 'user-board/change-email';
const CHANGE_PASSWORD_API = 'user-board/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserBoardService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService, private authService: AuthService) { }

  public changeFirstName(user: User, firstName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (firstName == user.firstName) {
        resolve();
        return;
      }

      this.changeFirstNameApi(firstName).subscribe(() => {
        user.firstName = firstName;
        this.tokenStorageService.saveUser(user);
        resolve();
      },
        err => { reject(err.error) })
    });
  }

  public changeEmail(user: User, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (email == user.email) {
        resolve();
        return;
      }

      this.changeEmailApi(email).subscribe(() => {
        user.email = email;
        this.tokenStorageService.saveUser(user);
        resolve();
      },
        err => { reject(err.error) })
    });
  }

  public changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.authService.checkPassword(newPassword)) {
        reject("Новый пароль должен содержать от 6 до 18 символов. Пробелы запрещены.")
      } else if (!this.authService.checkEqualsPasswords(newPassword, confirmPassword)) {
        reject("Ошибка подтверждения пароля");
      } else {
        this.changePasswordApi(oldPassword, newPassword).subscribe(() => {
          resolve();
        },
        err => reject(err.error));
      }
    });
  }

  public changeAvatar(user: User, img: File): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadImgApi(img)
        .subscribe(resp => {
          user.avatarUrl = resp.secure_url;
          this.tokenStorageService.saveUser(user);
          resolve();
        },
          err => { console.log(err); reject(err.error) })
    });
  }

  public setDefaultAvatar(user: User) {
    return new Promise<void>((resolve, reject) => {
      this.setDefaultAvatarApi().subscribe(resp => {
        user.avatarUrl = resp.defaultAvatarUrl;
        this.tokenStorageService.saveUser(user);
        resolve();
      },
        err => reject(err.error))
    })

  }

  /*  API  */

  private changeFirstNameApi(firstName: string) {
    const formData = new FormData();
    formData.append('firstName', firstName);
    return this.http.post(BASE_URL + CHANGE_FIRST_NAME_API, formData);
  }

  private changeEmailApi(email: string) {
    const formData = new FormData();
    formData.append('email', email);
    return this.http.post(BASE_URL + CHANGE_EMAIL_API, formData);
  }

  private loadImgApi(img: File) {
    const formData = new FormData();
    formData.append('img', img);
    formData.append('width', "100");
    formData.append('height', "100");
    return this.http.post<any>(CHANGE_AVATAR_API, formData);
  }

  private setDefaultAvatarApi() {
    return this.http.post<any>(BASE_URL + SET_DEFAULT_AVATAR_URL, undefined);
  }

  private changePasswordApi(oldPassword: string, newPassword: string) {
    return this.http.post<any>(BASE_URL + CHANGE_PASSWORD_API, { oldPassword: oldPassword, newPassword: newPassword });
  }
}
