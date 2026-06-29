import { getFormatText } from '/@/utils/str-util';
import constants from '/@/constants';

const pick = (keys, configs, field) => keys.map((key) => configs.find((item) => key === item[field]));

const omit = (keys, configs, field) => {
  return configs.filter((item) => {
    return !keys.find((key) => key === item[field]);
  });
};
export const getPickDesc = (keys, configs) => pick(keys, configs, 'key');
export const getOmitDesc = (keys, configs) => omit(keys, configs, 'key');

export const getPickColumns = (keys, configs) => pick(keys, configs, 'dataIndex');
export const getOmitColumns = (keys, configs) => omit(keys, configs, 'dataIndex');

/**
 * @method getConvertConfig
 * @description Convert between column and desc configs
 * @param {'desc' | 'column'} type
 * @param configs
 */
export const getConvertConfig = (type, configs) => {
  if (type === 'desc') {
    return configs.map(({ title, dataIndex, ...arg }) => {
      return {
        label: title,
        key: dataIndex,
        ...arg,
      };
    });
  } else {
    return configs.map(({ label, key, ...arg }) => {
      return {
        title: label,
        dataIndex: key,
        ...arg,
      };
    });
  }
};

export const getColumn = (column, unit) => {
  return {
    ellipsis: true,
    align: 'center',
    width: 200,
    customRender: ({ text }) => getFormatText(text, unit),
    ...column,
  };
};

export const muiEnumPlugin = {
  /**
   * Get the description by enum value
   * @param {*} constantName Enum name
   * @param {*} value          Enum value
   * @returns
   */
  getDescByValue: function (constantName, value) {
    if (!constants || !Object.prototype.hasOwnProperty.call(constants, constantName)) {
      console.error('Unable to find variable name: ' + constantName + ', please check whether this variable is imported in /constants/index.js!');
      return '';
    }

    let muiEnum = constants[constantName];
    for (let item in muiEnum) {
      if (muiEnum[item].value === value) {
        return muiEnum[item].desc;
      }
    }
    return '';
  },
  getValueDescList: function (constantName) {
    if (!Object.prototype.hasOwnProperty.call(constants, constantName)) {
      console.error('Unable to find constant: ' + constantName + ', please check whether it is imported in /constants/index.js!');
      return [];
    }
    const result = [];
    let targetSmartEnum = constants[constantName];
    for (let item in targetSmartEnum) {
      result.push(targetSmartEnum[item]);
    }
    return result;
  },
  getValueDesc: function (constantName) {
    if (!Object.prototype.hasOwnProperty.call(constants, constantName)) {
      console.error('Unable to find constant: ' + constantName + ', please check whether it is imported in /constants/index.js!');
      return {};
    }
    let muiEnum = constants[constantName];
    let result = {};

    for (let item in muiEnum) {
      let key = muiEnum[item].value + '';
      result[key] = muiEnum[item].desc;
    }
    return result;
  },
};
