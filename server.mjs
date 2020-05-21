import helpers from './server/helpers.js';
import http from 'http';
import url from 'url';

const { ServeFile } = helpers;
const port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;
  
  ServeFile(uri, response);
  
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");