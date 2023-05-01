import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { CreateAd } from '../common/ad/NewAd';
import { CreateAdValidation } from '../common/validation-models/create-ad.validation';
import { CreateAdSet } from '../common/ad/CreateAdSet';
import { Region } from '../common/location/Region';
import { Location } from '../common/location/Location';
import { PhoneDTO } from '../common/PhoneDTO';
import { AdEditService } from '../_services/ad/ad-edit.service';
import { Ad } from '../common/ad/Ad';
import { LocationService } from '../_services/location.service';

@Component({
  selector: 'app-ad-edit',
  templateUrl: './ad-edit.component.html',
  styleUrls: ['./ad-edit.component.scss']
})
export class AdEditComponent implements OnInit {
  id: number | undefined;
  createAdSet: CreateAdSet = new CreateAdSet();
  editableAd: CreateAd = new CreateAd();

  selectedRegion: Region | undefined;
  locationsForSuggestion: Location[] = [];

  phoneList: PhoneDTO[] = [];
  adValidation: CreateAdValidation = new CreateAdValidation();
  checked: boolean = false;
  process: boolean = false;
  errorMessage: string | undefined;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private adEditService: AdEditService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["id"];
    if (!this.id) {
      window.location.href = 'ad-list';
    }

    this.adEditService.getCreateAdSet()
      .then((createAdSet: CreateAdSet) => {
        this.createAdSet = createAdSet;
        this.phoneList = this.adEditService.initPhoneList(this.appComponent.user?.communicationList!);
      })
      .then(() => {
        this.adEditService.getAd(this.id!)
          .then(ad => {
            this.initLocations(ad);
            this.adEditService.initEditableAd(this.editableAd, ad);
            this.adEditService.initUsageCommunications(this.phoneList, this.editableAd.id!);
          });
      });
  }

  private initLocations(ad: Ad) {
    this.selectedRegion = this.createAdSet.regions
      ?.find(region => (ad as Ad).simpleLocation.regionId == region.id);
    this.editableAd.location = (ad as Ad).simpleLocation.locationId;
    this.updateLocationsForSuggestion();
  }

  public updateLocation() {
    this.updateLocationsForSuggestion();
    this.editableAd.location = this.locationsForSuggestion[0].id;
  }

  private updateLocationsForSuggestion() {
    this.locationsForSuggestion = this.locationService.getSortedLocationsByRegion(this.selectedRegion);
  }

  public updateSubCategories() {
    const index = this.createAdSet.categories
      ?.map(categoryObject => categoryObject.id).indexOf(this.editableAd.category!);
    this.editableAd.subCategory = this.createAdSet.categories![index!].subCategoryList[0]?.id;
  }

  public setTitleImage(index: number) {
    if (!this.process) {
      this.adEditService.setTitleImg(this.editableAd.imgList, index);
    }
  }

  public filesDropped(target: EventTarget) {
    const filesDropped = (target as HTMLInputElement).files!;
    this.adEditService.filesDropped(filesDropped, this.editableAd.imgList);
  }

  public deleteImg(index: number) {
    if (!this.process) {
      this.adEditService.deleteImg(this.editableAd.imgList, index);
    }
  }

  public onKeyBody() {
    if (this.checked) {
      this.adEditService.checkBody(this.editableAd, this.adValidation);
    }
  }

  public onKeyPrice() {
    this.editableAd.price = this.adEditService.getValidPrice(this.editableAd.price!);
  }

  public onKeyTitle() {
    if (this.checked) {
      this.adEditService.checkTitle(this.editableAd, this.adValidation);
    }
  }

  public onKeyDeliveryDescription() {
    if (this.checked) {
      this.adEditService.checkDeliveryDescription(this.editableAd, this.adValidation);
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
    if (this.adEditService.validUpdateAd(this.editableAd, this.phoneList, this.adValidation)) {
      await this.adEditService.prepareUpdatedAd(this.editableAd, this.phoneList);
      this.adEditService.updateAd(this.editableAd).subscribe(
        () => {
          window.location.href = '/ad?id=' + this.id;
        },
        err => {
          this.process = false;
          this.errorMessage = err.error ? err.error : "Server error.";
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
