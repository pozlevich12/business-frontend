import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdList } from 'src/app/common/AdList';
import { User } from 'src/app/common/User';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';
import { AdListService } from './ad-list.service';

const BASE_URL = environment.url;
const ADD_FAVORITE_AD_API = 'favorite-add';
const DELETE_FAVORITE_AD_API = 'favorite-delete';
const DELETE_ALL_FAVORITE_AD_API = 'favorite-delete-all';
const GET_FAVORITE_AD_API = 'get-favorite-ad';

@Injectable({
  providedIn: 'root'
})

export class FavoriteAdService {

  constructor(private http: HttpClient, private localStorageService: TokenStorageService, private adListService: AdListService) { }

  public getUnparsedAdList(): Promise<AdList[]> {
    return new Promise(resolve => {
      this.getFavoriteAdList().subscribe(adList => {
        this.adListService.mapAdListResponse(adList);
        resolve(adList);
      });
    });
  }

  public updateFavoriteAdStorageData(user: User, adList: AdList[]) {
    user.favoriteAdList = adList.map(adList => adList.id);
    this.localStorageService.saveUser(user);
  }

  public toggleFavorite(user: User, id: number) {
    if (!user) {
      window.location.href = '/login?returnUrl=' + window.location.pathname;
    }

    if (user.favoriteAdList.includes(id)) {
      this.deleteFavoriteAd(user, id);
    } else {
      this.addFavoriteAd(user, id);
    }
  }

  public deleteFavoriteAdIfExists(user: User, id: number) {
    if (user.favoriteAdList.includes(id)) {
      this.deleteFavoriteAd(user, id);
    }
  }

  private addFavoriteAd(user: User, id: number) {
    this.addFavoriteAdApi(id).subscribe(() => {
      user.favoriteAdList.push(id);
      this.localStorageService.saveUser(user);
    }, () => { alert("Something went wrong") });
  }

  public deleteFavoriteAd(user: User, id: number): Promise<void> {
    return new Promise(resolve => {
      const index = user.favoriteAdList.indexOf(id);
      if (index != -1) {
        this.deleteFavoriteAdApi(id).subscribe(() => {
          user.favoriteAdList.splice(index, 1);
          this.localStorageService.saveUser(user);
          resolve();
        }, () => { alert("Something went wrong") });
      }
    });
  }

  public deleteAllFavoriteAd(user: User): Promise<void> {
    return new Promise(resolve => {
      this.deleteAllFavoriteAdApi().subscribe(() => {
        user.favoriteAdList = [];
        this.localStorageService.saveUser(user);
        resolve();
      }, () => { alert("Something went wrong") });
    });
  }

  /*  API  */

  private addFavoriteAdApi(id: number): Observable<void> {
    return this.http.get<void>(BASE_URL + ADD_FAVORITE_AD_API, { params: { "id": id } });
  }

  private deleteFavoriteAdApi(id: number): Observable<void> {
    return this.http.delete<void>(BASE_URL + DELETE_FAVORITE_AD_API, { params: { "id": id } });
  }

  public getFavoriteAdList(): Observable<AdList[]> {
    return this.http.get<AdList[]>(BASE_URL + GET_FAVORITE_AD_API);
  }

  private deleteAllFavoriteAdApi(): Observable<void> {
    return this.http.delete<void>(BASE_URL + DELETE_ALL_FAVORITE_AD_API);
  }
}
