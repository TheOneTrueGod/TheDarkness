import api from './server/api/api.js'
import path from 'path';

import express from 'express';
import session from 'express-session'; 
import bodyParser from 'body-parser';
import AuthEndpoint, { Users } from "./server/api/AuthEndpoint.js";
import dotenv from "dotenv";
dotenv.config();

const { getResponse } = api;
const port = process.argv[2] || 8888;

const app = express();

app.use(session({
  secret: 'basdfxzcvqwer98712345xzcvdsfgqwer',
  resave: true,
  saveUninitialized: true,
}));
app.use(bodyParser.json());

app.get(
  [
    '/dist/*',
    '/public/*',
    '/assets/*',
    '/node_modules/*',
    '/favicon.ico'
  ], (req, res) => {
    res.sendFile(path.resolve(`./${req.originalUrl}`));
  }
);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

app.post('/api/auth/*', (request, response) => {
  response.send({ 
    data: AuthEndpoint.getResponse(request.originalUrl, request, response),
    success: true,
  });
});

app.post(
  '/api/*',
  (request, response) => {
    const userToken = request.session.userToken;
    let user = Users.find((user) => { return user.token === userToken });
    if (!userToken || !user) {
      if (process.env.FORCE_LOGIN) {
        user = Users.find((user) => { return user.name === "TheOneTrueGod" });
      }
      if (!user) {
        return response.status(504).send({ error: "unauthorized" });
      }
    }

    const responseObject = getResponse(user, request.originalUrl, request, request.body);
    response.send(responseObject);
  }
);

app.listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");