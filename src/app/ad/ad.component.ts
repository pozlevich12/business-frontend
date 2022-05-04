import { Component, OnInit } from '@angular/core';
import { Image } from '../common/Image';
import { AdService } from '../_services/ad/ad.service';
import * as bootstrap from 'bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { DateService } from '../_services/date.service';
import { Ad } from '../common/Ad';
import { PhoneDTO } from '../common/PhoneDTO';
import { DomSanitizer } from '@angular/platform-browser';
import { FavoriteAdService } from '../_services/ad/favorite-ad.service';

@Component({
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})

export class AdComponent implements OnInit {

  ad: Ad | undefined;
  id: number | undefined;
  authorOnline: boolean | undefined;
  authorLastVisit: string | undefined;
  communications: PhoneDTO[] = [];
  imagesPopup: Image[] | undefined;
  carousel: bootstrap.Carousel | undefined;
  rollCarousel: boolean = false;
  processDelete: boolean = false;

  constructor(public appComponent: AppComponent, private adService: AdService, private route: ActivatedRoute, private favoriteAdService: FavoriteAdService, private dateService: DateService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams["id"];
    if (!this.id) {
      window.location.href = 'ad-list';
    }
    this.adService.getAd(this.id!).subscribe(adResponse => {
      this.ad = new Ad(adResponse);
      this.authorOnline = this.dateService.userIsOnline(this.ad.author.lastVisit);
      if (!this.authorOnline) {
        this.authorLastVisit = this.dateService.mapLastVisit(this.ad.author.lastVisit);
      }
      this.ad.imgList = this.adService.fillImageList(adResponse.imgList);
      this.imagesPopup = this.adService.fillPopupImageList(this.ad.imgList);
    },
      () => {
        alert("Something went wrong");
      });
  }

  public scrollPopup(index: number) {
    if (index > 0) {
      $('#popupModalToggle').on('shown.bs.modal', function () {
        $('#popupModalToggle').animate({
          scrollTop: $('#img-popup-' + index).offset()!.top - 150
        }, 750);
        $(this).off('shown.bs.modal');
      });
    }
  }

  public toggleCarousel(index: number) {
    if (!this.rollCarousel) {
      this.rollCarousel = true;
      if (this.carousel) {
        this.carousel.to(index);
      } else {
        this.carousel = new bootstrap.Carousel(document.querySelector('#carouselExampleControls')!);
        this.carousel.to(index);
      }
      this.rollCarousel = false;
    }
  }

  public toggleFavorite(id: number) {
    this.favoriteAdService.toggleFavorite(this.appComponent.user!, id);
  }

  public loadCommunication() {
    this.adService.initUsageCommunications(this.communications, this.ad!.id);
  }

  public getSanitizeUrlForViber(index: number) {
    return this.sanitizer
      .bypassSecurityTrustUrl('viber://chat/?number=%2B' + this.communications[index].phone?.substring(1, 13));
  }

  public deleteAd() {
    this.processDelete = true;
    this.adService.deleteAd(this.ad!.id).subscribe(() => {
      this.favoriteAdService.deleteFavoriteAdIfExists(this.appComponent.user!, this.ad!.id);
      window.location.href = '/ad-list';
    },
      () => {
        this.processDelete = false;
      });
  }
}
