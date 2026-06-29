import axios from '/@/lib/axios';

/**
 * 邀请中心 API 列表
 * 数据来源：`默认模块.openapi.json` 中的 `08-邀请用户中心接口`
 * 每个方法都保持旧的导出签名，便于现有业务直接引用。
 */

// -------------------------------
// 收益 & 提现 Earnings & Withdraw
// -------------------------------

/**
 * 【邀请中心】【我的收益】收益明细列表
 * 分页检索收益流水，支持时间区间筛选。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页（必填，默认 1）
 * @param {number} params.size 每页数量（必填，默认 10）
 * @param {string} [params.startTime] 开始日期，格式 `yyyy-MM-dd`
 * @param {string} [params.endTime] 结束日期，格式 `yyyy-MM-dd`
 * @returns {Promise<AxiosResponse<ResultPageResultEarningsDetailResponse>>}
 */
export const getEarningsDetails = (params) =>
  axios.request({
    method: 'get',
    url: `/api/invite/earnings/details`,
    params,
  });

/**
 * 【邀请中心】【我的收益】收益总览
 * 汇总可提现金额、累计收益等信息。
 * @returns {Promise<AxiosResponse<ResultEarningsOverviewResponse>>}
 */
export const getEarningsOverview = () =>
  axios.request({
    method: 'get',
    url: `/api/invite/earnings/overview`,
  });

/**
 * 我的收益统计
 * 获取收益统计指标，如总邀请数、奖励占比等。
 * @returns {Promise<AxiosResponse<ResultEarningsStatisticsResponse>>}
 */
export const getEarningsStatistics = () =>
  axios.request({
    method: 'get',
    url: `/api/invite/earnings/statistics`,
  });

/**
 * 【邀请中心】【我的收益】昨日收益
 * 返回昨日收益金额及环比。
 * @returns {Promise<AxiosResponse<ResultYesterdayEarningsResponse>>}
 */
export const getYesterdayEarnings = () =>
  axios.request({
    method: 'get',
    url: `/api/invite/earnings/yesterday`,
  });

/**
 * 【邀请中心】【我的收益】申请提现
 * 提交 USDT 提现申请。
 * @param {Object} data 请求体（ApplyWithdrawRequest）
 * @param {number} data.amount 提款金额(USDT)，最小值 0.01
 * @param {string} data.walletAddress 收款账号(USDT账号地址)
 * @param {string} data.accountType 账号类型(例如:TRC20)
 * @param {string} [data.qrcodeUrl] 收款账号地址二维码URL
 * @returns {Promise<AxiosResponse<ResultLong>>} 返回提现申请ID
 */
export const applyWithdraw = (data) =>
  axios.request({
    method: 'post',
    url: `/api/invite/withdraw/apply`,
    data,
  });

/**
 * 【邀请中心】【我的收益】提现申请列表
 * 查看提现申请历史记录。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页（必填，默认 1）
 * @param {number} params.size 每页数量（必填，默认 10）
 * @param {0|1|2|3} [params.status] 状态：0=待审核，1=已通过，2=已拒绝，3=已打款
 * @returns {Promise<AxiosResponse<ResultPageResultWithdrawResponse>>}
 */
