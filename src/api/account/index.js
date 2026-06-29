import axios from '/@/lib/axios';

/**
 * 统一账号设置 API
 * 所有用户中心账号设置相关接口在此集中维护，避免在 invite / user-center 等模块重复定义。
 */

/**
 * 获取账号设置
 * @returns {Promise<AccountSettingsResponse>}
 */
export const getAccountSettings = () =>
  axios.request({
    method: 'get',
    url: `/api/user-center/account-settings`,
  });

/**
 * 更新账号设置
 * @param {{ avatar?: string; englishName?: string; position?: string; phone?: string; phonePublic?: number; email?: string; telegramAccount?: string }} data
 */
export const updateAccountSettings = (data) =>
  axios.request({
    method: 'put',
    url: `/api/user-center/account-settings`,
    data,
  });

/**
 * 上传头像（保持与旧接口兼容）
 */
export const uploadAvatar = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/avatar`,
    data,
  });

/**
 * 获取英文名修改验证码
 */
export const generateEnglishNameCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/user-center/captcha/english-name`,
  });

/**
 * 修改英文名
 * @param {{ englishName: string; captchaKey: string; captcha: string }} data
 */
export const updateEnglishName = (data) =>
  axios.request({
    method: 'put',
    url: `/api/user-center/english-name`,
    data,
  });

/**
 * 获取绑定邮箱图形验证码
 */
export const generateEmailBindCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/user-center/captcha/email-bind`,
  });

/**
 * 发送绑定邮箱验证码
 * @param {{ email: string }} data
 */
export const sendBindEmailCode = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/email/bind/send-code`,
    data,
  });

/**
 * 绑定邮箱（需验证码 + 图形验证码）
 * @param {{ email: string; emailCode: string; captchaKey: string; captcha: string }} data
 */
export const bindEmailWithCaptcha = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/email/bind-with-captcha`,
    data,
  });

/**
 * 获取修改邮箱图形验证码
 */
export const generateEmailChangeCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/user-center/captcha/email-change`,
  });

/**
 * 发送旧邮箱验证码
 * @param {{ email: string }} data
 */
export const sendOldEmailCode = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/email/change/send-old-email`,
    data,
  });

/**
 * 修改邮箱
 * @param {{ oldEmail: string; oldEmailCode: string; newEmail: string; captchaKey: string; captcha: string }} data
 */
export const changeEmail = (data) =>
  axios.request({
    method: 'put',
    url: `/api/user-center/email/change`,
    data,
  });

/**
 * 获取绑定邮箱后的验证验证码
 */
export const sendEmailVerifyCode = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/email/verify/send-code`,
    data,
  });

/**
 * 验证邮箱
 * @param {{ email: string; code: string }} data
 */
export const verifyEmail = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/email/verify`,
    data,
  });

/**
 * 获取修改密码图形验证码
 */
export const generatePasswordCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/user-center/captcha/password`,
  });

/**
 * 发送修改密码邮箱验证码
 * @param {{ email: string }} data
 */
export const sendPasswordChangeEmailCode = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/password/change/send-email`,
    data,
  });

/**
 * 修改登录密码
 * @param {{ email: string; emailCode: string; newPassword: string; captchaKey: string; captcha: string }} data
 */
export const changePassword = (data) =>
  axios.request({
    method: 'put',
    url: `/api/user-center/password/change`,
    data,
  });
