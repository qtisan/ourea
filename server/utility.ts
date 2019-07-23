import { types } from 'mobx-state-tree';
import { ObjectID } from 'mongodb';
import { Schema } from 'mongoose';

const { ObjectId, Mixed } = Schema.Types;

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
export type PickMatching<T, V> = Pick<T, KeysMatching<T, V>>;

export type DescriptorValue =
  | typeof ObjectId
  | typeof Mixed
  | StringConstructor
  | NumberConstructor
  | DateConstructor
  | BooleanConstructor
  | typeof Buffer
  | Descriptor;
export interface Descriptor {
  [s: string]: DescriptorValue;
}

export type ValueMapping<
  T extends DescriptorValue | Descriptor,
  OID,
  MIX,
  STR,
  NUM,
  DATE,
  BOOL,
  BUFF
> = T extends typeof ObjectId
  ? OID
  : T extends typeof Mixed
  ? MIX
  : T extends StringConstructor
  ? STR
  : T extends NumberConstructor
  ? NUM
  : T extends DateConstructor
  ? DATE
  : T extends BooleanConstructor
  ? BOOL
  : T extends typeof Buffer
  ? BUFF
  : T extends Descriptor
  ? ObjectMapping<T, OID, MIX, STR, NUM, DATE, BOOL, BUFF>
  : any;

export type ObjectMapping<T extends Descriptor, OID, MIX, STR, NUM, DATE, BOOL, BUFF> = {
  [K in keyof T]: ValueMapping<T[K], OID, MIX, STR, NUM, DATE, BOOL, BUFF>
};

export type ModelTypeMapping<T extends Descriptor> = ObjectMapping<
  T,
  ObjectID,
  any,
  string,
  number,
  Date,
  boolean,
  Buffer
>;

export type StoreModelTypeMappingValue<T extends DescriptorValue> = ValueMapping<
  T,
  typeof types.identifier,
  ReturnType<typeof types.frozen>,
  typeof types.string,
  typeof types.number,
  typeof types.Date,
  typeof types.boolean,
  typeof types.null
>;
export type StoreModelTypeMapping<T extends Descriptor> = ObjectMapping<
  T,
  typeof types.identifier,
  ReturnType<typeof types.frozen>,
  typeof types.string,
  typeof types.number,
  typeof types.Date,
  typeof types.boolean,
  typeof types.null
>;

export function toStoreModelDescriptor<T extends DescriptorValue>(
  descriptor: T
): StoreModelTypeMappingValue<T> {
  let storeModelDescriptor = {} as any;
  if (descriptor === String) {
    storeModelDescriptor = types.string as StoreModelTypeMappingValue<T>;
  } else if (descriptor === Number) {
    storeModelDescriptor = types.number as StoreModelTypeMappingValue<T>;
  } else if (descriptor === ObjectId) {
    storeModelDescriptor = types.identifier as StoreModelTypeMappingValue<T>;
  } else if (descriptor === Date) {
    storeModelDescriptor = types.Date as StoreModelTypeMappingValue<T>;
  } else if (descriptor === Boolean) {
    storeModelDescriptor = types.boolean as StoreModelTypeMappingValue<T>;
  } else if (descriptor === Mixed) {
    storeModelDescriptor = types.frozen() as StoreModelTypeMappingValue<T>;
  } else if (descriptor === Buffer) {
    storeModelDescriptor = types.null as StoreModelTypeMappingValue<T>;
  } else {
    for (const k in descriptor) {
      if (descriptor.hasOwnProperty(k)) {
        (storeModelDescriptor as any)[k] = toStoreModelDescriptor((descriptor as Descriptor)[k]);
      }
    }
  }
  return storeModelDescriptor as StoreModelTypeMappingValue<T>;
}

// example:

// const postDescriptor = {
//   author: ObjectId,
//   title: String,
//   read: Number,
//   publish: Date,
//   stick: Boolean,
//   comments: [{ content: String, publish: Date, author: ObjectId }],
//   likes: [ObjectId],
//   meta: {
//     tags: [String],
//     category: String,
//     links: {
//       origin: String,
//       short: String
//     }
//   }
// };

// type Post = ModelTypeMapping<typeof postDescriptor>;
// const post: Post = {
//   author: Types.ObjectId(),
//   title: 'Typescript is good!',
//   read: 1998,
//   publish: new Date(),
//   stick: false,
//   comments: [
//     { content: 'hello, i am a new typer!', publish: new Date(), author: Types.ObjectId() },
//     { content: 'it it so complex.', publish: new Date(), author: Types.ObjectId() }
//   ],
//   likes: [Types.ObjectId(), Types.ObjectId(), Types.ObjectId()],
//   meta: {
//     tags: ['javascript', 'typescript', 'microsoft'],
//     category: 'IT',
//     links: {
//       origin: 'http://someurl.com/post/29873',
//       short: 'url.g/K83jE_4'
//     }
//   }
// };
