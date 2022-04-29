export class User {
    id: number;
    phoneNumber: string;
    firstName: string;
    lastVisit: Date;
    phoneNumbers: string[];
    roles: string;
    avatarUrl: string;
    favoriteAdList: number[];

    constructor(user: any) {
        this.id = user.id;
        this.phoneNumber = user.phoneNumber;
        this.firstName = user.firstName;
        this.lastVisit = user.lastVisit;
        this.phoneNumbers = user.phoneNumbers;
        this.roles = user.roles;
        this.avatarUrl = user.avatarUrl;
        this.favoriteAdList = user.favoriteAdList;
    }
}