import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  user: User | undefined;

  constructor(public tokenStorageService: TokenStorageService, public router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser()!;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
