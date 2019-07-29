import { connect, Document, model, Model, models, Schema } from 'mongoose';
import config from '../../lib/config';

import { ModelTypeMapping } from 'server/utility';
import { tokenDescriptor as token } from './descriptor/token';
import { userDescriptor as user } from './descriptor/user';

// NOTE: enum the database models.
const descriptors = {
  user,
  token
};
export type ModelEnum = keyof typeof descriptors;
export type DescriptorType<M extends ModelEnum> = (typeof descriptors)[M];
export type ModelInterface<M extends ModelEnum> = ModelTypeMapping<DescriptorType<M>>;
export type ModelType<M extends ModelEnum> = ModelInterface<M> & Document;

export type IModelPortal = Partial<{ [M in ModelEnum]: Model<ModelType<M>, {}> }>;

export const getModel = <M extends ModelEnum>(name: M): Model<ModelType<M>, {}> => {
  const m = (models as IModelPortal)[name];
  if (typeof m !== 'undefined') {
    return m as Model<ModelType<M>, {}>;
  } else {
    return model<ModelType<M>>(name, new Schema<ModelType<M>>(descriptors[name]));
  }
};

(function doConnect() {
  console.info(`>>> connecting to database...`);
  connect(
    config.dbUrl,
    { useNewUrlParser: true }
  )
    .then(() => console.info(`>>> database connected.`))
    .catch((err) => {
      console.error(`>>> connect database error, for... ${err.message}`);
      console.error(`>>> reconnect in 5 seconds...`);
      setTimeout(doConnect, 5000);
    });
})();
