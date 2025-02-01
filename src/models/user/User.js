import { Preferences } from './Preferences';

export class User {
    constructor({id, username, email, password, preferences}) {
        this.id = id;
        this.username = username;
        this.email = email;
        // this.password = password;
        this.preferences = preferences instanceof Preferences ? preferences : new Preferences({ ...preferences });
    }
}
