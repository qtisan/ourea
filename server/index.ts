import express from 'express';
import next from 'next';
import { parse } from 'url';
import config from '../lib/config';
import router from './router';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(`/${config.requestPrefix}`, router);
  server.get('*', (req, res) => {
    const parsedUrl = parse(req.originalUrl, true);
    handle(req, res, parsedUrl);
  });
  server.use((req, res) => {
    if (req) {
      res.status(404).end('404');
    }
  });

  server.listen(port, () => console.log(`[${app.currentPhase()}] server listen on port ${port}`));
});
