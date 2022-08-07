import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AdList } from '../common/AdList';
import { AdListService } from '../_services/ad/ad-list.service';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';

@Component({
  selector: 'app-my-ad',
  templateUrl: './my-ad.component.html',
  styleUrls: ['./my-ad.component.scss']
})
export class MyAdComponent implements OnInit {

  adList: AdList[] = [];

  constructor(public appComponent: AppComponent, private adListService: AdListService, private favoriteAdService: FavoriteAdService) { }

  ngOnInit(): void {
    this.adListService.getAdListByAuthor(this.appComponent.user!.id).then(adList => {
      this.adList = adList;
    }).catch(() => alert("Something went wrong"));
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

}
