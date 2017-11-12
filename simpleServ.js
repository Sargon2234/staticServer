const http = require('http'),
  url = require('url'),
  fs = require('fs'),
  mime = require('mime'),
  path = require('path');

let base = `${__dirname}/files`;

http.createServer((req, res) => {
  let pathName = path.normalize(`${base}${req.url}`);

  fs.stat(pathName, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.write('Resource missing 404 \n');
      res.end();
    } else if (stats.isFile()) {
      const type = mime.getType(pathName);

      res.setHeader('Content-Type', type);

      let file = fs.createReadStream(pathName);

      file.on('open', () => {
        res.statusCode = 200;
        file.pipe(res);
      });

      file.on('error', (err) => {
        console.log(err);
        res.statusCode = 403;
        res.write('File permission error');
        res.end();
      });
    } else {
      res.writeHead(403);
      res.write('Directory access forbidden');
      res.end();
    }
  });
}).listen(8090);

console.log('Server started');
