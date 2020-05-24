import helpers from './server/helpers.js';
import api from './server/api/api.js'
import http from 'http';
import url from 'url';

const { ServeFile } = helpers;
const { getResponse } = api;
const port = process.argv[2] || 8888;

http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname;
  
  if (uri.startsWith('/api')) {
    response.writeHead(200, {"Content-Type": "application/json"});
    try {
      var body = "";
      // Stream the body out
      request.on('readable', function() {
        const chunkValue = request.read();
        if (chunkValue !== null) {
          body += chunkValue;
        }
      }).on('end', function() {
        const responseObject = getResponse(uri, request, JSON.parse(body));
        response.write(JSON.stringify(responseObject));
        response.end();
      });
    } catch (err) {
      response.writeHead(500);
      response.write(JSON.stringify({ error: err.toString() }));
      response.end();
    }
    return;
  }

  if (uri.startsWith('/game')) {
    uri = '';
  }
  ServeFile(uri, response);
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");