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

  public deleteFavoriteAd(index: number) {
    this.favoriteAdService.deleteFavoriteAd(this.appComponent.user!, this.adList![index].id).then(() => {
      this.adList?.splice(index, 1);
    });
  }

  public deleteAllFavoriteAd() {
    this.favoriteAdService.deleteAllFavoriteAd(this.appComponent.user!)
      .then(() => { this.adList = [] });
  }
}