export const getWithdrawList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/invite/withdraw/list`,
    params,
  });

/**
 * 【邀请中心】【我的收益】提现申请详情
 * 查看单条提现记录。
 * @param {number} id 提现申请 ID（路径参数）
 * @returns {Promise<AxiosResponse<ResultWithdrawResponse>>}
 */
export const getWithdrawDetail = (id) =>
  axios.request({
    method: 'get',
    url: `/api/invite/withdraw/${id}`,
  });

// -------------------------------
// 邀请好友 & 奖励 Invitation & Rewards
// -------------------------------

/**
 * 【邀请中心】【邀请好友】获取我的邀请码
 * 返回专属邀请码（需满足上传简历数量要求）。
 * @returns {Promise<AxiosResponse<ResultString>>}
 */
export const getMyInviteCode = () =>
  axios.request({
    method: 'get',
    url: `/api/invite/my-code`,
  });

/**
 * 【邀请中心】【邀请好友】我邀请的用户列表
 * 分页查看通过我的邀请码注册的用户。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页（必填，默认 1）
 * @param {number} params.size 每页数量（必填，默认 10）
 * @returns {Promise<AxiosResponse<ResultPageResultObject>>}
 */
export const getInvitees = (params) =>
  axios.request({
    method: 'get',
    url: `/api/invite/invitees`,
    params,
  });

/**
 * 邀请奖励记录列表
 * 查看邀请奖励的发放记录。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页（必填，默认 1）
 * @param {number} params.size 每页数量（必填，默认 10）
 * @param {1|2} [params.rewardType] 奖励类型：1=注册奖励，2=首次消费奖励
 * @param {0|1} [params.status] 发放状态：0=待发放，1=已发放
 * @returns {Promise<AxiosResponse<ResultPageResultInviteRewardResponse>>}
 */
export const getInviteRewards = (params) =>
  axios.request({
    method: 'get',
    url: `/api/invite/rewards`,
    params,
  });

// -------------------------------
// 简历管理 Resume Management
// -------------------------------

/**
 * 【邀请用户中心】【简历管理】已上传简历列表
 * 邀请用户查看自己上传的简历列表，包含下载次数和收益信息。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页（必填，默认 1）
 * @param {number} params.size 每页数量（必填，默认 10）
 * @returns {Promise<AxiosResponse<ResultPageResultInviteUserResumeListResponse>>}
 */
export const getInviteUserUploadedResumes = (params) =>
  axios.request({
    method: 'get',
    url: `/api/resume/invite-user/uploaded-list`,
    params,
  });

/**
 * 邀请用户-批量上传简历
 * 通过导入文件批量新增简历，通常使用 `FormData` 传输文件。
 * @param {FormData} [data] 可选的上传表单，包含一个或多个文件字段
 * @returns {Promise<AxiosResponse<ResultObject>>}
 */
export const batchUploadResumes = (data) =>
  axios.request({
    method: 'post',
    url: `/api/invite/resume/batch-upload`,
    data,
  });

/**
 * 【邀请中心】【上传简历】创建简历
 * 按照 `ResumeCreateRequest` 字段创建新简历，支持基本信息、联系方式、工作经历等。
 * @param {Object} data 请求体
 * @param {string} data.name 姓名（必填）
 * @param {string} data.phone 手机号（必填）
 * @param {string} [data.resumeName] 自定义简历名
 * @param {string} [data.jobTitle] 意向职位
 * @param {string} [data.expectedSalary] 期望薪资（字典 itemKey）
 * @param {Array<string>} [data.resumeFile] 附件 URL 列表
 * @param {0|1} [data.isPublic] 是否公开
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const createResume_1 = (data) =>
  axios.request({
    method: 'post',
    url: `/api/invite/resume/create`,
    data,
  });

/**
 * 【邀请中心】【简历管理】编辑简历
 * 根据简历 ID 覆盖更新，字段同 `createResume_1`。
 * @param {number} id 简历 ID（路径参数）
 * @param {Object} data 请求体（ResumeCreateRequest）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateResume_1 = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/invite/resume/${id}`,
    data,
  });

/**
 * 【邀请中心】【简历管理】申请调整简历价格
 * 用于申请修改简历的下载价格。
 * @param {Object} data 请求体（RequestPriceAdjustmentRequest）
 * @param {number} data.resumeId 简历 ID
 * @param {number} data.requestedPrice 申请价格（USDT，>=0.01）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const requestPriceAdjustment = (data) =>
  axios.request({
    method: 'post',
    url: `/api/invite/resume/price-adjustment`,
    data,
  });

/**
 * 【邀请中心】【简历管理】查询简历价格调整申请状态
 * 查询高价值简历申请状态及当前简历下载价格。
 * @param {Object} params 查询参数
 * @param {number} params.resumeId 简历 ID
 * @returns {Promise<AxiosResponse<ResultPriceAdjustmentStatusResponse>>}
 */
export const getPriceAdjustmentStatus = (params) =>
  axios.request({
    method: 'get',
    url: `/api/invite/resume/price-adjustment/status`,
    params,
  });

// -------------------------------
// 消息中心 Messaging
// -------------------------------

/**
 * 【邀请中心】【消息中心】消息列表
 * 分页查看系统通知、投递通知、职位推荐等消息。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页（必填，默认 1）
 * @param {number} params.size 每页数量（必填，默认 10）
 * @param {1|2|3} [params.type] 消息类型：1=系统通知，2=投递通知，3=职位推荐
 * @param {0|1} [params.isRead] 是否已读：0=未读，1=已读
 * @returns {Promise<AxiosResponse<ResultPageResultMessageListResponse>>}
 */
export const getMessages = (params) =>
  axios.request({
    method: 'get',
    url: `/api/invite/messages`,
    params,
  });
