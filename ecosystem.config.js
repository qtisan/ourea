const { join } = require('path');
const { NAME, NS } = process.env;
const LOG_PATH = `/${NS}/${NAME}/volume/logs`;

module.exports = {
  apps: [
    {
      name: NAME,
      script: 'npm',
      args: 'start',
      log: join(LOG_PATH, 'server.log'),
      output: join(LOG_PATH, 'output.log'),
      error: join(LOG_PATH, 'error.log'),
      port: 8000,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
