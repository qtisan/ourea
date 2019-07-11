

export interface ValidateMessages {
  'default'?: string; required?: string; 'enum'?: string; whitespace?: string;
  date?: { format?: string; parse?: string; invalid?: string; };
  types?: {
    string?: string; method?: string; array?: string; object?: string; number?: string; date?: string;
    boolean?: string; integer?: string; float?: string; regexp?: string; email?: string; url?: string; hex?: string;
  };
  string?: { len?: string; min?: string; max?: string; range?: string; };
  number?: { len?: string; min?: string; max?: string; range?: string; };
  array?: { len?: string; min?: string; max?: string; range?: string; };
  pattern?: { mismatch?: string; };
  clone?: () => ValidateMessages;
}
export type FormValidateType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' |
  'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';

export interface ValidateFieldsOptions {
  suppressWarning?: boolean;
  first: boolean;
  firstFields?: boolean | string[];
  force?: boolean;
  messages?: ValidateMessages;
  [s: string]: any;
}
export type ValidatorFn = (
  rule: ValidateRule,
  value: any,
  callback?: (error?: Error) => void,
  source?: ValidateRule,
  options?: ValidateFieldsOptions
) => boolean | Error | Error[] | string | undefined;

export interface ValidateErrorObject {
  field: string;
  message: string;
}

export interface ValidateRule {
  type?: FormValidateType;
  required?: boolean;
  message?: string | HTMLElement | (() => string);
  pattern?: RegExp;
  range?: { min?: number; max?: number };
  len?: number;
  role?: { type: "enum", enum: any[] };
  fields?: {
    [fieldName: string]: ValidateRule;
    [fieldIndex: number]: ValidateRule;
  };
  defaultField?: ValidateRule;
  transform?: (value: any) => any;
  asyncValidator?(rule: ValidateRule, value: any): Promise<void>;
  asyncValidator?(rule: ValidateRule, value: any, callback?: (errmsg?: string) => void,
    source?: { [fieldName: string]: any }, options?: { messages: ValidateMessages }): void;
  validator?: ValidatorFn
  [ruleOptionName: string]: any;
}

export type ValidateRules = ValidateRule | Array<ValidateRule> | ValidatorFn;
export type ValidateDescriptor = {
  [fieldName: string]: ValidateRules;
};

export default class Schema {
  constructor (descriptor: ValidateDescriptor);
  validate(val: { [fieldName: string]: any }, cb?: (err: Array<ValidateErrorObject> | null) => void): void | Promise<void>;
  define(descriptor: ValidateDescriptor): void;
}


declare module 'async-validator';
