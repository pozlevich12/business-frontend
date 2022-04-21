import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AdList } from '../common/AdList';

const ONE_DAY_ON_MILLIS = 86400000;
const ONE_HOUR_ON_MILLIS = 3600000;
const ONE_MINUTE_ON_MILLIS = 60000;
const ONLINE_TIME_ON_MILLIS = 600000;

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public mapLastVisit(date: string): string | undefined {

    const current = new Date();
    const visit = new Date(date);
    
    const diff = current.getTime() - visit.getTime();

    if (diff <= ONLINE_TIME_ON_MILLIS) {
      return;
    }

    if (this.isToday(current, visit)) {
      if (diff < ONE_HOUR_ON_MILLIS) {
        return 'Заходил(а) ' + Math.round(diff / ONE_MINUTE_ON_MILLIS) + " минут назад";
      } else {
        return 'Заходил(а) ' + Math.round(diff / ONE_HOUR_ON_MILLIS) + "ч. назад";
      }
    } else if (this.isYesterday(current, visit)) {
      return 'Заходил(а) вчера, в ' + date.substring(11, 16);
    } else {
      return 'Был(а) в сети ' + new DatePipe("en-US").transform(date, 'dd-MM-YYYY')?.replace("-", ".").replace("-", ".");
    }
  }

  public mapCreatedDate(ad: AdList) {
    const current = new Date();
    const created = new Date(ad.created);
    
    if (this.isToday(current, created)) {
      ad.created = 'Сегодня, ' + ad.created.substring(11, 16);
    } else if (this.isYesterday(current, created)) {
      ad.created = 'Вчера, ' + ad.created.substring(11, 16);
    } else if (this.isThisYear(current, created)) {
      ad.created = ad.created.substring(8, 10) + this.mapMonthName(created.getMonth()) + ad.created.substring(11, 16);
    } else {
      ad.created = ad.created.substring(8, 10) + '-' + ad.created.substring(5, 7) + '-' + ad.created.substring(0, 4);
    }
  }

  private isToday(date: Date, comparableDate: Date): boolean {
    if (date.getFullYear() == comparableDate.getFullYear()
      && date.getMonth() == comparableDate.getMonth()
      && date.getDate() == comparableDate.getDate()) {
      return true;
    }
    return false;
  }

  private isYesterday(date: Date, comparableDate: Date): boolean {
    return this.isToday(new Date(date.getTime() - ONE_DAY_ON_MILLIS), comparableDate);
  }

  private isThisYear(date: Date, comparableDate: Date): boolean {
    return date.getFullYear() == comparableDate.getFullYear();
  }

  private mapMonthName(month: number): string {
    if (month == 0) {
      return " янв., ";
    } else if (month == 1) {
      return " фев., ";
    } else if (month == 2) {
      return " мар., ";
    } else if (month == 3) {
      return " апр., ";
    } else if (month == 4) {
      return " мая, ";
    } else if (month == 5) {
      return " июн., ";
    } else if (month == 6) {
      return " июл., ";
    } else if (month == 7) {
      return " авг., ";
    } else if (month == 8) {
      return " сен., ";
    } else if (month == 9) {
      return " окт., ";
    } else if (month == 10) {
      return " ноя., ";
    } else {
      return " дек., ";
    }
  }
}
