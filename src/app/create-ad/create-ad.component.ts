import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { CategoriesObject } from '../common/categories.object';
import { FileHandle } from '../common/FileHandle.object';
import { SubCategoryObject } from '../common/subcategory.object';
import { CreateAdService } from '../_services/create-ad.service';
import { SessionStorageService } from '../_services/session-storage.service';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  uploadedFiles: FileHandle[] = [];
  indexTitleImg: number = 0;
  delivery: boolean = false;
  category: number = 5;
  subCategory: number = 0;
  subCategories: SubCategoryObject[] = [];
  categories: CategoriesObject[] = [];

  constructor(private appComponent: AppComponent, private createAdService: CreateAdService, private sessionStorage: SessionStorageService) {
    this.appComponent.components = [false, true];
  }

  ngOnInit() {
    let categories;
    const intervalInitCategories = setInterval(() => {
      categories = this.sessionStorage.getCategories();
      if (categories) {
        this.categories = JSON.parse(categories);
        this.category = this.categories[0].categoryId;
        this.subCategories = this.categories[0].subCategories!;
        this.subCategory = this.subCategories[0].subCategoryId;
        clearInterval(intervalInitCategories);
      }
    }, 250);
  }

  updateSubCategories() {
    const index = this.categories.map(e => e.categoryId).indexOf(this.category);
    this.subCategories = this.categories[index].subCategories!;
    if (this.subCategories.length == 0) {
      return;
    }
    this.subCategory = this.subCategories[0].subCategoryId;
  }

  setTitleImage(index: number) {
    this.indexTitleImg = index;
  }

  filesDropped(event: Event) {
    const input = event.target as HTMLInputElement;
    this.createAdService.filesDropped(input.files!).forEach(file => {
      this.uploadedFiles.push(file);
    });
  }

  deleteImg(index: number) {
    if (this.indexTitleImg === index) {
      this.indexTitleImg = 0;
    } else if (index < this.indexTitleImg) {
      this.indexTitleImg--;
    }
    this.uploadedFiles = this.uploadedFiles.filter(file => file !== this.uploadedFiles[index]);
  }

  toggleDeliveryDescr(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.delivery = true;
    } else {
      this.delivery = false;
    }
  }
}
