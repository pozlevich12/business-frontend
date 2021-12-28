import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { HomeService } from '../_services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories!: CategoriesObject[];

  constructor(private appComponent: AppComponent, private homeService: HomeService) { 
    this.appComponent.components = [true, false];
  }

  ngOnInit(): void {
    this.homeService.loadCategoryList().subscribe(body => {
      this.categories = body;
    });
  }
}