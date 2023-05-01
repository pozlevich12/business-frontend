import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { AdExecutor } from '../common/ad/AdExecutor';
import { AdList } from '../common/ad/AdList';
import { AdExecuteLimit } from '../common/AdExecuteLimit';
import { AdListService } from '../_services/ad/ad-list.service';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';
import { LoadMoreAdService } from '../_services/load-more-ad.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AdExecutor, OnInit, OnDestroy {

  query: string = "";
  adList: AdList[] = [];
  loading: boolean = true;

  public adViewAsCards = false;

  private subscriptions = new Subscription();

  constructor(public appComponent: AppComponent, private loadMoreAdService: LoadMoreAdService,
    private route: ActivatedRoute, public adListService: AdListService, private favoriteAdService: FavoriteAdService) { }

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParams["query"];
    this.subscriptions
      .add(this.loadMoreAdService.loading$.subscribe((loading$: boolean) => this.loading = loading$));
  }

  ngAfterViewInit() {
    this.updateConditionInLoadMoreAdService();
  }

  public updateConditionInLoadMoreAdService() {
    this.loadMoreAdService.changeCondition(this.query);
  }

  public uploadNextAdList(adExecuteLimit: AdExecuteLimit): Promise<AdList[]> {
    return this.adListService.getAdListByQuery(this.query, adExecuteLimit.limit, adExecuteLimit.offset);
  }

  public setAdList(adList: AdList[]) {
    this.adList = adList;
  }

  public getAdList(): AdList[] {
    return this.adList;
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
