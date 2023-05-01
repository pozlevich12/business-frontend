import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { HomeService } from '../_services/home.service';
import { TokenStorageService } from '../_services/auth/token-storage.service';
import { AdList } from '../common/ad/AdList';
import { AdListService } from '../_services/ad/ad-list.service';
import { AdFilter } from '../common/AdFilter';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';
import { Region } from '../common/location/Region';
import { AdExecuteLimit } from '../common/AdExecuteLimit';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  adList: AdList[] = [];
  categories: CategoriesObject[] | undefined;
  regions: Region[] | undefined;

  constructor(public appComponent: AppComponent, private adListService: AdListService, private favoriteAdService: FavoriteAdService, private homeService: HomeService,
    private localStorage: TokenStorageService, public router: Router) {
  }

  ngOnInit(): void {
    if (window.location.pathname == '/') {
      const filter = new AdFilter();
      filter.adListExecuteLimit = new AdExecuteLimit(10, 0);
      this.adListService.getUnparsedAdList(filter).then((adList) => {
        this.adList = adList;
      });
    }

    this.categories = this.localStorage.getCategories();
    if (!this.categories) {
      this.homeService.loadCategoryList().subscribe(body => {
        this.categories = body;
        this.localStorage.saveCategories(this.categories);
      });
    }

    this.regions = this.localStorage.getRegions();
    if (!this.regions) {
      this.homeService.loadRegionList().subscribe(data => {
        this.regions = data as Region[];
        this.localStorage.saveRegions(this.regions);
      });
    }
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }
}