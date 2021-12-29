import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  constructor(private appComponent: AppComponent) {
    this.appComponent.components = [false, true];
   }

  ngOnInit(): void {
  }
}
