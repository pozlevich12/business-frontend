import { Town } from "./town.object";

export class LocationObject {
    region: string;
    townList?: Town[];
    constructor(locations: any) {
      this.region = locations.region;
    }
  }
  