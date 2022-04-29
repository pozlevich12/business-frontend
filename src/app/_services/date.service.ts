import { Injectable } from '@angular/core';
import { AdList } from '../common/AdList';

const ONE_DAY_ON_MILLIS = 86400000;
const ONE_HOUR_ON_MILLIS = 3600000;
const ONE_MINUTE_ON_MILLIS = 60000;
const ONLINE_TIME_ON_MILLIS = 600000;

const LOCATION_OPTION = "ru-RU";

const OPTION_HH_MM: any = {
  hour: "2-digit",
  minute: "2-digit"
};

const OPTION_DD_MM_HH_MM: any = {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
};

const OPTION_DD_MM_YYYY: any = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
};

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public userIsOnline(date: Date): boolean {
    const diff = new Date().getTime() - date.getTime();
    return diff <= ONLINE_TIME_ON_MILLIS;
  }

  public mapLastVisit(date: Date): string {

    const current = new Date();
    const diff = current.getTime() - date.getTime();

    if (this.isToday(current, date)) {
      if (diff < ONE_HOUR_ON_MILLIS) {
        return 'Заходил(а) ' + Math.round(diff / ONE_MINUTE_ON_MILLIS) + " минут назад";
      } else {
        return 'Заходил(а) ' + Math.round(diff / ONE_HOUR_ON_MILLIS) + "ч. назад";
      }
    } else if (this.isYesterday(current, date)) {
      return 'Заходил(а) вчера, в ' + date.toLocaleTimeString(LOCATION_OPTION, OPTION_HH_MM);
    } else {
      return 'Был(а) в сети ' + date.toLocaleDateString(LOCATION_OPTION, OPTION_DD_MM_YYYY);
    }
  }

  public mapCreatedDate(ad: AdList) {
    const current = new Date();
    const created = new Date(ad.created);

    if (this.isToday(current, created)) {
      ad.created = 'Сегодня, ' + created.toLocaleTimeString(LOCATION_OPTION, OPTION_HH_MM);
    } else if (this.isYesterday(current, created)) {
      ad.created = 'Вчера, ' + created.toLocaleTimeString(LOCATION_OPTION, OPTION_HH_MM);
    } else if (this.isThisYear(current, created)) {
      ad.created = created.toLocaleDateString(LOCATION_OPTION, OPTION_DD_MM_HH_MM);
    } else {
      ad.created = created.toLocaleDateString(LOCATION_OPTION, OPTION_DD_MM_YYYY);
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
}
