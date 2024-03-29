import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriesObject } from '../common/categories.object';
import { Region } from '../common/location/Region';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  loadCategoryList(): Observable<CategoriesObject[]> {
    return this.http.get<CategoriesObject[]>(BASE_URL + 'public/getAllCategories');
  }

  loadRegionList(): Observable<Region[]> {
    return this.http.get<Region[]>(BASE_URL + 'public/getAllRegions');
  }
}
