import { Injectable } from '@angular/core';
import { Region } from '../common/location/Region';
import { Location } from '../common/location/Location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  public getSortedLocationsByRegion(region: Region | undefined): Location[] {
    return this.getLocationsByRegion(region).sort(this.compareLocation);
  }

  public getLocationsByRegion(region: Region | undefined): Location[] {
    if (!region) {
      return [];
    }
    
    return region.districts
      .map(district => district.locations)
      .reduce(function (previous, current) { return previous.concat(current) });
  }

  private compareLocation(a: Location, b: Location) {
    if (a.id > b.id) {
      return 1;
    } else if (a.id < b.id) {
      return -1;
    } else {
      return 0;
    }
  }
}
