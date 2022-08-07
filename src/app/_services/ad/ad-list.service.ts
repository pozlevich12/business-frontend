import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdFilter } from 'src/app/common/AdFilter';
import { AdList } from 'src/app/common/AdList';
import { environment } from 'src/environments/environment';
import { DateService } from '../date.service';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS_FOR_HORIZONTAL = "w_200,h_140,c_fill";
const CLOUDINARY_PARAMS_EQUALS = "h_140";
const NO_IMAGE_DEFAULT_URL = "assets/ad_list_no_image.png";

@Injectable({
  providedIn: 'root'
})
export class AdListService {

  constructor(private http: HttpClient, private dateService: DateService) { }

  /*  check for refactoring  */
  public getAdList(filter: AdFilter): Observable<AdList[]> {
    return this.http.get<AdList[]>(BASE_URL + 'public/get-ad-list',
      { params: this.getFilterHttpParams(filter) });
  }

  public getAdListByAuthor(authorId: number): Promise<AdList[]> {
    return new Promise(resolve => {
      this.http.get<AdList[]>(BASE_URL + 'get-author-ad-list/' + authorId).subscribe(adList => {
        this.mapAdListResponse(adList);
        resolve(adList);
      });
    });
  }

  private getFilterHttpParams(filter: AdFilter) {
    return new HttpParams()
      .append('categoryId', filter.categoryId || "")
      .append('subCategoryId', filter.subCategoryId || "")
      .append('region', filter.region || "")
      .append('town', filter.town || "")
      .append('delivery', filter.delivery || "")
      .append('limit', filter.limit)
      .append('offset', filter.offset);
  }

  public getUnparsedAdList(filter: AdFilter): Promise<AdList[]> {
    return new Promise(resolve => {
      this.getAdList(filter).subscribe(adList => {
        this.mapAdListResponse(adList);
        resolve(adList);
      });
    });
  }

  public mapAdListResponse(adList: AdList[]) {
    adList.forEach(ad => {
      this.mapImg(ad);
      this.dateService.mapCreatedDate(ad);
    });
  }

  private mapImg(ad: AdList) {
    if (!ad.titleImgUrl) {
      ad.titleImgUrl = NO_IMAGE_DEFAULT_URL;
      return;
    }

    if (ad.titleImgWidth > ad.titleImgHeight) {
      ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
    } else {
      ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_EQUALS);
    }
  }
}
