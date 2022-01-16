import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { CreateAd } from '../common/create-ad.object';
import { CreateAdValidation } from '../common/create-ad.validation';
import { LocationObject } from '../common/locations.object';
import { SubCategoryObject } from '../common/subcategory.object';
import { Town } from '../common/town.object';
import { CreateAdService } from '../_services/create-ad/create-ad.service';
import { SessionStorageService } from '../_services/session-storage.service';
import * as $ from 'jquery';
import { ImageList } from '../common/ImageList.object';
import { ImageDTO } from '../common/ImageDTO.object';
import { PhoneDTO } from '../common/PhoneDTO';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  adValidation: CreateAdValidation = new CreateAdValidation();
  isCreateFailed: boolean = false;
  errorMessage: string | undefined;
  checked: boolean = false;


  uploadedFiles: ImageList = new ImageList();

  delivery: boolean = false;
  delivaryDescription: string = "";

  title: string = "";
  body: string = "";

  categories: CategoriesObject[] = [];
  subCategories: SubCategoryObject[] = [];
  category: number = 0;
  subCategory: number = 0;

  price: string = "";
  subPrice: string = "";
  priceType: string = "руб/кг";

  locations: LocationObject[] = [];
  townList: Town[] = [];
  region: string = "";
  town: number = 0;

  phoneList: PhoneDTO[] = [];

  constructor(public appComponent: AppComponent, private createAdService: CreateAdService, private sessionStorage: SessionStorageService) {
    this.appComponent.components = [false, true];
  }

  ngOnInit() {
    if (!this.appComponent.tokenStorageService.getToken()) {
      this.appComponent.router.navigate(['login'], { queryParams: { returnUrl: "/create-ad" } });
    } else {

      let categories;
      const intervalInitCategories = setInterval(() => {
        categories = this.sessionStorage.getCategories();
        if (categories) {
          this.categories = JSON.parse(categories);
          this.category = this.categories[0].categoryId;
          this.subCategories = this.categories[0].subCategories!;
          this.subCategory = this.subCategories[0].subCategoryId;
          clearInterval(intervalInitCategories);
        }
      }, 250);

      let locations;
      const intervalInitLocations = setInterval(() => {
        locations = this.sessionStorage.getLocations();
        if (locations) {
          this.locations = JSON.parse(locations);
          this.region = this.locations[0].region;
          this.townList = this.locations[0].townList!;
          this.town = this.townList[0].id;
          clearInterval(intervalInitLocations);
        }
      }, 250);

      this.createAdService.fillPhoneNumbersDTO(this.phoneList);
    }
  }

  public updateLocation() {
    const index = this.locations.map(e => e.region).indexOf(this.region);
    this.townList = this.locations[index].townList!;
    this.town = this.townList[0].id;
  }

  public updateSubCategories() {
    const index = this.categories.map(e => e.categoryId).indexOf(this.category);
    this.subCategories = this.categories[index].subCategories!;
    if (this.subCategories.length == 0) {
      return;
    }
    this.subCategory = this.subCategories[0].subCategoryId;
  }

  public setTitleImage(index: number) {
    this.createAdService.setTitleImg(this.uploadedFiles, index);
  }

  public filesDropped(target: EventTarget) {
    const filesDropped = (target as HTMLInputElement).files!;
    this.createAdService.filesDropped(filesDropped, this.uploadedFiles);
  }

  public deleteImg(index: number) {
    this.createAdService.deleteImg(this.uploadedFiles, index);
  }

  public onKeyBody() {
    if (this.checked) {
      this.adValidation.body = this.createAdService.checkBody(this.body);
    }
  }

  public onKeySubPrice() {
    this.subPrice = this.createAdService.checkSubPrice(this.subPrice);
  }

  public onKeyPrice() {
    this.price = this.createAdService.checkPrice(this.price);
  }

  public onKeyTitle() {
    if (this.checked) {
      this.adValidation.title = this.createAdService.checkTitle(this.title);
    }
  }

  public onKeyDeliveryDescription() {
    if (this.checked) {
      this.adValidation.deliveryDescription = this.createAdService.checkDeliveryDescription(this.delivaryDescription, this.delivery);
    }
  }

  public toggleUsePhone() {
    this.phoneList[0].use = !this.phoneList[0].use;
    $("#phoneNumber").prop('readonly', this.phoneList[0].use);
    $("#phoneNumber").prop('disabled', !this.phoneList[0].use);
  }

  public toggleDeliveryDescr() {
    this.delivery = !this.delivery;
    $("#deliveryCheckbox").prop('checked', this.delivery);
  }

  private updateAdValidation() {
    this.adValidation.title = this.createAdService.checkTitle(this.title);
    this.adValidation.body = this.createAdService.checkBody(this.body);
    this.adValidation.deliveryDescription = this.createAdService.checkDeliveryDescription(this.delivaryDescription, this.delivery);
  }

  private getNewAdObject(): CreateAd {
    const imgList: ImageDTO[] = [];
    this.uploadedFiles.images.forEach(image => {
      const title: boolean = this.uploadedFiles.titleImg === this.uploadedFiles.images.indexOf(image);
      imgList.push(new ImageDTO(image.id!, image.url!, title));
    });
    const phoneList: string[] = [];
    this.phoneList.forEach(phone => {
      if (phone.use) {
        phoneList.push(phone.phone!);
      }
    })
    return new CreateAd(this.title, this.body, this.category, this.subCategory, this.town,
      Number(this.price + '.' + this.subPrice), this.priceType, imgList, phoneList, this.delivery, this.delivaryDescription);
  }

  private setProcessingInDom(processing: boolean) {
    if (processing) {
      document.getElementById("btn_submit")?.setAttribute('disabled', 'true');
      document.getElementById("spinner_btn")?.removeAttribute('hidden');
    } else {
      document.getElementById("btn_submit")?.removeAttribute('disabled');
      document.getElementById("spinner_btn")?.setAttribute('hidden', 'true');
    }
  }

  public checkForm(): void {
    this.setProcessingInDom(true);
    const loadingImgProcess = setInterval(() => {
      if (!this.uploadedFiles.loadingProcess) {
        clearInterval(loadingImgProcess);
        this.isCreateFailed = false;
        this.updateAdValidation();
        const newAd = this.getNewAdObject();
        if (this.createAdService.validNewAd(newAd)) {
          this.createAdService.createAd(newAd).subscribe(
            (data: any) => {
              console.log(data);
              this.setProcessingInDom(false);
              window.scrollTo(0, 0);
            },
            err => {
              this.setProcessingInDom(false);
              this.isCreateFailed = true;
              this.errorMessage = err.error.message;
              window.scrollTo(0, 0);
            }
          );
        } else {
          this.checked = true;
          this.setProcessingInDom(false);
          window.scrollTo(0, 0);
        }
      }
    }, 250);
  }
}
