import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from 'src/app/common/Image';
import { User } from 'src/app/common/User';
import { Ad } from 'src/app/common/Ad';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token-storage.service';

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

  public getAd(id: number): Observable<Ad> {
    return this.http.get<Ad>(BASE_URL + 'public/view-ad/' + id);
  }

  public fillImageList(imgList: Image[]): Image[] {
    const images: Image[] = [];
    imgList.forEach((img: any) => {
      let url: string;
      if (img.height >= img.width) {
        url = img.cloudinaryUrl.replace(img.cloudinaryUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL);
      } else {
        url = img.cloudinaryUrl.replace(img.cloudinaryUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL);
      }
      const smallUrl = img.cloudinaryUrl.replace(img.cloudinaryUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_96_96);
      images.push(this.getImageObject(img.id, img.cloudinaryId, url, smallUrl, img.width, img.height, img.title));
    });

    this.swapTitleImg(images);
    return images;
  }

  public fillPopupImageList(imgList: any): Image[] {
    const images: Image[] = [];
    imgList.forEach((img: any) => {
      let url: string;
      if (img.height <= 900 && img.width <= 1200) {
        url = img.cloudinaryUrl;
      } else if (img.height >= img.width) {
        url = img.cloudinaryUrl.replace(img.cloudinaryUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_VERTICAL_POPUP);
      } else {
        url = img.cloudinaryUrl.replace(img.cloudinaryUrl.split('/')[6], CLOUDINARY_PARAMS_FOR_HORIZONTAL_POPUP);
      }
      images.push(this.getImageObject(img.id, img.cloudinaryId, url, "", img.width, img.height, img.title));
    });
    return images;
  }

  public toggleFavorite(user: User, id: number) {
    if (!user) {
      this.addFavoriteAd(id).subscribe(() => { });
      //  redirect to login page if unauthorized
      return;
    }
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

  private getImageObject(id: number, cloudinaryId: string, cloudinaryUrl: string, smallUrl: string, width: number, height: number, title: boolean): Image {
    const image = new Image();
    image.id = id;
    image.cloudinaryId = cloudinaryId;
    image.cloudinaryUrl = cloudinaryUrl;
    image.smallUrl = smallUrl;
    image.width = width;
    image.height = height;
    image.title = title;
    return image;
  }

  private swapTitleImg(images: Image[]) {
    const titleIndex = images.findIndex(img => img.title);
    if (titleIndex != -1 && titleIndex != 0) {
      [images[0], images[titleIndex]] = [images[titleIndex], images[0]];
    }
  }
}