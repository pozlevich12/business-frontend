import { Injectable } from '@angular/core';
import { CategoriesObject } from 'src/app/common/categories.object';
import { LocationObject } from 'src/app/common/locations.object';
import { User } from 'src/app/common/User';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const CATEGORIES = 'categories';
const LOCATIONS = 'locations';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public saveToken(token: any): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
    const userObject = window.localStorage.getItem(USER_KEY);
    if(userObject) {
      return new User(JSON.parse(userObject));
    }
    return null;
  }

  public saveCategories(categories: CategoriesObject[]): void {
    window.localStorage.removeItem(CATEGORIES);
    window.localStorage.setItem(CATEGORIES, JSON.stringify(categories));
  }

  public getCategories(): string | null {
    return window.localStorage.getItem(CATEGORIES);
  }

  public saveLocations(locations: LocationObject[]): void {
    window.localStorage.removeItem(LOCATIONS);
    window.localStorage.setItem(LOCATIONS, JSON.stringify(locations));
  }

  public getLocations(): string | null {
    return window.localStorage.getItem(LOCATIONS);
  }
}
