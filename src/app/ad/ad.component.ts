import { Component, OnInit } from '@angular/core';
import { ImageDTO } from '../common/ImageDTO.object';
import { AdService } from '../_services/ad/ad.service';
import * as bootstrap from 'bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppComponent } from '../app.component';

@Component({
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

  ad: any | undefined;
  id: number | undefined;
  online: boolean | undefined;
  lastVisit: string = "";
  images: ImageDTO[] | undefined;
  imagesPopup: ImageDTO[] | undefined;
  carousel: bootstrap.Carousel | undefined;
  rollCarousel: boolean = false;

  constructor(public appComponent: AppComponent, private adService: AdService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams["id"];
    if (!this.id) {
      window.location.href = 'ad-list';
    }
    this.adService.getAd(this.id!).subscribe(response => {
      const data = JSON.parse(response);
      this.ad = data;
      this.setLastVisit(this.ad.author.lastVisit);
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

  private setLastVisit(date: string) {
    const diff = new Date().getTime() - new Date(date).getTime();
    if (diff < 600000) {
      this.online = true;
    } else if (diff < 3600000) {
      this.lastVisit = 'Заходил(а) ' + Math.round(diff / 60000) + " минут назад";
    } else if (diff < 86400000) {
      this.lastVisit = 'Заходил(а) ' + Math.round(diff / 3600000) + "ч. назад";
    } else {
      this.lastVisit = 'Был(а) в сети ' + new DatePipe("en-US").transform(date, 'dd-MM-YYYY')?.replace("-", ".").replace("-", ".");
    }
  }
}
