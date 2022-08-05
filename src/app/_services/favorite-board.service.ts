import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdList } from '../common/AdList';
import { AdListService } from './ad/ad-list.service';

const BASE_URL = environment.url;
const GET_FAVORITE_AD_API = 'get-favorite-ad';

@Injectable({
  providedIn: 'root'
})

export class FavoriteBoardService {

  constructor(private http: HttpClient, private adListService: AdListService) { }

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
}
