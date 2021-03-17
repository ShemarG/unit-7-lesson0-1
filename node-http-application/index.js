const http = require('http');
const fs = require('fs');
const url = require('url');

const host = '127.0.0.1';
const port = 8000;
const app = http.createServer(requestHandler);

function requestHandler(req, res) {
  const url = new URL(req.url, `http://${host}:${port}/`);
  console.log(url);

  function responseHandler(statusCode, content) {
    res.writeHead(statusCode);
    res.write(content);
    res.end();
  }

  function processTemplate(templatePath, keys) {
    console.log(keys);
    fs.readFile(templatePath, 'utf8', (err, string) => {
      if (!err) {
        keys.forEach((value, name) => {
          // console.log(string);
          string = string.replace(`{{${name}}}`, `${value}`);
        });
        responseHandler(200, string);
      }
    });
  }

  if (url.pathname === '/') {
    processTemplate('templates/index.html', url.searchParams);
  } else if (url.pathname === '/dogs') {
    processTemplate('templates/dogs.html', url.searchParams);
  } else {
    responseHandler(404, 'Sorry, that route does not exist');
  }
}

app.listen({ host, port }, () => {
  console.info(`Starting server at ${host}:${port}...`);
});
