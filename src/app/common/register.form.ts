export class RegisterForm {

    firstName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;

    constructor() {
        this.firstName = '';
        this.phoneNumber = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }
}