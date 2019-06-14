/**
* 解析JSON方法，防止Error抛出，无效则返回null
* @author lennon
* @param str String，需要解析的JSON字符串
* @return Object 解析后的对象
**/
export const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};

/**
* 驼峰式命名法转换为连字符命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
export const camelToHyphenate = (name) => {
  return parseCamel(name).join('-');
};

/**
* 连字符命名法转换为驼峰式命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
export const hyphenateToCamel = (name) => {
  return parseConnector(name, '-');
};

/**
* 下划线命名法转换为驼峰式命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
export const underscoreToCamel = (name) => {
  return parseConnector(name, '_');
};

/**
* 驼峰式命名法转换为下划线命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
export const camelToUnderscore = (name) => {
  return parseCamel(name).join('_');
};

/**
* 连字符命名法转换为下划线命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
export const hyphenateToUnderscore = (name) => {
  return name.split('-').join('_');
};

/**
* 下划线命名法转换为连字符命名法
* @author lennon
* @param name String，需要转换的变量名
* @return String 转换后的变量名
**/
export const underscoreToHyphenate = (name) => {
  return name.split('_').join('-');
};

function parseCamel(name) {
  const result = []; let start = 0;
  name += 'A';
  for (let i = 0; i < name.length; i++) {
    if (name[i].toLowerCase() !== name[i] || i === name.length - 1) {
      result.push(name.substring(start, i).toLowerCase());
      start = i;
    }
  }
  return result;
}

function parseConnector(name, connector) {
  const result = name.split(connector);
  for (let i = 0; i < result.length; i++) {
    if (i !== 0) {
      const v = result[i];
      result[i] = v[0].toUpperCase() + v.slice(1);
    }
  }
  return result.join('');
}
