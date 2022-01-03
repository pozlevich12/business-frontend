import { Injectable } from '@angular/core';
import { CategoriesObject } from '../common/categories.object';

const CATEGORIES = 'categories';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public saveCategories(categories: CategoriesObject[]): void {
    window.sessionStorage.removeItem(CATEGORIES);
    window.sessionStorage.setItem(CATEGORIES, JSON.stringify(categories));
  }

  public getCategories(): string | null {
    return window.sessionStorage.getItem(CATEGORIES);
  }
}
