import { Component, OnInit } from '@angular/core';
import { Image } from '../common/Image';
import { AdService } from '../_services/ad/ad.service';
import * as bootstrap from 'bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { DateService } from '../_services/date.service';

@Component({
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})

export class AdComponent implements OnInit {

  ad: any | undefined;
  id: number | undefined;
  online: boolean = true;
  lastVisit: string | undefined;
  images: Image[] | undefined;
  imagesPopup: Image[] | undefined;
  carousel: bootstrap.Carousel | undefined;
  rollCarousel: boolean = false;

  constructor(public appComponent: AppComponent, private adService: AdService, private route: ActivatedRoute, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams["id"];
    if (!this.id) {
      window.location.href = 'ad-list';
    }
    this.adService.getAd(this.id!).subscribe(response => {
      const data = JSON.parse(response);
      this.ad = data;
      this.lastVisit = this.dateService.mapLastVisit(this.ad.author.lastVisit);
      if (this.lastVisit) {
        this.online = false;
      }
      this.images = this.adService.fillImageList(data);
      this.imagesPopup = this.adService.fillPopupImageList(data);
    },
      error => {
        console.log(error);
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
    this.adService.toggleFavorite(this.appComponent.user!, id);
  }

  public viewPhone() {
    $("#viewPhone").hide();
    $("#href-show-phone").removeAttr("hidden");
  }
}
