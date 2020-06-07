import User from "../../object_defs/User.js";

export default class AuthEndpoint {
    static getResponse(uri, request, response) {
        if (uri.startsWith('/api/auth/login')) {
            const username = request.body.username;
            const password = request.body.password;
            const user = Users.find((user) => { return user.name === username && user.password === password })
            if (!user) { return response.status(504).send({ error: "user not found" }); }

            request.session.userToken = user.token;
            return {};
        }
        else if (uri.startsWith('/api/auth/logout')) {
            request.session.userToken = undefined;
            return {};
        } else if (uri.startsWith('/api/auth/get-user')) {
            const userToken = request.session.userToken;
            let user = Users.find((user) => { return user.token === userToken });
            if (process.env.FORCE_LOGIN) {
                user = Users.find((user) => { return user.name === "TheOneTrueGod" });
            }
            if (!user) {
                response.status(504).send({ error: "unauthorized" });
                throw new Error("unauthorized");
            }
            return user.toJSONObject();
        }
    }
}

export const Users = [
    new User(1, "TheOneTrueGod", "getin", "afbzxcWr"),
    new User(2, "Tabitha", "getin", "afqwerpcWr"),
    new User(3, "TJ", "getin", "bbjwerPO"),
    new User(4, "Chip", "getin", "ggueWper"),
    new User(5, "Sean", "getin", "bnsasweR"),
    new User(6, "Mitch", "getin", "bjppqwerO"),
  ]