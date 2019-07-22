import { caught, Exception, isError, isException } from 'phusis';

const errors: { [code: number]: string } = {
  500: 'unkonwn error occured',
  550: 'application runs error',
  551: 'response data not correct',

  400: 'credentials not correct',
  431: 'access_token expired',
  432: 'refresh_token expired',
  440: 'user not found',
  441: 'username and password not match',
  442: 'user do not exist',

  600: "some error found in user's query",
  601: 'no this action in service',

  621: 'database save error',

  900: 'unbelievable error',
  901: '[critical]unexpected error'
};

export const makeError = (code?: number, error?: Error | Exception): Exception => {
  const co = code || 500;
  const msg = `[OR-${co}]${errors[co]}`;
  return error ? caught(error, msg, co) : caught(msg, co);
};

export const errswitch = (
  e: Error | Exception,
  codes: number[] | number,
  ...defaults: number[]
): Exception => {
  let ex: Exception;
  if (isError(e)) {
    ex = makeError(500, e as Error);
  } else if (isException(e)) {
    ex = e as Exception;
  } else {
    ex = makeError(900);
  }
  let codesForSwitch = codes;
  let defaultException = makeError(901, ex);
  if (!Array.isArray(codes)) {
    // call signature: errswith(err, 431, 501, 433, 901)
    codesForSwitch = [codesForSwitch as number].concat(defaults);
  } else if (defaults.length === 1) {
    // call signature: errswith(err, [431, 501, 433], 900)
    defaultException = makeError(defaults[0], ex);
  } else {
    // call signature: errswith(err, [431, 501, 433], 900, 901)
    // usage not ready.
  }
  for (const c of codesForSwitch as number[]) {
    if (c === ex.code) {
      return ex;
    }
  }
  return defaultException;
};
