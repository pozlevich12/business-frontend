import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriesObject } from '../common/categories.object';
import { LocationObject } from '../common/locations.object';

const BASE_URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  loadCategoryList(): Observable<any> {
    return this.http.get<CategoriesObject[]>(BASE_URL + 'public/getAllCategories');
  }

  loadLocationList(): Observable<any> {
    return this.http.get<LocationObject[]>(BASE_URL + 'public/getAllLocations');
  }
}
