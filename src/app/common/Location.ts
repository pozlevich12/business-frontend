export class Location {
    regionId: number;
    regionName: string;
    townId: number;
    townName: string;
    fullNameLocation: string;

    constructor(location: any) {
        this.regionId = location.regionId;
        this.regionName = location.regionName;
        this.townId = location.townId;
        this.townName = location.townName;
        this.fullNameLocation = location.fullNameLocation;
    }
}