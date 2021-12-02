import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'business-frontend';
  components: boolean[] = [false, false];
  roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  firstName?: string;
  avatarUrl?: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['home']);
    this.setUserInfo();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  setUserInfo(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.firstName = user.firstName;
      this.avatarUrl = user.avatarUrl;
    }
  }
}
