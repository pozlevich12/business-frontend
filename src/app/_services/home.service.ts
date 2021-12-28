import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesObject } from '../common/categories.object';

const CATEGORY_API = 'https://syrovatki-business.herokuapp.com/auth/';
const CATEGORY_API2 = 'http://localhost:8080/public/getAllCategories';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  loadCategoryList(): Observable<any> {
    return this.http.get<CategoriesObject[]>(CATEGORY_API);
  }
}
