import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { AdFilter } from '../common/AdFilter';
import { AdList } from '../common/AdList';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';
import { AdListService } from '../_services/ad/ad-list.service';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';
import { TokenStorageService } from '../_services/auth/token-storage.service';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss']
})
export class AdListComponent implements OnInit {

  adList: AdList[] = [];
  filter: AdFilter = new AdFilter();

  categories: CategoriesObject[] = [];
  locations: LocationObject[] = [];

  allAdLoaded: boolean = false;

  scrollTop: boolean = true;
  loadingPage: boolean = true;

  loadingNewAd: boolean = false;

  constructor(private localStorage: TokenStorageService, private adListService: AdListService,
    public appComponent: AppComponent, private favoriteAdService: FavoriteAdService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fillFilterFromQueryParams();
    window.history.pushState({ name: 'ad-list' }, document.title, 'ad-list');
    const intervalInit = setInterval(() => {
      let categories = this.localStorage.getCategories();
      let locations = this.localStorage.getLocations();
      if (categories && locations) {
        if (this.fillCategories(categories)
          && this.fillLocations(locations)
          && this.fillDelivery()) {
          this.adListService.getUnparsedAdList(this.filter).then((adList) => {
            this.adList = adList;
            this.loadingPage = false;
          });
        } else {
          this.resetFilter();
        }
        clearInterval(intervalInit);
      }
    }, 50);
  }

  private fillFilterFromQueryParams() {
    if (this.route.snapshot.queryParams["categoryId"]) {
      this.filter.categoryId = Number(this.route.snapshot.queryParams["categoryId"]);
    }
    if (this.route.snapshot.queryParams["subCategoryId"]) {
      this.filter.subCategoryId = Number(this.route.snapshot.queryParams["subCategoryId"]);
    }
    if (this.route.snapshot.queryParams["region"]) {
      this.filter.region = Number(this.route.snapshot.queryParams["region"]);
    }
    if (this.route.snapshot.queryParams["town"]) {
      this.filter.town = Number(this.route.snapshot.queryParams["town"]);
    }
    if (this.route.snapshot.queryParams["delivery"]) {
      this.filter.delivery = this.route.snapshot.queryParams["delivery"];
    }
  }

  private fillCategories(categories: any): boolean {
    this.categories = JSON.parse(categories);

    if (!this.filter.categoryId && !this.filter.subCategoryId) {
      return true;
    }

    if (!this.filter.categoryId && this.filter.subCategoryId) {
      return false;
    }

    const categoryIndex = this.categories.map(category => category.id).indexOf(this.filter.categoryId!);
    if (this.filter.categoryId && categoryIndex == -1) {
      return false;
    }

    if (this.filter.subCategoryId) {
      const indexSubCategory = this.categories[categoryIndex].subCategoryList
        .map(subCategory => subCategory.id)
        .indexOf(this.filter.subCategoryId);
      if (indexSubCategory == -1 && this.filter.subCategoryId) {
        return false;
      }
    }
    
    return true;
  }

  public getNextAd() {
    this.loadingNewAd = true;
    this.filter.offset = this.filter.offset + 15;
    this.adListService.getUnparsedAdList(this.filter).then((adList) => {
      if (adList.length < 15) {
        this.allAdLoaded = true;
      }
      this.adList = this.adList.concat(adList);
      this.loadingNewAd = false;
    });
  }

  private fillLocations(locations: any): boolean {
    this.locations = JSON.parse(locations);
    if (!this.filter.region && !this.filter.town) {
      return true;
    }
    if (!this.filter.region && this.filter.town) {
      return false;
    }

    const regionIndex = this.locations.map(region => region.id).indexOf(this.filter.region);
    if (this.filter.region && regionIndex == -1) {
      return false;
    }

    if (this.filter.town) {
      const townIndex = this.locations[regionIndex].locationList?.map(town => town.id).indexOf(this.filter.town);
      if (townIndex == -1 && this.filter.town) {
        return false;
      }
    }

    return true;
  }

  private fillDelivery(): boolean {

    if (!this.filter.delivery) {
      return true;
    }

    let delivery = String(this.filter.delivery).toLowerCase();
    if (delivery == 'true' || delivery == '1') {
      this.filter.delivery = true;
      return true;
    } else if (delivery == 'false' || delivery == '0') {
      this.filter.delivery = false;
      return true;
    } else {
      return false;
    }
  }

  public updateSubCategories() {
    this.filter.subCategoryId = undefined;
    this.refreshFilter();
  }

  public updateLocation() {
    this.filter.town = undefined;
    this.refreshFilter();
  }

  public refreshFilter() {
    this.loadingPage = true;
    this.adListService.getUnparsedAdList(this.filter).then(adList => {
      this.adList = adList;
      this.loadingPage = false;
      window.scrollTo(0, 0);
    });
  }

  public resetFilter() {
    this.filter = new AdFilter();
    this.refreshFilter();
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll() {
    if (window.scrollY != 0 && this.scrollTop) {
      this.scrollTop = false;
    } else if (window.scrollY == 0 && !this.scrollTop) {
      this.scrollTop = true;
    }
  }
}
