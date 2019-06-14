/* eslint-disable complexity */

const defaultEncryptOptions = {
  bit: 6,
  map: 'Q4KmX-EDCRopBTGS7as2rWVtuiYnHxz8LOPA0yZk3j6_qwehN9IlUJ51FMbvgfcd',
  cipher: 'moerae_app_cipher'
};

/**
* 加密字符串通用方法
* @author lennon
* @param origin String，要加密的字符串
* @param options.bit Number，结果中每个字符的2进制位数
* @param options.map String，每个字符对应的数位表
* @param options.cipher String，cipher值为String，则可以使用生成的key用decodeByMap方法解码，否则无法解码
* @param options.mixed Function，最终2进制串的混淆方法
* @param options.join String，作为连接字符串将key和code连在一起输出成一个字符串，null则不连接
* @return String/Object options.join为空，返回{key, code}，否则返回key+join+code，options.cipher为空，返回code
**/
export const encodeByMap = function encodeByMap(origin, options) {
  const _opts = Object.assign({
    bit: 5,
    map: 'jtzy_7qfkblovewangxum5dsrh86e3p9',
    cipher: 'moerae_crypto',
    mixed: s => s,
    join: '.'
  }, options);
  if (_opts.map.length < Math.pow(2, _opts.bit)) {
    throw new Error(`not enough characters in options.map, got ${_opts.map.length}, expected ${Math.pow(2, _opts.bit)}.`);
  }
  if (typeof _opts.mixed !== 'function') {
    throw new Error(`options.mixed must be a function, but got ${typeof _opts.mixed}.`);
  }
  let _hex = origin;
  let _str2 = '';
  let key = null;
  let code = null;
  let _last8Length = 0;
  let _last2Length = 0;
  let _keyOrigin = _opts.cipher;
  const _hexes_split8 = [];
  const _arrBit = [];
  // 若本身不是16进制串，通过Buffer转为16进制串
  if (!/^[0-9a-fA-F]+$/.test(_hex)) {
    _hex = Buffer.from(origin).toString('hex');
  }
  // 拆成n组长度为8的16进制串，转2进制串
  for (let i = 0; i < _hex.length; i += 8) {
    _hexes_split8.push(_hex.substr(i, 8));
  }
  _last8Length = _hexes_split8[_hexes_split8.length - 1].length;
  _hexes_split8.forEach((h) => {
    // 转2进制串，补足32位
    let _int2 = parseInt(h, 16).toString(2);
    while (_int2.length < 32) {
      _int2 = '0' + _int2;
    }
    _str2 += _int2;
  });

  // 若有混淆方法，混淆2进制串
  _str2 = _opts.mixed(_str2);
  // 按照options.bit位数拆分，查找option.map添加
  for (let j = 0; j < _str2.length; j += _opts.bit) {
    const _bit2 = _str2.substr(j, _opts.bit);
    _arrBit.push(_opts.map[parseInt(_bit2, 2)]);
    _last2Length = _bit2.length;
  }
  code = _arrBit.join('');
  if (typeof _keyOrigin === 'string') {
    _keyOrigin = Buffer.from(`##${_last8Length}##${_last2Length}##${_opts.cipher}`).toString('base64');
    key = _keyOrigin[_keyOrigin.length - 1] + _keyOrigin.substr(1, _keyOrigin.length - 2) + _keyOrigin[0];
    return _opts.join ? (key + _opts.join + code) : { key, code };
  } else {
    return code;
  }
};

/**
* 解密字符串通用方法
* @author lennon
* @param code String/Object，要解密的字符串
* @param options.bit Number，结果中每个字符的2进制位数
* @param options.map String，每个字符对应的数位表
* @param options.remix Function，针对encode方法中混淆方法的反混淆方法
* @param options.join String，作为连接字符串将key和code连在一起输出成一个字符串，null则不连接
* @param options.isHex String，解码后是否保持16进制，不用Buffer还原
* @return String 返回解密后的字符串
**/
export const decodeByMap = function decodeByMap(code, options) {
  const _opts = Object.assign({
    bit: 5,
    map: 'jtzy_7qfkblovewangxum5dsrh86e3p9',
    remix: s => s,
    join: '.',
    isHex: false
  }, options);
  if (_opts.map.length < Math.pow(2, _opts.bit)) {
    throw new Error(`not enough characters in options.map, got ${_opts.map.length}, expected ${Math.pow(2, _opts.bit)}.`);
  }
  if (typeof _opts.remix !== 'function') {
    throw new Error(`options.remix must be a function, but got ${typeof _opts.remix}.`);
  }
  const { bit, map, remix, join, isHex } = _opts;
  let _keyOrigin = null;
  let _codeOrigin = null;
  let _last8Length = null;
  let _last2Length = null;
  let _sparr = null;
  if (typeof code === 'object' && code.key && code.code) {
    _keyOrigin = code.key;
    _codeOrigin = code.code;
  } else if (typeof code === 'string' && typeof join === 'string') {
    const ji = code.indexOf(join);
    _keyOrigin = code.substr(0, ji);
    _codeOrigin = code.substr(ji + join.length);
  } else {
    throw new Error('code must be a object with [key] & [code] or a string join key & code with options.join!');
  }
  _keyOrigin = Buffer.from(_keyOrigin[_keyOrigin.length - 1] + _keyOrigin.substr(1, _keyOrigin.length - 2) + _keyOrigin[0],
    'base64').toString();
  _sparr = _keyOrigin.split('##');
  _last8Length = parseInt(_sparr[1]);
  _last2Length = parseInt(_sparr[2]);
  _keyOrigin = _sparr.slice(3).join('');

  let _str2 = ''; let _str16 = '';
  // 按照options.map转为2进制串
  for (let i = 0; i < _codeOrigin.length; i++) {
    let _int2 = parseInt(map.indexOf(_codeOrigin[i])).toString(2);
    while (_int2.length < ((i === _codeOrigin.length - 1) ? _last2Length : bit)) {
      _int2 = '0' + _int2;
    }
    _str2 += _int2;
  }
  // 若有反混淆方法，进行反混淆
  _str2 = remix(_str2);
  // 将2进制串按32位分组，并分别转成8位的16进制串组
  for (let j = 0; j < _str2.length; j += 32) {
    let _int16 = parseInt(_str2.substr(j, 32), 2).toString(16);
    while (_int16.length < ((_str2.length <= j + 32) ? _last8Length : 8)) {
      _int16 = '0' + _int16;
    }
    _str16 += _int16;
  }
  return isHex ? _str16 : Buffer.from(_str16, 'hex').toString();
};

export const encrypt = function (origin) {
  return encodeByMap(origin, defaultEncryptOptions);
};
export const decrypt = function (code) {
  return decodeByMap(code, defaultEncryptOptions);
};
