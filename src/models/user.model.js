/**
 * User model (Stub).
 * Will handle data modeling/representation and database queries.
 */
class UserModel {
    constructor(id, name, email, password, preferences = []) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.preferences = preferences;
    }
}

module.exports = UserModel;
