/*
 * Regular expression constants
 *

 */
export const regular = {
  phone: /^\+?[1-9]\d{0,14}$/,
  contactNumber: /(^(13|14|15|16|17|18|19)\d{9}$)|(^\d{8}$)/,
  qq: /^[1-9]\d{3,}$/,
  linkUrl:
    /^(https?|http):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
  // eslint-disable-next-line no-useless-escape
  linkCheckFirst: /^(https|http:\/\/(.)*)/,
  isNumber: /(^[-1-9][1-9]*(.[1-9]+)?)$/, // Check whether it is a number, excluding 0
  isLandlineOrPhone: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, // Validate landline or mobile number
  account: /^[a-z0-9]{3,16}$/, // Please enter a 3-16 character account (lowercase letters | digits)
  mobileAccount: /^[a-z0-9]{6,16}$/, // Please enter a 6-16 character account (lowercase letters | digits) (consistent with the mobile app)
  accountDesc: 'Please enter a 3-16 character account (lowercase letters | digits)',
  pwd: /^[A-Za-z0-9._]{6,16}$/, // Please enter a 6-16 character password (upper/lowercase letters | digits | dot | underscore)
  pwdDesc: 'Please enter a 6-16 character password (upper/lowercase letters | digits | dot | underscore)',
  delBlankSpace: /\s+/g, // Remove whitespace
  isPdfReg: new RegExp(/\.(pdf|PDF)/),
  isElseFileReg: new RegExp(/\.(doc|docx|xls|xlsx|txt|ppt|pptx|pps|ppxs)/),
  isIdentityCard: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/, // Validate ID card number
  isChinese: /^[\u4e00-\u9fa5]+$/gi, // Validate whether the text is Chinese characters
  isEmail: /^[a-zA-Z0-9._%+-]+@(?!([a-zA-Z0-9-]+\.)*(gmail|yahoo|hotmail|outlook|qq|163|126|sina|foxmail)\.com$)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  companyEmail:
    /(^[a-zA-Z0-9._%+-]+@(?!gmail\.com)(?!qq\.com)(?!163\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)/,
};
