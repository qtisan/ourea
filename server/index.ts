
import { parse } from 'url';
import next from 'next';
import express from 'express';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  server.get('/hello', (req, res) => {
    req && res.send('Hello, hot reload.');
  });
  server.use((req, res) => {
    const parsedUrl = parse(req.originalUrl, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () =>
    console.log(`[${app.currentPhase()}] server listen on port ${port}`)
  );
});
