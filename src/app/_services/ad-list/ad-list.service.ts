import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdFilter } from 'src/app/common/AdFilter';
import { AdList } from 'src/app/common/AdList';
import { environment } from 'src/environments/environment';
import { DateService } from '../date.service';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS_FOR_HORIZONTAL = "w_200,h_140,c_fill";
const CLOUDINARY_PARAMS_FOR_VERTICAL = "w_200,h_140,c_fill";
const CLOUDINARY_PARAMS_EQUALS = "h_140";

@Injectable({
  providedIn: 'root'
})
export class AdListService {

  constructor(private http: HttpClient, private dateService: DateService) { }

  public getAdList(filter: AdFilter) {
    return this.http.get(BASE_URL + 'public/get-ad-list', {
      responseType: 'text',
      params: this.getFilterHttpParams(filter)
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

  public async getUnparsedAdList(filter: AdFilter): Promise<AdList[]> {
    let adList: AdList[] = [];
    await this.getAdList(filter).toPromise().then(
      data => {
        adList = JSON.parse(data);
        adList.forEach(ad => {
          this.mapImg(ad);
          this.dateService.mapCreatedDate(ad);
        });
      },
      error => {
        alert(error);
      }
    );
    return adList;
  }

  private mapImg(ad: AdList) {
    if (ad.titleImgUrl) {
      if (ad.titleImgHeight == ad.titleImgWidth) {
        ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_EQUALS);
      } else if (ad.titleImgHeight > ad.titleImgWidth) {
        ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL);
      } else {
        ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
      }
    }
  }
}
