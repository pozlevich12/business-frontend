import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { AdFilter } from '../common/AdFilter';
import { AdList } from '../common/ad/AdList';
import { CategoriesObject } from '../common/categories.object';
import { Region } from '../common/location/Region';
import { Location } from '../common/location/Location';
import { AdListService } from '../_services/ad/ad-list.service';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';
import { TokenStorageService } from '../_services/auth/token-storage.service';
import { LocationService } from '../_services/location.service';
import { AdExecutor } from '../common/ad/AdExecutor';
import { AdExecuteLimit } from '../common/AdExecuteLimit';
import { LoadMoreAdService } from '../_services/load-more-ad.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss']
})
export class AdListComponent implements OnInit, OnDestroy, AdExecutor {

  private subscriptionsLoadMoreAdService = new Subscription();

  adList: AdList[] = [];
  filter: AdFilter = new AdFilter();

  categories: CategoriesObject[] | undefined;
  regions: Region[] | undefined;

  locationsForSuggestion: Location[] = [];

  scrollTop: boolean = true;
  loading: boolean = true;

  constructor(private localStorage: TokenStorageService, private adListService: AdListService, private loadMoreAdService: LoadMoreAdService,
    public appComponent: AppComponent, private favoriteAdService: FavoriteAdService, private locationService: LocationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptionsLoadMoreAdService
      .add(this.loadMoreAdService.loading$.subscribe((loading$: boolean) => this.loading = loading$));

    const intervalInit = setInterval(() => {
      this.categories = this.localStorage.getCategories();
      this.regions = this.localStorage.getRegions();
      if (this.categories && this.regions) {
        this.filter = this.adListService.initFilterByQueryParams(this.route, this.categories, this.regions);
        this.updateLocationsForSuggestion();
        this.loadMoreAdService.changeCondition(this.filter);
        clearInterval(intervalInit);
      }
    }, 50);
  }

  public updateSubCategories() {
    this.filter.subCategoryId = undefined;
    this.refreshFilter();
  }

  public updateLocation() {
    this.filter.location = undefined;
    this.refreshFilter();
  }

  private updateLocationsForSuggestion() {
    this.locationsForSuggestion = this.locationService.getSortedLocationsByRegion(
      this.regions!.find(region => region.id == this.filter.region));
  }

  public refreshFilter() {
    this.updateLocationsForSuggestion();
    this.loadMoreAdService.changeCondition(this.filter);
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

  ngOnDestroy(): void {
    this.subscriptionsLoadMoreAdService.unsubscribe();
  }

  /*  AdExecutor Interface */

  public uploadNextAdList(adExecuteLimit: AdExecuteLimit): Promise<AdList[]> {
    this.filter.adListExecuteLimit = adExecuteLimit;
    return this.adListService.getUnparsedAdList(this.filter);
  }

  public setAdList(adList: AdList[]): void {
    this.adList = adList;
  }

  public getAdList(): AdList[] {
    return this.adList;
  }

  /*  ------------------  */
}
