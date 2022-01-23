import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngbd-carousel-basic',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

  images: string[] = [
    "https://res.cloudinary.com/dwdneivtl/image/upload/w_700,h_500,c_fill/ebdlfc36cpuhbe2zkv16.jpg",
    "https://res.cloudinary.com/dwdneivtl/image/upload/w_700,h_500,c_fill/x1r2mghgweuknkkoxsym.png",
    "https://res.cloudinary.com/dwdneivtl/image/upload/w_700,h_500,c_fill/cc8pxzzfg56swgrs55xl.jpg",
    "https://res.cloudinary.com/dwdneivtl/image/upload/w_700,h_500,c_fill/u9kbcskc96bhgwdakglg.png",
    "https://res.cloudinary.com/dwdneivtl/image/upload/w_700,h_500,c_fill/y1m3cfnjimmoqk5arlt8.png",
    "https://res.cloudinary.com/dwdneivtl/image/upload/h_500,c_scale/h0duycsrf2pnloxnq6ks.jpg",
    "https://res.cloudinary.com/dwdneivtl/image/upload/h_500,c_scale/bdbbugugbpq4z7ynvjqs.jpg"
  ];
  constructor() { 
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    let width = 512;
    let height = 512;
    if(width < 700) {

    }
    $('#img-carousel-3').attr('position', 'absolute');
    $('#img-carousel-3').attr('margin-left', '100px');
    /*for(let i = 0; i < this.images.length; i++) {
      let img = new Image();
      img.src = this.images[i];
      img.onload = ;
      console.log(img);
      console.log(img.width + 'x' + img.height);
    }*/
   // $('#img0').css("margin-top", "84px");
  //  $('#img2').css("margin-top", "84px");
  } 

}

