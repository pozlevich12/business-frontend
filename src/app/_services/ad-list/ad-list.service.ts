import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdFilter } from 'src/app/common/AdFilter';
import { AdList } from 'src/app/common/AdList';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS_FOR_HORIZONTAL = "w_200,h_140,c_fill";
const CLOUDINARY_PARAMS_FOR_VERTICAL = "w_200,h_140,c_fill";
const CLOUDINARY_PARAMS_EQUALS = "h_140,c_scale";

@Injectable({
  providedIn: 'root'
})
export class AdListService {

  constructor(private http: HttpClient) { }

  public getAdList(filter: AdFilter) {
    return this.http.get(BASE_URL + 'get-ad-list', { 
      responseType: 'text',
      params: new HttpParams()
      .append('categoryId', filter.categoryId)
      .append('subCategoryId', filter.subCategoryId)
      .append('region', filter.region)
      .append('town', filter.town)
      .append('delivery', filter.delivery)
    });
  }

  public async getUnparsedAdList(filter: AdFilter): Promise<AdList[]> {
    let adList: AdList[] = [];
    await this.getAdList(filter).toPromise().then(
      data => {
        adList = JSON.parse(data);
        adList.forEach(ad => {
          this.mapImg(ad);
          this.mapCreated(ad);
        });
      },
      error => {
        alert(error);
      }
    );
    return adList;
  }

  private mapImg(ad: AdList) {
    if (ad.imgTitleUrl) {
      if (ad.height == ad.width) {
        ad.imgTitleUrl = ad.imgTitleUrl.replace(ad.imgTitleUrl.split('/')[6], CLOUDINARY_PARAMS_EQUALS);
      } else if (ad.height > ad.width) {
        ad.imgTitleUrl = ad.imgTitleUrl.replace(ad.imgTitleUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL);
      } else {
        ad.imgTitleUrl = ad.imgTitleUrl.replace(ad.imgTitleUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
      }
    }
  }

  private mapCreated(ad: AdList) {
    const current = new Date();
    const created = new Date(ad.created);

    const year = current.getUTCFullYear();
    const month = current.getUTCMonth();
    const day = current.getUTCDate();
    
    const yearAd = created.getUTCFullYear();
    const monthAd = created.getUTCMonth();
    const dayAd = created.getUTCDate();

    if (year == yearAd && month == monthAd && day == dayAd) {
      ad.created = 'Сегодня, ' + ad.created.substring(11, 16);
    } else if (year == yearAd && month == monthAd && day - 1 == dayAd ) {
      ad.created = 'Вчера, ' + ad.created.substring(11, 16);
    } else if (year == yearAd) {
      ad.created = ad.created.substring(8, 10) + this.getMonthName(monthAd) + ad.created.substring(11, 16);
    } else {
      ad.created = ad.created.substring(8, 10) + '-' + ad.created.substring(5, 7) + '-' + ad.created.substring(0, 4);
    }
  }

  private getMonthName(month: number): string {
    if (month == 0) {
      return " янв., ";
    } else if (month == 1) {
      return " фев., ";
    } else if (month == 2) {
      return " мар., ";
    } else if (month == 3) {
      return " апр., ";
    } else if (month == 4) {
      return " мая, ";
    } else if (month == 5) {
      return " июн., ";
    } else if (month == 6) {
      return " июл., ";
    } else if (month == 7) {
      return " авг., ";
    } else if (month == 8) {
      return " сен., ";
    } else if (month == 9) {
      return " окт., ";
    } else if (month == 10) {
      return " ноя., ";
    } else {
      return " дек., ";
    }
  }
}
