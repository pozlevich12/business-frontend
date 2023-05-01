export class Location {
    id: number;
    name: string;

    constructor(object: any) {
        this.id = object.id;
        this.name = object.name;
    }
}