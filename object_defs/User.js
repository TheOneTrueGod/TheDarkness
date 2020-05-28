const ObjectVersion = 1;

class User {
    constructor(id, name, password, token) {
        this.name = name;
        this.id = id;
        this.password = password;
        this.token = token;
    }

    static fromJSONObject(jsonData) {
        if (jsonData._v !== ObjectVersion) { 
            throw new Error(`User Json Data Version Mismatch.  Current version: ${ObjectVersion}.  Json version: ${jsonData._v}`);
        }
        const user = new User(jsonData.id, jsonData.name, "", "");
        return user;
    }

    toJSONObject() {
        return {
            _v: ObjectVersion,
            name: this.name,
            id: this.id
        };
    }
}

export default User;