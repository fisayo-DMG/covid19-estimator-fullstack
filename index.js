const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

const server = http.createServer();


server.on('request', (req, res) => {
  req.on('error', err => console.error('request error'));
  res.on('error', err => console.error(err, 'response error'));

  const parsedUrl = url.parse(req.url, true);
  if (req.method === 'GET' && parsedUrl.pathname === '/'){
    // fs.createReadStream(path.join(__dirname, 'src', 'index.html')).pipe(res);
    fs.createReadStream('./src/index.html').pipe(res);
    console.log(parsedUrl.pathname)
  } else {
    res.writeHead(404, {
      'X-Powered-By': 'Node'
    });
    res.end();
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))