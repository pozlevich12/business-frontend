import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { HomeService } from '../_services/home.service';
import { SessionStorageService } from '../_services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories!: CategoriesObject[];

  constructor(private appComponent: AppComponent, private homeService: HomeService, private sessionStorage: SessionStorageService) { 
    this.appComponent.components = [true, false];
  }

  ngOnInit(): void {
    const categories = this.sessionStorage.getCategories();
    if (!categories) {
      this.homeService.loadCategoryList().subscribe(body => {
        this.categories = body;
        this.sessionStorage.saveCategories(this.categories);
      });
    } else {
      this.categories = JSON.parse(categories);
    }
    
  }
}