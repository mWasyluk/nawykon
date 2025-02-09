import { Preferences } from './Preferences';

export class User {
    constructor({ uid, username, email, password, preferences }) {
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.preferences = preferences instanceof Preferences ? preferences : new Preferences({ ...preferences });
    }
}
