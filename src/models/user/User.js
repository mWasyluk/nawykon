export class User {
    constructor({ uid, email }) {
        this.uid = uid;
        this.email = email;
    }

    static validateEmail(email) {
        // requires at list one sign before @, at least one sign between @ and ., at least 2 signs after .
        if (!email) {
            throw new Error('E-mail jest wymagany.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Adres e-mail jest niepoprawny.');
        }
    }

    static validatePassword(password) {
        if (!password) {
            throw new Error('Hasło jest wymagane.');
        }
    }
}
