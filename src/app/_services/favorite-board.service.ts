import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdList } from '../common/AdList';
import { User } from '../common/User';
import { AdListService } from './ad/ad-list.service';
import { AdService } from './ad/ad.service';
import { FavoriteAdService } from './ad/favorite-ad.service';
import { TokenStorageService } from './auth/token-storage.service';

const BASE_URL = environment.url;
const GET_FAVORITE_AD_API = 'get-favorite-ad';

@Injectable({
  providedIn: 'root'
})

export class FavoriteBoardService {

  constructor(private http: HttpClient, private adListService: AdListService, private adService: AdService, private favoriteAdService: FavoriteAdService) { }

  public getUnparsedAdList(): Promise<AdList[]> {
    return new Promise(resolve => {
      this.getFavoriteAdList().subscribe(adList => {
        this.adListService.mapAdListResponse(adList);
        resolve(adList);
      });
    });
  }

  public getFavoriteAdList(): Observable<any> {
    return this.http.get(BASE_URL + GET_FAVORITE_AD_API);
  }

  public updateFavoriteAdStorageData(user: User, adList: AdList[]) {
    user.favoriteAdList = adList.map(adList => adList.id);
    this.tokenStorageService.saveUser(user);
  }

  public deleteFavoriteAd(user: User, adList: AdList[], index: number) {
    this.adService.deleteFavoriteAd(user, adList[index].id).then(() => {
      adList = adList.splice(index, 1);
    });
  }
}
