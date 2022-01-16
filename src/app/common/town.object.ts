export class Town {
    id: number;
    town: string;
    constructor(_town: any) {
        this.id = _town.id;
        this.town = _town.town;
    }
} 