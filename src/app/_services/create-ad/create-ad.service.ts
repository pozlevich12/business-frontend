import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateAd } from 'src/app/common/create-ad.object';
import { FileHandle } from 'src/app/common/FileHandle.object';
import { ImageList } from 'src/app/common/ImageList.object';
import { PhoneDTO } from 'src/app/common/PhoneDTO';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../token-storage.service';

const BASE_URL = environment.url;
const CLOUDINARY_PARAMS = "w_145,h_145,c_fill";
const MAX_IMG_SIZE = 10000000;

@Injectable({
  providedIn: 'root'
})

export class CreateAdService {

  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  public async filesDropped(filesDropped: FileList, uploadedFiles: ImageList) {

    uploadedFiles.loadingProcess = true;
    const currentSize = uploadedFiles.images.length;
    this.initUploadedFiles(uploadedFiles, filesDropped);

    for (let i = currentSize; i < uploadedFiles.images.length; i++) {
      await this.loadImgApi(uploadedFiles.images[i].file!).toPromise().then(
        (data: any) => {
          uploadedFiles.images[i].localUrl = data.secure_url.replace(data.secure_url.split('/')[6], CLOUDINARY_PARAMS);
          const img = document.getElementById('img-' + i);
          img!.onload = function() { 
            uploadedFiles.images[i].id = data.public_id;
            uploadedFiles.images[i].url = data.url;
            uploadedFiles.images[i].width = data.width;
            uploadedFiles.images[i].height = data.height;
            if(i == uploadedFiles.images.length - 1) {
              uploadedFiles.loadingProcess = false;
            }
          };
        },
        error => {
          uploadedFiles.hasUploadError = true;
          console.error(error);
          this.deleteImg(uploadedFiles, i);
          i--;
        }
      );
    }
  }

  private initUploadedFiles(uploadedFiles: ImageList, filesDropped: FileList) {
    for (let i = 0; i < filesDropped.length; i++) {
      if (this.checkAddImg(uploadedFiles, filesDropped.item(i)!)) {
        const fileHandle = new FileHandle();
        fileHandle.file = filesDropped.item(i)!;
        fileHandle.localUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(filesDropped!.item(i)!));
        uploadedFiles.images.push(fileHandle);
      } else {
        uploadedFiles.hasUploadError = true;
      }
    }
  }

  private checkAddImg(uploadedFiles: ImageList, file: File): boolean {
    return (uploadedFiles.images.length >= 8 || file.size > MAX_IMG_SIZE) ? false : true;
  }

  public deleteImg(uploadedFiles: ImageList, index: number) {
    if (uploadedFiles.images[index].id !== undefined) {
      this.deleteImgApi(uploadedFiles.images[index].id!);
    }
    if (index == uploadedFiles.titleImg) {
      uploadedFiles.titleImg = 0;
    } else if (index < uploadedFiles.titleImg) {
      uploadedFiles.titleImg--;
    }
    uploadedFiles.images = uploadedFiles.images.filter(file => file !== uploadedFiles.images[index]);
  }

  public fillPhoneNumbersDTO(phoneList: PhoneDTO[]) {
    const phone = this.tokenStorageService.getUser()!.phoneNumbers[0];
    phoneList.push(new PhoneDTO(
      phone.substring(0, 4) + ' (' + phone.substring(4, 6) + ') ' + phone.substring(6, 9) + '-' + phone.substring(9, 11) + '-' + phone.substring(11, 13)));
  }

  public setTitleImg(uploadedFiles: ImageList, index: number) {
    if (uploadedFiles.images[index].id) {
      uploadedFiles.titleImg = index;
    }
  }

  public checkTitle(title: string): boolean {
    return (title.trim().length < 3 || title.length > 64) ? false : true;
  }

  public checkDeliveryDescription(description: string, delivery: boolean): boolean {
    if (delivery && description.trim().length > 1000) {
      return false;
    }
    return true;
  }

  public checkPrice(price: string): string {
    return this.getValidPrice(price, 4);
  }

  public checkSubPrice(subPrice: string): string {
    return this.getValidPrice(subPrice, 2);
  }

  public checkBody(body: string): boolean {
    return (body.trim().length < 20 || body.length > 2000) ? false : true;
  }

  private getValidPrice(price: string, size: number): string {
    for (let i = 0; i < price.length; i++) {
      const temp = price.charCodeAt(i);
      if (temp < 48 || temp > 57) {
        price = price.replace(price[i], "");
        i--;
      }
    }

    for (let i = 0; i < price.length; i++) {
      if (price.charCodeAt(i) == 48) {
        price = price.replace(price[i], "");
        i--;
      } else {
        break;
      }
    }

    if (price.length > size) {
      return price.substring(0, size);
    }

    return price;
  }

  private loadImgApi(img: File) {
    const formData = new FormData();
    formData.append('file', img);
    return this.http.post<File>(BASE_URL + 'uploadimg', formData);
  }

  private deleteImgApi(id: string) {
    this.http.delete(BASE_URL + 'deleteimg/' + id).subscribe(
      data => {
        console.log('Image with id = ' + id + ' deleted successfully.');
      },
      error => {
        console.error('Error when deleting a picture from id = ' + id + '. Error: ' + error);
      }
    );
  }

  public validNewAd(newAd: CreateAd): boolean {
    if (!this.checkTitle(newAd.title)) {
      return false;
    }
    if (!this.checkBody(newAd.body)) {
      return false;
    }
    if (!this.checkDeliveryDescription(newAd.deliveryDescription, newAd.delivery)) {
      return false;
    }
    return true;
  }

  public createAd(newAd: CreateAd) {
    return this.http.post<CreateAd>(BASE_URL + 'create-ad', newAd);
  }

  public checkTokenExpire() {
    return this.http.get(BASE_URL + 'check-token-expired');
  }
}
