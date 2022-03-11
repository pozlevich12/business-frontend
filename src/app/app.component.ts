import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { User } from './common/User';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'business-frontend';
  components: boolean[] = [false, false];
  isLoggedIn = false;
  showAdminBoard = false;
  dropdown: bootstrap.Dropdown | undefined;
  user: User | undefined;
  countFavoriteAd = 0;

  constructor(public tokenStorageService: TokenStorageService, public router: Router) { }

  ngOnInit(): void {
    document.title = "BusinessFrontend";
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser()!;
      this.countFavoriteAd = this.user.favoriteAdList.length;
    }
    
  }

  ngAfterViewInit(): void {
    this.dropdown = new bootstrap.Dropdown(document.querySelector('#dropdownUser1')!);
  }

  public toggleDropdownMenuUser() {
      this.dropdown?.toggle();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
