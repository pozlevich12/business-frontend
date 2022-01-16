import { Injectable } from '@angular/core';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';

const CATEGORIES = 'categories';
const LOCATIONS = 'locations';

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

  public saveLocations(locations: LocationObject[]): void {
    window.sessionStorage.removeItem(LOCATIONS);
    window.sessionStorage.setItem(LOCATIONS, JSON.stringify(locations));
  }

  public getLocations(): string | null {
    return window.sessionStorage.getItem(LOCATIONS);
  }
}
