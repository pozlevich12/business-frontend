import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdFilter } from 'src/app/common/AdFilter';
import { AdList } from 'src/app/common/ad/AdList';
import { environment } from 'src/environments/environment';
import { DateService } from '../date.service';
import { ActivatedRoute } from '@angular/router';
import { Region } from 'src/app/common/location/Region';
import { CategoriesObject } from 'src/app/common/categories.object';
import { LocationService } from '../location.service';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS_FOR_HORIZONTAL = "w_222,h_140,c_fill";
const CLOUDINARY_PARAMS_EQUALS = "h_140";
const NO_IMAGE_DEFAULT_URL = "assets/ad_list_no_image.png";

@Injectable({
  providedIn: 'root'
})

export class AdListService {

  constructor(private http: HttpClient, private dateService: DateService, private locationService: LocationService) { }

  /*  Init filter by Query Params  */

  public initFilterByQueryParams(route: ActivatedRoute, categories: CategoriesObject[], regions: Region[]): AdFilter {
    const filter = new AdFilter();

    if (route.snapshot.queryParams["categoryId"]) {
      filter.categoryId = Number(route.snapshot.queryParams["categoryId"]);
    }
    if (route.snapshot.queryParams["subCategoryId"]) {
      filter.subCategoryId = Number(route.snapshot.queryParams["subCategoryId"]);
    }
    if (route.snapshot.queryParams["region"]) {
      filter.region = Number(route.snapshot.queryParams["region"]);
    }
    if (route.snapshot.queryParams["location"]) {
      filter.location = Number(route.snapshot.queryParams["location"]);
    }
    if (route.snapshot.queryParams["delivery"]) {
      const strDelivery = String(route.snapshot.queryParams["delivery"]).toLowerCase();
      filter.delivery = strDelivery == 'true' || strDelivery == '1';
    }

    window.history.pushState({ name: 'ad-list' }, document.title, 'ad-list');
    return this.isValidFilter(filter, categories, regions) ? filter : new AdFilter();
  }

  private isValidFilter(filter: AdFilter, categories: CategoriesObject[], regions: Region[]): boolean {
    if (!this.isValidCategoryInFilter(filter, categories)) {
      return false;
    }

    if (!this.isValidLocationInFilter(filter, regions)) {
      return false;
    }

    return true;
  }


  /*  API's  */

  public getAdListByAuthor(authorId: number): Promise<AdList[]> {
    return new Promise(resolve => {
      this.http.get<AdList[]>(BASE_URL + 'public/get-author-ad-list/' + authorId).subscribe(adList => {
        this.mapAdListResponse(adList);
        resolve(adList);
      });
    });
  }

  public getAdListByQuery(query: string, limit: number, offset: number): Promise<AdList[]> {
    return new Promise(resolve => {
      this.http.get<AdList[]>(BASE_URL + "public/search?query=" + query + "&limit=" + limit + "&offset=" + offset).subscribe(adList => {
        this.mapAdListResponse(adList);
        resolve(adList);
      })
    })
  }


  public getUnparsedAdList(filter: AdFilter): Promise<AdList[]> {
    return new Promise(resolve => {
      this.getAdListApi(filter).subscribe(adList => {
        this.mapAdListResponse(adList);
        resolve(adList);
      });
    });
  }

  private getAdListApi(filter: AdFilter): Observable<AdList[]> {
    return this.http.post<AdList[]>(BASE_URL + 'public/get-ad-list', filter);
  }


  /*  Util  */

  private isValidCategoryInFilter(filter: AdFilter, categories: CategoriesObject[]): boolean {
    if (!filter.categoryId && !filter.subCategoryId) {
      return true;
    }

    if (!filter.categoryId && filter.subCategoryId) {
      return false;
    }

    const category = categories.find(category => category.id == filter.categoryId);
    if (!category) {
      return false;
    }

    if (filter.subCategoryId) {
      return category.subCategoryList
        .find(subCategory => subCategory.id == filter.subCategoryId)
        ? true : false;
    }

    return true;
  }

  private isValidLocationInFilter(filter: AdFilter, regions: Region[]): boolean {
    if (!filter.region && !filter.location) {
      return true;
    }
    if (!filter.region && filter.location) {
      return false;
    }

    const region = regions.find(region => region.id == filter.region);
    if (!region) {
      return false;
    }

    if (filter.location) {
      return this.locationService.getLocationsByRegion(region)
        .find(location => location.id == filter.location)
        ? true : false;
    }

    return true;
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

    if (ad.id == 75) {
      console.log(ad);
    }
    if (ad.titleImgWidth > ad.titleImgHeight) {
      ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
    } else {
      ad.titleImgUrl = ad.titleImgUrl.replace(ad.titleImgUrl.split('/')[6], CLOUDINARY_PARAMS_EQUALS);
    }
  }
}
