import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Communication } from 'src/app/common/Communication';
import { CreateAd } from 'src/app/common/ad/NewAd';
import { CreateAdValidation } from 'src/app/common/validation-models/create-ad.validation';
import { CreateAdSet } from 'src/app/common/ad/CreateAdSet';
import { Image } from 'src/app/common/Image';
import { PhoneDTO } from 'src/app/common/PhoneDTO';
import { environment } from 'src/environments/environment';

/*   API   */
const BASE_URL = environment.url;
const GET_AD_SET_API = BASE_URL + 'get-ad-set';
const UPLOAD_IMG_API = BASE_URL + 'uploadimg';
const DELETE_IMG_API = BASE_URL + 'deleteimg/';
const CREATE_AD_API = BASE_URL + 'create-ad';

/*   Image params   */
const CLOUDINARY_PARAMS = "w_145,h_145,c_fill";
const MAX_IMG_SIZE = 10000000;

@Injectable({
  providedIn: 'root'
})

export class CreateAdService {

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  /*   Image Service   */

  public async filesDropped(filesDropped: FileList, uploadedImg: Image[]) {

    const currentSize = uploadedImg.length;
    this.inituploadedImg(uploadedImg, filesDropped);

    for (let i = currentSize; i < uploadedImg.length; i++) {
      await this.loadImgApi(uploadedImg[i].file!).toPromise().then(
        (data: any) => {
          if (i < uploadedImg.length) {
            uploadedImg[i].localUrl = data.secure_url.replace(data.secure_url.split('/')[6], CLOUDINARY_PARAMS);
            const img = document.getElementById('img-' + i);
            img!.onload = function () {
              if (i == 0) {
                uploadedImg[i].title = true;
              }
              uploadedImg[i].file = undefined;
              uploadedImg[i].cloudinaryId = data.public_id;
              uploadedImg[i].cloudinaryUrl = data.url;
              uploadedImg[i].width = data.width;
              uploadedImg[i].height = data.height;
            };
          }
        },
        error => {
          if (i < uploadedImg.length) {
            this.imgLoadHasProblem();
            console.error(error);
            uploadedImg = uploadedImg.splice(i, 1);
            i--;
          }
        }
      );
    }
  }

  public deleteImg(uploadedImg: Image[], index: number) {
    if (!this.isAllImgLoaded(uploadedImg)) {
      alert("Необходимо дождаться загрузки всех изображений");
      return;
    }

    const isTitleRemove: boolean = uploadedImg[index].title!;
    if (uploadedImg[index].cloudinaryId !== undefined) {
      this.deleteImgApi(uploadedImg[index].cloudinaryId!);
    }
    uploadedImg = uploadedImg.splice(index, 1);
    if (uploadedImg.length && isTitleRemove) {
      $('#img-0').trigger('click'); // cause: *ngIf don't refreshed
    }
  }

  public setTitleImg(uploadedImg: Image[], index: number) {
    if (index >= uploadedImg.length
      || uploadedImg[index].cloudinaryId == undefined) {
      return;
    }

    for (let i = 0; i < uploadedImg.length; i++) {
      if (i == index) {
        uploadedImg[i].title = true;
      } else {
        uploadedImg[i].title = false;
      }
    }
  }

  private inituploadedImg(uploadedImg: Image[], filesDropped: FileList) {
    for (let i = 0; i < filesDropped.length; i++) {
      const file: File = filesDropped.item(i)!;
      if (this.checkAddImg(uploadedImg, file)) {
        const image = new Image();
        image.file = file;
        image.localUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        uploadedImg.push(image);
      } else {
        this.imgLoadHasProblem();
      }
    }
  }

  private checkAddImg(uploadedImg: Image[], file: File): boolean {
    return (uploadedImg.length >= 8 || file.size > MAX_IMG_SIZE) ? false : true;
  }

  /*   Validation Service   */

  public validNewAd(ad: CreateAd, phoneList: PhoneDTO[], adValidation: CreateAdValidation): boolean {
    this.checkTitle(ad, adValidation);
    this.checkBody(ad, adValidation);
    this.checkCommunication(phoneList, adValidation);
    this.checkDeliveryDescription(ad, adValidation);
    for (const [, value] of Object.entries(adValidation)) {
      if (!value) {
        return false;
      }
    }

    return true;
  }

