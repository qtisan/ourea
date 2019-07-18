import { types } from 'mobx-state-tree';

// types not enough, and reference types not ready.
export type StoreModel<T> = {
  [k in keyof T]: (T[k] extends string
    ? (typeof types.string | typeof types.identifier)
    : (T[k] extends number
        ? (typeof types.number | typeof types.identifierNumber)
        : (T[k] extends boolean ? typeof types.boolean : any)))
};
