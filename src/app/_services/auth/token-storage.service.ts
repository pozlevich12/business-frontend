import { Injectable } from '@angular/core';
import { CategoriesObject } from 'src/app/common/categories.object';
import { Region } from 'src/app/common/location/Region';
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
    this.updatePropertyInLocaleStorage(TOKEN_KEY, token, false);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any) {
    this.updatePropertyInLocaleStorage(USER_KEY, user, true);
  }

  public getUser(): User | undefined {
    const userObject = window.localStorage.getItem(USER_KEY);
    if (userObject) {
      return new User(JSON.parse(userObject));
    }
    return undefined;
  }

  public saveCategories(categories: CategoriesObject[]): void {
    this.updatePropertyInLocaleStorage(CATEGORIES, categories, true);
  }

  public getCategories(): CategoriesObject[] | undefined {
    return this.jsonParse(window.localStorage.getItem(CATEGORIES));
  }

  public saveRegions(regions: Region[]): void {
    this.updatePropertyInLocaleStorage(LOCATIONS, regions, true);
  }

  public getRegions(): Region[] | undefined {
    return this.jsonParse(window.localStorage.getItem(LOCATIONS));
  }

  private jsonParse(json: string | null): any | undefined {
    return json ? JSON.parse(json) : undefined;
  }

  private updatePropertyInLocaleStorage(key: string, object: any, saveAsJSON: boolean) {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, saveAsJSON ? JSON.stringify(object) : object);
  }
}
