const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 3000;
const frontend = './frontend';
const http = require('http').createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`); // I love ES6 <3

  const parsedUrl = url.parse(req.url);
  let pathname = `${frontend}${parsedUrl.pathname}`;

  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };

  fs.exists(pathname, function (exist) {
    if(!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }

    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
});

// Bind our socket.io server onto our HTTP server
var io = require('socket.io')(http);

// Our websocket connection
io.on('connection', (socket) => {

  // Tell everyone the latest client connection count
  io.emit('clientUpdate', { clients: io.engine.clientsCount });

  // Video is updated (time changed, paused, played, etc)
  socket.on('videoUpdate', (msg) => {
    io.emit('videoUpdate', msg);
  });

  // Video is changed (Different video selected)
  socket.on('videoChange', (msg) => {
  	io.emit('videoChange', msg);
  })

  socket.on('disconnect', (socket) => {
    // Tell everyone the latest client connection count
    io.emit('clientUpdate', { clients: io.engine.clientsCount });
  });
});

// Start our HTTP server
http.listen(parseInt(port));