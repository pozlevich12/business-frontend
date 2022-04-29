import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';
import { HomeService } from '../_services/home.service';
import { TokenStorageService } from '../_services/auth/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories!: CategoriesObject[];
  locations!: LocationObject[];

  constructor(public appComponent: AppComponent, private homeService: HomeService, private localStorage: TokenStorageService, public router: Router) {
  }

  ngOnInit(): void {
    if(window.location.pathname == '/home') {
      window.location.href = '/';
    }
    const categories = this.localStorage.getCategories();
    if (!categories) {
      this.homeService.loadCategoryList().subscribe(body => {
        this.categories = body;
        this.localStorage.saveCategories(this.categories);
      });
    } else {
      this.categories = JSON.parse(categories);
    }
    
    const locations = this.localStorage.getLocations();
    if(!locations) {
      this.homeService.loadLocationList().subscribe(body => {
        this.locations = body;
        this.localStorage.saveLocations(this.locations);
      });
    } else {
      this.locations = JSON.parse(locations);
    }
  }
}