import { Injectable } from '@angular/core';
import { Communication } from 'src/app/common/Communication';
import { CreateAd } from 'src/app/common/ad/NewAd';
import { CreateAdSet } from 'src/app/common/ad/CreateAdSet';
import { PhoneDTO } from 'src/app/common/PhoneDTO';
import { Image } from 'src/app/common/Image';
import { AdService } from '../ad/ad.service';
import { CreateAdService } from './create-ad.service';
import { CreateAdValidation } from 'src/app/common/validation-models/create-ad.validation';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ad } from 'src/app/common/ad/Ad';

/*  API  */
const BASE_URL = environment.url;
const UPDATE_AD_API = BASE_URL + 'update-ad';

/*   Image params   */
const CLOUDINARY_PARAMS = "w_145,h_145,c_fill";

@Injectable({
  providedIn: 'root'
})
export class AdEditService {

  constructor(private createAdService: CreateAdService, private adService: AdService, private http: HttpClient) { }

  /*  Init data  */

  public initPhoneList(commList: Communication[]): PhoneDTO[] {
    return this.createAdService.initPhoneList(commList);
  }

  public initEditableAd(ad: CreateAd, originAd: Ad) {
    ad.id = originAd.id;
    ad.imgList = this.initImageList(originAd);
    ad.title = originAd.title;
    ad.category = originAd.category.id;
    ad.subCategory = originAd.category.subCategoryId;
    ad.price = originAd.price.toString();
    ad.priceType = originAd.priceType;
    ad.body = originAd.body;
    ad.delivery = originAd.delivery;
    ad.deliveryDescription = originAd.deliveryDescription;
  }

  public initImageList(ad: Ad): Image[] {
    const imageList: Image[] = [];
    Array.from(ad.imgList).forEach((img: any) => {
      const image: Image = new Image();
      image.id = img.id;
      image.localUrl = img.cloudinaryUrl.replace(img.cloudinaryUrl.split('/')[6], CLOUDINARY_PARAMS);
      image.cloudinaryId = img.cloudinaryId;
      image.cloudinaryUrl = img.url;
      image.width = img.width;
      image.height = img.height;
      image.title = img.title;
      imageList.push(image);
    });
    return imageList;
  }

  public initUsageLocations(ad: Ad) {

  }

  public initUsageCommunications(communicationList: PhoneDTO[], adId: number) {
    this.adService.getCommunications(adId).subscribe(communications => {
      communicationList.forEach(communication => {
        communication.use = false;
        communication.useViber = false;
        communications
          .filter(comm => comm.value == communication.phone)
          .forEach(comm => {
            if (comm.communication == 'PHONE') {
              communication.use = true;
            }
            if (comm.communication == 'VIBER') {
              communication.useViber = true;
            }
          });
      });
    });
  }

  /*  Image Service  */

  public filesDropped(filesDropped: FileList, uploadedImg: Image[]) {
    this.createAdService.filesDropped(filesDropped, uploadedImg);
  }

  public setTitleImg(uploadedImg: Image[], index: number) {
    this.createAdService.setTitleImg(uploadedImg, index);
  }

  public deleteImg(uploadedImg: Image[], index: number) {
    if (!this.createAdService.isAllImgLoaded(uploadedImg)) {
      alert("Необходимо дождаться загрузки всех изображений");
      return;
    }

    const isTitleRemove: boolean = uploadedImg[index].title!;
    if (uploadedImg[index].id == undefined && uploadedImg[index].cloudinaryId !== undefined) {
      this.createAdService.deleteImgApi(uploadedImg[index].cloudinaryId!);
    }
    uploadedImg = uploadedImg.splice(index, 1);
    if (uploadedImg.length && isTitleRemove) {
      $('#img-0').trigger('click'); // cause: *ngIf don't refreshed
    }
  }

  /*  Prepare data  */

  public async prepareUpdatedAd(ad: CreateAd, phoneList: PhoneDTO[]) {
    await this.createAdService.prepareCreateAd(ad, phoneList);
  }

  /*  Validation  */

  public checkBody(ad: CreateAd, adValidation: CreateAdValidation) {
    this.createAdService.checkBody(ad, adValidation);
  }

  public getValidPrice(price: string): string {
    return this.createAdService.getValidPrice(price);
  }

  public checkTitle(ad: CreateAd, adValidation: CreateAdValidation) {
    this.createAdService.checkTitle(ad, adValidation);
  }

  public checkDeliveryDescription(ad: CreateAd, adValidation: CreateAdValidation) {
    this.createAdService.checkDeliveryDescription(ad, adValidation);
  }

  public checkCommunication(phoneList: PhoneDTO[], adValidation: CreateAdValidation) {
    this.createAdService.checkCommunication(phoneList, adValidation);
  }

  public validUpdateAd(ad: CreateAd, phoneList: PhoneDTO[], adValidation: CreateAdValidation): boolean {
    return this.createAdService.validNewAd(ad, phoneList, adValidation);
  }

  /*  API  */

  public updateAd(updatedAd: CreateAd) {
    return this.http.post<CreateAd>(UPDATE_AD_API, updatedAd);
  }

  public getCreateAdSet(): Promise<CreateAdSet> {
    return this.createAdService.getCreateAdSet();
  }

  public getAd(id: number): Promise<any> {
    return new Promise(resolve => {
      this.adService.getAd(id).subscribe(data => {
        resolve(data);
      })
    });
  }
}
