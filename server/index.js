const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const prefix = '/api/';

    if (pathname.indexOf(prefix) === 0) {
      const subPath = pathname.substr(prefix.length);
      for (let entry of Object.entries(routes)) {
        let [route, routeHandle] = entry;
        if (route === subPath) {
          if (typeof routeHandle === 'function') {
            routeHandle(req, res);
          } else if (typeof routeHandle === 'object') {
            res.end(JSON.stringify(routeHandle));
          } else {
            res.end(routeHandle);
          }
          break;
        } else {
          res.end(JSON.stringify({
            message: '[404] page not found.'
          }));
        }
      }
    } else {
      handle(req, res, parsedUrl);
    }

  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  });
});
