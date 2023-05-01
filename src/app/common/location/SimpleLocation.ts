export class SimpleLocation {
    locationId: number;
    locationName: string;
    districtId: number;
    districtName: string;
    regionId: number;
    regionName: string;

    constructor(object: any) {
        this.locationId = object.locationId;
        this.locationName = object.locationName;
        this.districtId = object.districtId;
        this.districtName = object.districtName;
        this.regionId = object.regionId;
        this.regionName = object.regionName;
    }
}