  public checkTitle(ad: CreateAd, adValidation: CreateAdValidation) {
    adValidation.title = ad.title.trim().length < 3 || ad.title.length > 64 ? false : true;
  }

  public checkBody(ad: CreateAd, adValidation: CreateAdValidation) {
    adValidation.body = ad.body.trim().length < 20 || ad.body.length > 2000 ? false : true;
  }

  public checkCommunication(phoneList: PhoneDTO[], adValidation: CreateAdValidation) {
    adValidation.communication = phoneList
      .find(phone => phone.use == true) ? true : false;
  }

  public checkDeliveryDescription(ad: CreateAd, adValidation: CreateAdValidation) {
    if (!ad.delivery || !ad.deliveryDescription) {
      adValidation.deliveryDescription = true;
      return;
    }

    adValidation.deliveryDescription =
      ad.deliveryDescription.trim().length > 1000 ? false : true;
  }

  public getValidPrice(price: string): string {

    if (!price || !price.length) {
      return '';
    }

    let isDouble = false;

    if (price.includes(',') || price.includes('.')) {
      price = price.replace(',', '.');
      price = price.substring(0, price.indexOf('.') + 3);
    }

    for (let i = 0; i < price.length; i++) {
      const temp = price.charCodeAt(i);
      if (temp == 46 && !isDouble) {
        isDouble = true;
        continue;
      }
      if (temp < 48 || temp > 57) {
        price = price.replace(price[i], "");
        i--;
      }
    }

    if (Number(price) >= 10000) {
      return '9999.99';
    }

    return price;
  }

  /*   Prepare data   */

  public initCreateAd(createAdSet: CreateAdSet): CreateAd {
    const createAd = new CreateAd();
    createAd.category = createAdSet.categories![0].id;
    createAd.priceType = createAdSet.priceTypes![0];
    return createAd;
  }

  public async prepareCreateAd(ad: CreateAd, phoneList: PhoneDTO[]) {
    await this.waitImgLoad(ad);
    ad.communicationList = this.mapCommunicationList(phoneList);
  }

  /*   API-methods   */

  public createAd(newAd: CreateAd) {
    return this.http.post<CreateAd>(CREATE_AD_API, newAd);
  }

  public getCreateAdSet(): Promise<CreateAdSet> {
    return new Promise(resolve => {
      this.http.get<CreateAdSet>(GET_AD_SET_API).subscribe(data => {
        resolve(data);
      });
    });
  }

  private loadImgApi(img: File) {
    const formData = new FormData();
    formData.append('file', img);
    return this.http.post<File>(UPLOAD_IMG_API, formData);
  }

  public deleteImgApi(id: string) {
    this.http.delete(DELETE_IMG_API + id).subscribe(() => { });
  }

  /*   Util   */

  public initPhoneList(commList: Communication[]): PhoneDTO[] {

    const phoneList: PhoneDTO[] = [];
    commList.filter(comm => comm.communication === 'PHONE').map(comm => {
      const phone: PhoneDTO = new PhoneDTO();
      phone.id = comm.id;
      phone.phone = comm.value;
      phone.use = true;
      phoneList.push(phone);
    });

    commList.forEach(comm => {
      if (comm.communication == 'VIBER') {
        phoneList.every(phone => {
          if (phone.phone == comm.value) {
            phone.idViber = comm.id;
            phone.useViber = true;
          }
          return true;
        });
      }
    });

    return phoneList;
  }

  private mapCommunicationList(phoneList: PhoneDTO[]): number[] {
    const communicationList: number[] = [];
    phoneList.forEach(phone => {
      if (phone.use) {
        communicationList.push(phone.id!);
      }
      if (phone.useViber) {
        communicationList.push(phone.idViber!);
      }
    });
    return communicationList;
  }

  private waitImgLoad(ad: CreateAd): Promise<void> {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.isAllImgLoaded(ad.imgList)) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  public isAllImgLoaded(uploadedImg: Image[]): boolean {
    return !uploadedImg.filter(img => img.cloudinaryId === undefined).length;
  }

  private imgLoadHasProblem() {
    $('#problemImgLoad').removeAttr('hidden');
  }
}
