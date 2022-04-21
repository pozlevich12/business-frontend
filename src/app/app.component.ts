import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Theme } from './common/Theme';
import { User } from './common/User';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  isLoggedIn = false;
  showAdminBoard = false;
  colorPicker = false;
  theme: Theme = new Theme();
  dropdown: bootstrap.Dropdown | undefined;
  user: User | undefined;
  countFavoriteAd = 0;

  constructor(public tokenStorageService: TokenStorageService, public router: Router) { }

  ngOnInit(): void {
    document.title = "Ежа";
    $('html').css('background-color', this.theme.backgroundColor);
    $('body').css('background-color', this.theme.backgroundColor);
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser()!;
    }
  }

  ngAfterViewInit(): void {
    if (this.isLoggedIn) {
      this.dropdown = new bootstrap.Dropdown(document.querySelector('#dropdownUser1')!);
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

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
