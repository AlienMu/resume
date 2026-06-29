import axios from '/@/lib/axios';

/**
 * 01-C端用户认证接口
 * 基于 `默认模块.openapi.json` 的登录注册与账号操作集合。
 */

/**
 * 【企业注册】生成图形验证码
 * 返回 base64 图片以及验证码标识，用于企业注册流程。
 * @returns {Promise<AxiosResponse<ResultCaptchaResponse>>}
 */
export const generateCompanyCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/auth/captcha/company`,
  });

/**
 * 【邀请注册】生成图形验证码
 * 提供邀请注册专用的 4 位数图形验证码。
 * @returns {Promise<AxiosResponse<ResultCaptchaResponse>>}
 */
export const generateInviteCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/auth/captcha/invite`,
  });

/**
 * 【求职者注册】生成图形验证码
 * 获取求职者注册流程使用的验证码图片。
 * @returns {Promise<AxiosResponse<ResultCaptchaResponse>>}
 */
export const generateJobSeekerCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/auth/captcha/jobseeker`,
  });

/**
 * 【登录】生成图形验证码
 * 登录前生成验证码图片，用于防刷校验。
 * @returns {Promise<AxiosResponse<ResultCaptchaResponse>>}
 */
export const generateLoginCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/auth/captcha/login`,
  });

/**
 * 【登录】邮箱 + 验证码 + 密码登录
 * 个人和邀请用户使用邮箱登录
 * @param {Object} data 请求体（PasswordLoginRequest）
 * @param {string} data.email 登录邮箱
 * @param {string} data.password 登录密码（至少 6 位，包含字母数字）
 * @param {string} data.captcha 图形验证码
 * @param {string} data.captchaKey 验证码唯一标识
 * @returns {Promise<AxiosResponse<ResultLoginResponse>>}
 */
export const loginByPasswordWithCaptcha = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/login/email/captcha`,
    data,
  });

/**
 * 退出登录
 * 清除当前登录会话（需携带 Authorization）。
 * @param {Object} headers 额外请求头
 * @param {string} [headers.Authorization] 形如 `Bearer xxx` 的访问令牌
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const logout = (headers) =>
  axios.request({
    method: 'post',
    url: `/api/auth/logout`,
    headers,
  });

/**
 * 【忘记密码】重设密码
 * 通过手机号 / 邮箱及验证码重置密码。
 * @param {Object} data 请求体（ForgotPasswordRequest）
 * @param {string} data.countryCode 国家区号
 * @param {string} data.phone 绑定手机号
 * @param {string} data.email 账号邮箱
 * @param {string} data.code 验证码，目前固定 `123456`
 * @param {string} data.newPassword 新密码
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const forgotPassword = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/password/forgot/reset`,
    data,
  });

/**
 * 【忘记密码】发送邮件
 * 触发找回密码邮件（当前总是返回成功）。
 * @param {Object} data 请求体（SendEmailRequest）
 * @param {string} data.countryCode 国家区号
 * @param {string} data.phone 注册手机号
 * @param {string} data.email 接收验证码的邮箱
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const sendForgotPasswordEmail = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/password/forgot/send-email`,
    data,
  });

/**
 * 【企业注册】注册账号
 * 企业通过邮箱完成注册，需要图形验证码。
 * @param {Object} data 请求体（CompanyRegisterRequest）
 * @param {string} data.email 邮箱
 * @param {string} data.password 登录密码
 * @param {string} data.captcha 图形验证码
 * @param {string} data.captchaKey 验证码唯一标识
 * @param {string} [data.telegramAccount] Telegram 账号（示例：`@username`）
 * @returns {Promise<AxiosResponse<ResultLoginResponse>>}
 */
export const registerCompany = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/register/company`,
    data,
  });

/**
 * 【邀请注册】注册账号
 * 邀请用户通过邀请码 + 邮箱 + 验证码注册。
 * @param {Object} data 请求体（InviteRegisterRequest）
 * @param {string} data.inviteCode 邀请码
 * @param {string} data.email 邮箱
 * @param {string} data.password 登录密码
 * @param {string} data.captcha 图形验证码
 * @param {string} data.captchaKey 验证码唯一标识
 * @param {string} [data.telegramAccount] Telegram 账号
 * @returns {Promise<AxiosResponse<ResultLoginResponse>>}
 */
export const registerInvite = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/register/invite`,
    data,
  });

/**
 * 【求职者注册】注册账号
 * 求职者通过邮箱完成注册，需要图形验证码。
 * @param {Object} data 请求体（JobSeekerRegisterRequest）
 * @param {string} data.email 邮箱
 * @param {string} data.password 登录密码
 * @param {string} data.captcha 图形验证码
 * @param {string} data.captchaKey 验证码唯一标识
 * @param {string} [data.telegramAccount] Telegram 账号
 * @returns {Promise<AxiosResponse<ResultLoginResponse>>}
 */
export const registerJobSeeker = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/register/jobseeker`,
    data,
  });

/**
 * 校验邮箱和Telegram账号是否存在
 * 在注册前校验邮箱和Telegram账号是否已被使用
 * @param {Object} data 请求体（CheckExistenceRequest）
 * @param {string} [data.email] 邮箱
 * @param {string} [data.telegramAccount] Telegram账号
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const checkExistence = (data) =>
  axios.request({
    method: 'post',
    url: `/api/auth/check-existence`,
    data,
  });

/**
 * 获取当前登录用户信息
 * 返回用户的角色、基础资料、企业/邀请关联状态等。
 * @returns {Promise<AxiosResponse<ResultUserInfoResponse>>}
 */
export const getUserInfo = () =>
  axios.request({
    method: 'get',
    url: `/api/auth/userinfo`,
  });

/**
 * 【管理员】免密登录客户端用户
 * 管理员免密登录到客户端用户，需要管理员权限。支持两种方式：1. 传入userId直接登录；2. 传入国家码和手机号查询后登录
 * @param {Object} data 请求体（AdminLoginAsClientRequest）
 * @param {number} [data.userId] 用户ID（如果提供则直接登录该用户，否则使用国家码+手机号查询）
 * @param {string} [data.countryCode] 国家码（userId为空时必填）
 * @param {string} [data.phone] 手机号（userId为空时必填）
 * @param {string} [adminToken] 管理员token，放入Authorization头
 * @returns {Promise<AxiosResponse<ResultLoginResponse>>}
 */
export const adminLoginAsClient = (data, adminToken) =>
  axios.request({
    method: 'post',
    url: `/api/auth/admin/login-as-client`,
    data,
    headers: adminToken
      ? {
          Authorization: `Bearer ${adminToken}`,
        }
      : undefined,
  });
