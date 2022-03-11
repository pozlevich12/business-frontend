import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageDTO } from 'src/app/common/ImageDTO.object';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS_FOR_HORIZONTAL = "w_700,h_500,c_fill";
const CLOUDINARY_PARAMS_FOR_VERTICAL = "h_500,c_scale";
const CLOUDINARY_PARAMS_FOR_VERTICAL_POPUP = "h_900,c_scale";
const CLOUDINARY_PARAMS_FOR_HORIZONTAL_POPUP = "w_1200,h_900,c_scale";

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient,) { }

  public getAd(id: number): Observable<any> {
    return this.http.get(BASE_URL + 'view-ad/' + id, { responseType: 'text' });
  }

  public fillImageList(response: any): ImageDTO[] {
    const images: ImageDTO[] = [];
    response.imgList.forEach((img: any) => {
      let url: string;
      if (img.height >= img.width) {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL);
      } else {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
      }
      images.push(new ImageDTO(img.cloudinaryId, url, img.width, img.height, img.title));
    });
    return images;
  }

  public fillPopupImageList(response: any): ImageDTO[] {
    const images: ImageDTO[] = [];
    response.imgList.forEach((img: any) => {
      let url: string;
      if (img.height <= 900 && img.width <= 1200) {
        url = img.url;
      } else if (img.height >= img.width) {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL_POPUP);
      } else {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL_POPUP);
      }
      images.push(new ImageDTO(img.cloudinaryId, url, img.width, img.height, img.title));
    });
    return images;
  }

  public addFavoriteAd(id: number): Observable<any> {
    return this.http.post(BASE_URL + 'favorite-add/' + id, { responseType: "text" });
  }
}
