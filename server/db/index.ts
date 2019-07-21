import { connect } from 'mongoose';
import config from '../../lib/config';

(function doConnect() {
  connect(
    config.dbUrl,
    { useNewUrlParser: true }
  )
    .then(() => console.info(`>>> database connected.`))
    .catch((err) => {
      console.error(`>>> connect database error, for... ${err.message}`);
      console.error(`>>> reconnect in 5 seconds.`);
      setTimeout(doConnect, 5000);
    });
})();

export { default as User } from './model/user';
export { default as Token } from './model/token';
