import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from 'src/app/common/Image';
import { User } from 'src/app/common/User';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../token-storage.service';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS_FOR_96_96 = "w_96,h_96,c_fill";
const CLOUDINARY_PARAMS_FOR_HORIZONTAL = "w_600,h_400,c_fill";
const CLOUDINARY_PARAMS_FOR_VERTICAL = "h_400,c_scale";
const CLOUDINARY_PARAMS_FOR_VERTICAL_POPUP = "h_900";
const CLOUDINARY_PARAMS_FOR_HORIZONTAL_POPUP = "w_1200";

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient, private localStorageService: TokenStorageService) { }

  public getAd(id: number): Observable<any> {
    return this.http.get(BASE_URL + 'public/view-ad/' + id, { responseType: 'text' });
  }

  public fillImageList(response: any): Image[] {
    const images: Image[] = [];
    response.imgList.forEach((img: any) => {
      let url: string;
      if (img.height >= img.width) {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL);
      } else {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
      }
      const smallUrl = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_96_96);
      images.push(this.getImageObject(img.cloudinaryId, url, smallUrl, img.width, img.height, img.title));
    });
    return images;
  }

  public fillPopupImageList(response: any): Image[] {
    const images: Image[] = [];
    response.imgList.forEach((img: any) => {
      let url: string;
      if (img.height <= 900 && img.width <= 1200) {
        url = img.url;
      } else if (img.height >= img.width) {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL_POPUP);
      } else {
        url = img.url.replace(img.url.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL_POPUP);
      }
      images.push(this.getImageObject(img.cloudinaryId, url, "", img.width, img.height, img.title));
    });
    return images;
  }

  public toggleFavorite(user: User, id: number) {
    const index = user.favoriteAdList.indexOf(id);
    if (index != -1) {
      this.deleteFavoriteAd(id).subscribe(() => {
        user.favoriteAdList.splice(index, 1);
        this.localStorageService.saveUser(user);
      });
    } else {
      this.addFavoriteAd(id).subscribe(() => {
        user.favoriteAdList.push(id);
        this.localStorageService.saveUser(user);
      });
    }
  }

  public addFavoriteAd(id: number): Observable<any> {
    return this.http.get(BASE_URL + 'favorite-add/' + id, { responseType: "text" });
  }

  public deleteFavoriteAd(id: number): Observable<any> {
    return this.http.get(BASE_URL + 'favorite-delete/' + id, { responseType: "text" });
  }

  private getImageObject(cloudinaryId: string, cloudinaryUrl: string, smallUrl: string, width: number, height: number, title: boolean): Image {
    const image = new Image();
    image.cloudinaryId = cloudinaryId;
    image.cloudinaryUrl = cloudinaryUrl;
    image.smallUrl = smallUrl;
    image.width = width;
    image.height = height;
    image.title = title;
    return image;
  }
}
