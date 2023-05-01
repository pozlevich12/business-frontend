import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Theme } from './common/Theme';
import { User } from './common/User';
import { AuthService } from './_services/auth/auth.service';

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
  searchQuery: string | undefined;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
    $('html').css('background-color', this.theme.backgroundColor);
    $('body').css('background-color', this.theme.backgroundColor);
    $('html').css('overflow-y', 'scroll');
    $('html').css('overflow-x', 'auto');
    this.user = this.authService.getUser();
  }

  ngAfterViewInit() {
    if (this.user) {
      this.dropdown = new bootstrap.Dropdown(document.querySelector('#dropdownUser1')!);
    }
  }

  public showLoginModal() {
    $('#loginFormModal').modal('show');
  }

  public showRegisterModal() {
    $('#registerFormModal').modal('show');
  }

  public toggleDropdownMenuUser() {
    this.dropdown?.toggle();
  }

  // remove if color is choised
  public updateBackgroundBody() {
    $('html').css('background-color', this.theme.mainColor);
    $('body').css('background-color', this.theme.mainColor);
  }

  public toggleColorPicker() {
    this.colorPicker = !this.colorPicker;
  }

  public logout(): void {
    this.authService.signOut();
    window.location.reload();
  }

  public submitSearchForm() {
    window.location.href = "/search?query=" + this.searchQuery;
  }
}
