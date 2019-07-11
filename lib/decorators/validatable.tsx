import Schema, { ValidateErrorObject, ValidateRules } from 'async-validator';
import { observable } from 'mobx';
import { IReactComponent, IWrappedComponent } from 'mobx-react';
import { createElement, forwardRef, PropsWithChildren } from 'react';

export type VilidateTrigger =
  | 'onChange'
  | 'onBlur'
  | 'onMouseOver'
  | 'onMouseMove'
  | 'onMouseOut'
  | 'onEnter'
  | 'onLeave';
export type ValidateField = {
  value: any;
} & ValidateErrorObject & {
    options: IRegisterOptions | null;
  };
export type ValidateFields = ValidateField[];

export interface IRegisterOptions {
  rules?: ValidateRules;
  defaultValue?: any;
  valuePropName?: string;
  validateTrigger?: VilidateTrigger;
  validateDefaultValue?: boolean;
  handleValue?: (value: any) => any | null;
}

export class Validator {
  @observable values: ValidateFields = [];
  validateEngine: Schema = new Schema({});
  descriptor: { [fieldName: string]: ValidateRules } = {};
  filterFields = (fields?: string[]) => {
    const vs = this.values;
    if (fields) {
      return vs.filter((x) => fields.indexOf(x.field) !== -1);
    } else {
      return vs;
    }
  };
  getField = (field: string): ValidateField | null => {
    const v = this.values.find((x) => x.field === field);
    return v || null;
  };
  getFieldValue = (field: string): any => {
    const v = this.getField(field);
    if (v) {
      if (v.options && v.options.handleValue) {
        return v.options.handleValue(v.value);
      }
      return v.value;
    }
    return null;
  };
  getFieldOriginalValue = (field: string): any => {
    const v = this.getField(field);
    return v && v.value;
  };
  getFieldError = (field: string): string => {
    const v = this.getField(field);
    return v ? v.message : '';
  };
  getFieldErrors = (fields?: string[]): string[] => {
    return this.filterFields(fields).reduce(
      (o: string[], f: ValidateField) => (f.message ? [...o, f.message] : o),
      []
    );
  };
  setField = (
    field: string,
    value: any = null,
    options: IRegisterOptions | null = null,
    message: string = ''
  ): ValidateField => {
    let v = this.getField(field);
    if (v) {
      v.value = value == null ? v.value : value;
      v.message = message;
      v.options = options == null ? v.options : options;
    } else {
      v = { field, value, options, message };
      this.values.push(v);
    }
    return v;
  };
  setError = (field: string, message: string) => {
    this.setField(field, null, null, message);
  };
  getFieldValues = (fields?: string[], original: boolean = false) => {
    return this.filterFields(fields).reduce(
      (o, c) => ({
        ...o,
        [c.field]:
          (!original && c.options && c.options.handleValue && c.options.handleValue(c.value)) ||
          c.value
      }),
      {}
    );
  };
  register = (field: string, options: IRegisterOptions) => {
    const {
      defaultValue = '',
      valuePropName = 'value',
      validateTrigger = 'onChange',
      validateDefaultValue = false,
      rules = {}
    } = options;
    if (!this.getField(field)) {
      this.descriptor = { ...this.descriptor, [field]: rules };
      this.validateEngine.define(this.descriptor);
      this.setField(field, defaultValue, options);
      if (validateDefaultValue) {
        setTimeout(() => this.validate(field), 500);
      }
    }
    return {
      name: field,
      onChange: (e: any) => {
        const newValue = e.target.value;
        if (validateTrigger === 'onChange') {
          this.validate(field, newValue);
        } else {
          this.setField(field, newValue, null, '');
        }
      },
      [valuePropName]: this.getFieldOriginalValue(field) || '',
      ...(validateTrigger !== 'onChange'
        ? {
            [validateTrigger]: () => {
              this.validate(field);
            }
          }
        : {})
    };
  };
  validate = (
    field: string,
    value?: any,
    callback?: (err: ValidateErrorObject[] | null) => void
  ) => {
    const f = this.setField(field, value);
    if (f) {
      const self = this;
      new Schema({ [field]: (f.options && f.options.rules) || {} }).validate(
        { [field]: f.value },
        (err) => {
          if (err && err.length) {
            self.setError(err[0].field, err[0].message);
          } else {
            self.setError(field, '');
          }
          if (callback) {
            callback(err);
          }
        }
      );
    }
  };
  validateAll = (): Promise<boolean> => {
    return new Promise((resolve) => {
      this.validateEngine.validate(this.getFieldValues(undefined, true), (err) => {
        if (Array.isArray(err)) {
          this.values.forEach((v) => {
            const e = err.find((x) => x.field === v.field);
            if (e) {
              this.setError(v.field, e.message);
            } else {
              this.setError(v.field, '');
            }
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };
}
export interface IWithValidationProps {
  validation: Validator;
}
export type WithValidationComponent<P> = IReactComponent<P & IWithValidationProps> &
  IWrappedComponent<P> & { isMobxInjector: boolean };

export interface IValidationOptions {
  // FUTURE: some options
}

export default function validatable<P>(options?: IValidationOptions) {
  // FUTURE: do something with options
  return <C extends IReactComponent<P>>(
    componentClass: C
  ): C & (C extends IReactComponent<infer X> ? WithValidationComponent<X> : never) => {
    const Injector = forwardRef((props: PropsWithChildren<P>, ref: any) => {
      const newProps = {
        ...props,
        validator: new Validator(),
        ref
      };
      return createElement(componentClass, newProps);
    });
    Object.assign(Injector, {
      isMobxInjector: true,
      wrappedComponent: componentClass
    });
    Injector.displayName = `validatable(${componentClass.displayName ||
      componentClass.name ||
      (componentClass.constructor && componentClass.constructor.name) ||
      'Component'})`;
    return Injector as any;
  };
}
