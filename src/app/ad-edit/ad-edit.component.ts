import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { CreateAd } from '../common/create-ad.object';
import { CreateAdValidation } from '../common/create-ad.validation';
import { CreateAdSet } from '../common/CreateAdSet';
import { PhoneDTO } from '../common/PhoneDTO';
import { AdEditService } from '../_services/ad/ad-edit.service';

@Component({
  selector: 'app-ad-edit',
  templateUrl: './ad-edit.component.html',
  styleUrls: ['./ad-edit.component.scss']
})
export class AdEditComponent implements OnInit {
  id: number | undefined;
  createAdSet: CreateAdSet = new CreateAdSet();
  ad: CreateAd = new CreateAd();
  phoneList: PhoneDTO[] = [];
  adValidation: CreateAdValidation = new CreateAdValidation();
  checked: boolean = false;
  process: boolean = false;
  errorMessage: string | undefined;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private adEditService: AdEditService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["id"];
    if (!this.id) {
      window.location.href = 'ad-list';
    }

    this.adEditService.getCreateAdSet()
      .then((createAdSet: CreateAdSet) => {
        this.createAdSet = createAdSet;
        this.phoneList = this.adEditService.initPhoneList(this.createAdSet.availableCommunications!);
      })
      .then(() => {
        this.adEditService.getAd(this.id!)
          .then(ad => {
            const originAd = ad;
            this.adEditService.initEditableAd(this.id!, this.ad, originAd);
            this.adEditService.initUsageCommunications(this.phoneList, originAd);
          });
      });
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
      this.adEditService.setTitleImg(this.ad.imgList, index);
    }
  }

  public filesDropped(target: EventTarget) {
    const filesDropped = (target as HTMLInputElement).files!;
    this.adEditService.filesDropped(filesDropped, this.ad.imgList);
  }

  public deleteImg(index: number) {
    if (!this.process) {
      this.adEditService.deleteImg(this.ad.imgList, index);
    }
  }

  public onKeyBody() {
    if (this.checked) {
      this.adEditService.checkBody(this.ad, this.adValidation);
    }
  }

  public onKeyPrice() {
    this.ad.price = this.adEditService.getValidPrice(this.ad.price!);
  }

  public onKeyTitle() {
    if (this.checked) {
      this.adEditService.checkTitle(this.ad, this.adValidation);
    }
  }

  public onKeyDeliveryDescription() {
    if (this.checked) {
      this.adEditService.checkDeliveryDescription(this.ad, this.adValidation);
    }
  }

  public toggleUsePhone(index: number) {
    if (!this.process) {
      this.phoneList![index].use = !this.phoneList![index].use;
      this.phoneList[index].useViber = this.phoneList![index].use;
      if (this.checked) {
        this.adEditService.checkCommunication(this.phoneList, this.adValidation);
      }
    }
  }

  public toggleUseViber(index: number) {
    if (!this.process && this.phoneList[index].use) {
      this.phoneList[index].useViber = !this.phoneList[index].useViber;
    }
  }

  public async updateAd() {
    this.process = true;
    if (this.adEditService.validUpdateAd(this.ad, this.phoneList, this.adValidation)) {
      await this.adEditService.prepareUpdatedAd(this.ad, this.phoneList);
      this.adEditService.updateAd(this.ad).subscribe(
        () => {
          window.location.href = '/ad?id=' + this.id;
        },
        err => {
          this.process = false;
          this.errorMessage = err.error? err.error : "Server error.";
          window.scrollTo(0, 0);
        }
      );
    } else {
      this.checked = true;
      this.process = false;
      this.errorMessage = "Пожалуйста, проверьте правильность заполнения формы.";
      window.scrollTo(0, 0);
    }
  }

}
