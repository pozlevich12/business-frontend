import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AdList } from '../common/AdList';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';

@Component({
  selector: 'app-favorite-board',
  templateUrl: './favorite-board.component.html',
  styleUrls: ['./favorite-board.component.scss']
})
export class FavoriteBoardComponent implements OnInit {

  adList: AdList[] | undefined;

  constructor(public appComponent: AppComponent, private favoriteAdService: FavoriteAdService) { }

  ngOnInit(): void {
    this.favoriteAdService.getUnparsedAdList().then(adList => {
      this.adList = adList;
      this.favoriteAdService
        .updateFavoriteAdStorageData(this.appComponent.user!, this.adList);
    });
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

  public deleteAllFavoriteAd() {
    this.favoriteAdService.deleteAllFavoriteAd(this.appComponent.user!)
      .then(() => { this.adList = [] });
  }
}
