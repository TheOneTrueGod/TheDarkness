var http = require("http"),
    url = require("url"),
    path = require("path"),
    port = process.argv[2] || 8888;

import helpers from './server/helpers.js';
const { ServeFile } = helpers;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  ServeFile(filename, response);
  
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");