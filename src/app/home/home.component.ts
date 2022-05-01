import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';
import { HomeService } from '../_services/home.service';
import { TokenStorageService } from '../_services/auth/token-storage.service';
import { AdList } from '../common/AdList';
import { AdListService } from '../_services/ad/ad-list.service';
import { AdFilter } from '../common/AdFilter';
import { AdService } from '../_services/ad/ad.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  adList: AdList[] = [];
  categories!: CategoriesObject[];
  locations!: LocationObject[];

  constructor(public appComponent: AppComponent, private adListService: AdListService, private adService: AdService, private homeService: HomeService,
    private localStorage: TokenStorageService, public router: Router) {
  }

  ngOnInit(): void {
    if (window.location.pathname == '/home') {
      window.location.href = '/';
    }
    const filter = new AdFilter();
    filter.limit = 4;
    this.adListService.getUnparsedAdList(filter).then((adList) => {
      this.adList = adList;
    });

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
    if (!locations) {
      this.homeService.loadLocationList().subscribe(body => {
        this.locations = body;
        this.localStorage.saveLocations(this.locations);
      });
    } else {
      this.locations = JSON.parse(locations);
    }
  }

  public toggleFavorite(id: number) {
    this.adService.toggleFavorite(this.appComponent.user!, id);
  }
}