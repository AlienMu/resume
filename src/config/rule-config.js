import { message } from 'ant-design-vue';
import { regular } from '/@/constants/regular-const.js';

export const getBasicRules = (types, name, trigger = 'blur') => {
  const strategyConfig = {
    required: () => {
      return { required: true, message: name + ' is required', trigger };
    },
    max: () => {
      return { max: 500, message: name + ' cannot exceed 500 characters', trigger };
    },
    number: () => {
      return { pattern: regular.isNumber, message: 'Please enter numbers only', trigger };
    },
    min: () => {
      return { pattern: /^\+?[1-9][0-9]*$/, trigger, message: 'Must be an integer greater than 0' };
    },
    // Regex for positive numbers (including 0, up to two decimal places):
    positiveNumber: () => {
      return { pattern: /^(([1-9]\d*)(\.\d+)?)$|^((0)(\.\d+)?)$/, trigger, message: 'Please enter a positive number' };
    },
    phone: () => {
      return {
        pattern: regular.phone,
        message: 'Invalid phone number',
        trigger,
      };
    },
    price: () => {
      return {
        validator: (rule, value) => {
          return new Promise((resolve, reject) => {
            if (value > 0) {
              resolve();
            } else {
              reject(name + ' must be greater than 0');
            }
          });
        },
      };
    },
    email: () => {
      return {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email address',
        trigger,
      };
    },
    website: () => {
      return {
        pattern: regular.linkUrl,
        message: 'Invalid URL',
        trigger,
      };
    },
    idCard() {
      return { pattern: regular.isIdentityCard, message: 'Invalid ID card format', trigger };
    },
    minFixed() {
      return { pattern: /^\d+([.]\d{1,2})?$/, message: name + ' can only have up to two decimal places', trigger };
    },
    telegram: () => {
      return {
        validator: (_, value) => {
          if (!value) return Promise.resolve();
          if (!/^@[a-zA-Z0-9_]{5,32}$/.test(value)) {
            return Promise.reject(new Error('Telegram ID must start with @ and be 5-30 characters long, using only letters, numbers, and underscores'));
          }
          return Promise.resolve();
        },
        trigger,
      };
    },
  };
  return types.reduce((previousValue, currentValue) => {
    return [...previousValue, strategyConfig[currentValue]()];
  }, []);
};
