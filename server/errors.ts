import { caught, Exception, isError, isException } from 'phusis';

const errors: { [code: number]: string } = {
  500: 'unkonwn error occured',
  550: 'application runs error',

  400: 'credentials not correct',
  431: 'access_token expired',
  432: 'refresh_token expired',
  440: 'user not found',

  600: "some error found in user's query",
  601: 'no this action in service',

  900: 'unbelievable error',
  901: 'unexpected error'
};

export const makeError = (code?: number, error?: Error | Exception): Exception => {
  const co = code || 500;
  const msg = `${errors[co]} (${co})`;
  return error ? caught(error, msg, co) : caught(msg, co);
};

export const errswitch = (e: Error | Exception, ...codes: number[]): Exception => {
  let ex: Exception;
  if (isError(e)) {
    ex = makeError(500, e as Error);
  } else if (isException(e)) {
    ex = e as Exception;
  } else {
    ex = makeError(900);
  }
  for (const c of codes) {
    if (c === ex.code) {
      return ex;
    }
  }
  return makeError(901, e);
};
