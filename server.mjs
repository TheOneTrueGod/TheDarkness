import api from './server/api/api.js'
import path from 'path';

import express from 'express';
import session from 'express-session'; 
import bodyParser from 'body-parser';
import User from "./object_defs/User.js";

const { getResponse } = api;
const port = process.argv[2] || 8888;

const app = express();

//app.use(cookieParser());
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());

app.get(
  [
    '/dist/*',
    '/public/*',
    '/node_modules/*',
    '/favicon.ico'
  ], (req, res) => {
    res.sendFile(path.resolve(`./${req.originalUrl}`));
  }
);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

const Users = [
  new User(1, "TheOneTrueGod", "getin", "afbzxcWr"),
  new User(2, "Tabitha", "getin", "afqwerpcWr"),
  new User(3, "TJ", "getin", "bbjwerPO"),
  new User(4, "Chip", "getin", "ggueWper"),
  new User(5, "Sean", "getin", "bnsasweR"),
  new User(6, "Mitch", "getin", "bjppqwerO"),
]

app.post('/api/login', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  const user = Users.find((user) => { return user.name === username && user.password === password })
  if (!user) { return response.status(504).send({ error: "user not found" }); }

  request.session.userToken = user.token;
  return response.send({ data: {}, success: true });
});

app.post('/api/logout', (request, response) => {
  request.session.userToken = undefined;
  return response.send({ data: {}, success: true });
});

app.post(
  '/api/*',
  (request, response) => {
    const userToken = request.session.userToken;
    if (!userToken) {
      return response.status(504).send({ error: "unauthorized" });
    }

    const responseObject = getResponse(request.originalUrl, request, request.body);
    response.send(responseObject);
  }
);

app.listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");