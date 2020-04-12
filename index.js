const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
// const xml = require('xml');
const builder = require('xmlbuilder');
const estimate = require("./src/estimator");

const PORT = process.env.PORT || 5000;

const server = http.createServer();

server.on("request", (req, res) => {
  const body = [];

  req.on("error", (err) => console.error("request error"));
  res.on("error", (err) => console.error(err, "response error"));

  const parsedUrl = url.parse(req.url, true);
  if (req.method === "GET" && parsedUrl.pathname === "/") {
    // fs.createReadStream(path.join(__dirname, 'src', 'index.html')).pipe(res);
    fs.createReadStream("./src/index.html").pipe(res);
    console.log(parsedUrl.pathname);
  } else if (req.method === "GET" && parsedUrl.pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("./src/about.html").pipe(res);
    console.log(parsedUrl.pathname);

    // res.writeHead(200, {'Content-Type': 'text/html'});
    // console.log(parsedUrl.pathname)
    // fs.readFile('./src/about.html', null, (err, data) => {
    //   if (err) {
    //     res.writeHead(404);
    //     res.write('File not found');
    //   } else {
    //     res.write(data);
    //   }
    //   res.end();
    // });
  } else if (
    req.method === "POST" &&
    (parsedUrl.pathname === "/api/v1/on-covid-19" ||
      parsedUrl.pathname === "/api/v1/on-covid-19/json")
  ) {
    // res.writeHead(200, {'Content-Type': 'text/html'})
    // res.write(JSON.stringify({name: 'Fisayo'}))
    // res.end();

    const body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        // const parsedJSON = JSON.parse(Buffer.concat(body))
        const data = Buffer.concat(body);
        const parsedJSON = JSON.parse(data);
        const estimatedData = estimate(parsedJSON);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(estimatedData));
        // res.write(data)
        res.end();
      });
  } else if (
    req.method === "POST" &&
    parsedUrl.pathname === "/api/v1/on-covid-19/xml"
  ) {

    const body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        // const parsedJSON = JSON.parse(Buffer.concat(body))
        const data = Buffer.concat(body);
        const parsedJSON = JSON.parse(data);
        const estimatedData = estimate(parsedJSON);
        // const xmlData = xml(estimatedData);
        const xmlBuild = builder.create(estimatedData).end({pretty: false})

        res.writeHead(200, { "Content-Type": "text/xml" });
        res.write(xmlBuild);
        res.end();

      });
  } else {
    res.writeHead(404, {
      "X-Powered-By": "Node",
    });
    res.end();
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
