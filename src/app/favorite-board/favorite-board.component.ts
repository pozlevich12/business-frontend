import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { AdExecutor } from '../common/ad/AdExecutor';
import { AdList } from '../common/ad/AdList';
import { AdExecuteLimit } from '../common/AdExecuteLimit';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';
import { LoadMoreAdService } from '../_services/load-more-ad.service';

@Component({
  selector: 'app-favorite-board',
  templateUrl: './favorite-board.component.html',
  styleUrls: ['./favorite-board.component.scss']
})
export class FavoriteBoardComponent implements OnInit, OnDestroy, AdExecutor {

  adList: AdList[] = [];
  loading: boolean = true;

  private subscriptions = new Subscription();
// короче рекурсия какая то
  constructor(public appComponent: AppComponent, private favoriteAdService: FavoriteAdService, private loadMoreAdService: LoadMoreAdService) { }

  ngOnInit(): void {
    this.subscriptions
      .add(this.loadMoreAdService.loading$.subscribe((loading$: boolean) => this.loading = loading$));
  }

  ngAfterViewInit() {
    this.loadMoreAdService.changeCondition("null");
  }

  uploadNextAdList(adExecuteLimit: AdExecuteLimit): Promise<AdList[]> {
    return this.favoriteAdService.getUnparsedAdList(adExecuteLimit);
  }

  setAdList(adList: AdList[]): void {
    this.adList = adList;
    this.favoriteAdService.updateFavoriteAdStorageData(this.appComponent.user!, this.adList);
  }
  getAdList(): AdList[] {
    return this.adList;
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

  public deleteAllFavoriteAd() {
    this.favoriteAdService.deleteAllFavoriteAd(this.appComponent.user!)
      .then(() => { this.adList = [] });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
