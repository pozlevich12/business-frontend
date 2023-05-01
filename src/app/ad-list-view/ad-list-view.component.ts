import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AdList } from '../common/ad/AdList';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';

@Component({
  selector: 'app-ad-list-view',
  templateUrl: './ad-list-view.component.html',
  styleUrls: ['./ad-list-view.component.scss']
})
export class AdListViewComponent implements OnInit {

  @Input() adList: AdList[] = [];
  loading: boolean = true;

  public adViewAsCards = false;

  constructor(public appComponent: AppComponent, private favoriteAdService: FavoriteAdService) { }

  ngOnInit(): void {
  }

  
  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

}
