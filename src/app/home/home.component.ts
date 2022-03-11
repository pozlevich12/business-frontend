import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';
import { HomeService } from '../_services/home.service';
import { SessionStorageService } from '../_services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories!: CategoriesObject[];
  locations!: LocationObject[];

  constructor(private appComponent: AppComponent, private homeService: HomeService, private sessionStorage: SessionStorageService, public router: Router) { 
    this.appComponent.components = [true, false];
  }

  ngOnInit(): void {
    const categories = this.sessionStorage.getCategories();
    if (!categories) {
      this.homeService.loadCategoryList().subscribe(body => {
        this.categories = body;
        this.sessionStorage.saveCategories(this.categories);
      });
    } else {
      this.categories = JSON.parse(categories);
    }
    
    const locations = this.sessionStorage.getLocations();
    if(!locations) {
      this.homeService.loadLocationList().subscribe(body => {
        this.locations = body;
        this.sessionStorage.saveLocations(this.locations);
      });
    } else {
      this.locations = JSON.parse(locations);
    }
  }
}