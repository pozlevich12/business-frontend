import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CreateAd } from '../common/create-ad.object';
import { CreateAdValidation } from '../common/create-ad.validation';
import { CreateAdService } from '../_services/create-ad/create-ad.service';
import { PhoneDTO } from '../common/PhoneDTO';
import { CreateAdSet } from '../common/CreateAdSet';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  createAdSet: CreateAdSet = new CreateAdSet();
  ad: CreateAd = new CreateAd();
  phoneList: PhoneDTO[] = [];
  adValidation: CreateAdValidation = new CreateAdValidation();
  checked: boolean = false;
  process: boolean = false;
  errorMessage: string | undefined;

  constructor(public appComponent: AppComponent, private createAdService: CreateAdService) {
  }

  ngOnInit() {
    if (!this.appComponent.tokenStorageService.getToken()) {
      this.appComponent.router.navigate(['login'], { queryParams: { returnUrl: "/create-ad" } });
    } else {
      this.createAdService.getCreateAdSet().subscribe(
        data => {
          this.createAdSet = data;
          this.phoneList = this.createAdService.initPhoneList(this.createAdSet.availableCommunications!);
          this.ad.category = this.createAdSet.categories![0].id;
          this.ad.priceType = this.createAdSet.priceTypes![0];
          this.ad.region = this.createAdSet.locations![0].id;
          this.updateSubCategories();
          this.updateLocation();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public updateLocation() {
    const index = this.createAdSet.locations
      ?.map(locationObject => locationObject.id).indexOf(this.ad.region);
    this.ad.town = this.createAdSet.locations![index!].locationList![0].id;
  }

  public updateSubCategories() {
    const index = this.createAdSet.categories
      ?.map(categoryObject => categoryObject.id).indexOf(this.ad.category!);
    this.ad.subCategory = this.createAdSet.categories![index!].subCategoryList[0]?.id;
  }

  public setTitleImage(index: number) {
    if (!this.process) {
      this.createAdService.setTitleImg(this.ad.imgList, index);
    }
  }

  public filesDropped(target: EventTarget) {
    const filesDropped = (target as HTMLInputElement).files!;
    this.createAdService.filesDropped(filesDropped, this.ad.imgList);
  }

  public deleteImg(index: number) {
    if (!this.process) {
      this.createAdService.deleteImg(this.ad.imgList, index);
    }
  }

  public onKeyBody() {
    if (this.checked) {
      this.createAdService.checkBody(this.ad, this.adValidation);
    }
  }

  public onKeyPrice() {
    this.ad.price = this.createAdService.getValidPrice(this.ad.price!);
  }

  public onKeyTitle() {
    if (this.checked) {
      this.createAdService.checkTitle(this.ad, this.adValidation);
    }
  }

  public onKeyDeliveryDescription() {
    if (this.checked) {
      this.createAdService.checkDeliveryDescription(this.ad, this.adValidation);
    }
  }

  public toggleUsePhone(index: number) {
    if (!this.process) {
      this.phoneList![index].use = !this.phoneList![index].use;
      this.phoneList[index].useViber = this.phoneList![index].use;
      if (this.checked) {
        this.createAdService.checkCommunication(this.phoneList, this.adValidation);
      }
    }
  }

  public toggleUseViber(index: number) {
    if (!this.process && this.phoneList[index].use) {
      this.phoneList[index].useViber = !this.phoneList[index].useViber;
    }
  }

  public async createAd() {
    this.process = true;
    if (this.createAdService.validNewAd(this.ad, this.phoneList, this.adValidation)) {
      await this.createAdService.prepareCreateAd(this.ad, this.phoneList);
      this.createAdService.createAd(this.ad).subscribe(
        (id: any) => {
          window.location.href = '/ad?id=' + id;
        },
        err => {
          this.process = false;
          this.errorMessage = err.error?.message ? err.error.message : "Server error.";
          window.scrollTo(0, 0);
        }
      );
    } else {
      this.checked = true;
      this.process = false;
      this.errorMessage = "Пожалуйста, проверьте правильность заполнения формы.";
      window.scrollTo(0, 0);
    }
  };
}
