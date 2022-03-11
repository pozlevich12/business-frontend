export class User {
    firstName: string;
    phoneNumbers: string[];
    roles: string;
    avatarUrl: string;
    favoriteAdList: number[];

    constructor(user: any) {
        this.firstName = user.firstName;
        this.phoneNumbers = user.phoneNumbers;
        this.roles = user.roles;
        this.avatarUrl = user.avatarUrl;
        this.favoriteAdList = user.favoriteAdList;
    }
}