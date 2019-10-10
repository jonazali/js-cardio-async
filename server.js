const http = require('http'); // import HTTP node module
const url = require('url'); // import URL module
const db = require('./db');

const server = http.createServer();
// Listens for the "request" event on our server
// The even will be fired anytime some client makes a request
// Takes a callback with request and response
// request is what the client sent to us
// response is what we send back
server.on('request', (request, response) => {
  // check if request was a GET to '/' route
  if (request.url === '/' && request.method === 'GET') {
    response.writeHead(200, {
      'My-custom-header': 'This is a great API',
      'Another-header': 'More meta data'
    });
    response.end('Welcome to my server');
    return;
  }

  if (request.url === '/status' && request.method === 'GET') {
    const status = {
      up: true,
      owner: 'Big Boss',
      timestamp: Date.now()
    };

    response.writeHead(200, {
      'Content-Type': 'application.json'
    });

    response.end(JSON.stringify(status));
  }

  const parsedUrl = url.parse(request.url, true);
  if (parsedUrl.pathname === '/set' && request.method === 'PATCH') {
    return db
      .set(parsedUrl.query.file, parsedUrl.query.key, parsedUrl.query.value)
      .then(() => {
        response.end('value set');
      })
      .catch(err => {
        // TODO: handle errors
      });
  }
});

//
server.listen(5000, () => console.log('Server listenting on port 5000'));
