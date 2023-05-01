import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadMoreAdService {

  private loading = new BehaviorSubject<boolean>(true);
  private condition = new Subject<any>();

  public loading$ = this.loading.asObservable();
  public condition$ = this.condition.asObservable();

  constructor() {
  }

  public setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  public changeCondition(data: any) {
    this.condition.next(data);
  }
}
