import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { AdFilter } from '../common/AdFilter';
import { AdList } from '../common/AdList';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';
import { AdListService } from '../_services/ad-list/ad-list.service';
import { AdService } from '../_services/ad/ad.service';
import { TokenStorageService } from '../_services/token-storage.service';

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

  scrollTop: boolean = true;
  loadingPage: boolean = true;

  constructor(private localStorage: TokenStorageService, private adListService: AdListService, public appComponent: AppComponent, private adService: AdService, private route: ActivatedRoute) { }

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

    if (this.filter.categoryId == -1 && this.filter.subCategoryId == -1) {
      return true;
    }

    if (this.filter.categoryId == -1 && this.filter.subCategoryId != -1) {
      return false;
    }

    const categoryIndex = this.categories.map(e => e.categoryId).indexOf(this.filter.categoryId);
    if (this.filter.categoryId != -1 && categoryIndex == -1) {
      return false;
    }

    const indexSubCategory = this.categories[categoryIndex].subCategories.map(e => e.subCategoryId).indexOf(this.filter.subCategoryId);
    if (indexSubCategory == -1 && this.filter.subCategoryId != -1) {
      return false;
    }

    return true;
  }

  private fillLocations(locations: any): boolean {
    this.locations = JSON.parse(locations);
    if (this.filter.region == -1 && this.filter.town == -1) {
      return true;
    }
    if (this.filter.region == -1 && this.filter.town != -1) {
      return false;
    }

    const regionIndex = this.locations.map(e => e.regionId).indexOf(this.filter.region);
    if (this.filter.region != -1 && regionIndex == -1) {
      return false;
    }

    const townIndex = this.locations[regionIndex].townList?.map(e => e.id).indexOf(this.filter.town);
    if (townIndex == -1 && this.filter.town != -1) {
      return false;
    }

    return true;
  }

  private fillDelivery(): boolean {
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
    this.filter.subCategoryId = -1;
    this.refreshFilter();
  }

  public updateLocation() {
    this.filter.town = -1;
    this.refreshFilter();
  }

  public refreshFilter() {
    this.loadingPage = true;
    this.adListService.getUnparsedAdList(this.filter).then((adList) => {
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
    this.adService.toggleFavorite(this.appComponent.user!, id);
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
