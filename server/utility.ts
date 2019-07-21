import { Schema } from 'mongoose';

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
export type PickMatching<T, V> = Pick<T, KeysMatching<T, V>>;
export type ITypeMappingPlain<T, X> = T extends StringConstructor
  ? string
  : T extends typeof Buffer
  ? typeof Buffer
  : T extends NumberConstructor
  ? number
  : T extends DateConstructor
  ? Date
  : T extends BooleanConstructor
  ? boolean
  : T extends typeof Schema.Types.Mixed
  ? any
  : X;

export type ITypeMappingMongoose<T> = {
  [K in keyof T]: ITypeMappingPlain<
    T[K],
    T[K] extends Array<infer P> ? ITypeMappingMongoose<P> : ITypeMappingMongoose<T[K]>
  >
};
