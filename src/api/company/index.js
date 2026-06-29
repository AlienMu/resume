import axios from '/@/lib/axios';

/**
 * 04-企业管理接口
 * 覆盖企业资料、财务、简历处理及储值方案等 API。
 */

// -------------------------------
// 企业资产 & 基础信息
// -------------------------------

/**
 * 获取企业账户余额
 * 查询当前企业账户 USDT 余额。
 * @returns {Promise<AxiosResponse<ResultDouble>>}
 */
export const getCompanyBalance = () =>
  axios.request({
    method: 'get',
    url: `/api/company/balance`,
  });

/**
 * 创建 / 完善企业信息
 * 企业管理员首次录入企业资料或补全信息。
 * @param {Object} data 请求体（CompanyRequest）
 * @param {string} data.companyName 企业名称
 * @param {string} [data.logo] LOGO 图片 URL
 * @param {string} [data.industry] 所属行业
 * @param {string} [data.companySize] 企业规模（字典 itemKey）
 * @param {string} [data.financingStage] 融资阶段
 * @param {string} [data.address] 办公地址
 * @param {string} [data.province] 省份
 * @param {string} [data.city] 城市
 * @param {string} [data.district] 区县
 * @param {string} [data.website] 企业官网
 * @param {string} [data.introduction] 企业介绍
 * @param {string} [data.companyTags] 公司标签 JSON 数组字符串
 * @param {string} [data.welfareImages] 食宿福利图片 JSON 数组
 * @param {string} [data.companyImages] 企业风采图片 JSON 数组
 * @param {string} [data.businessLicense] 营业执照图片 URL
 * @param {string} [data.contactPerson] 联系人
 * @param {string} [data.contactPhone] 联系电话
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const createCompany = (data) =>
  axios.request({
    method: 'post',
    url: `/api/company/create`,
    data,
  });

/**
 * 获取企业信息（6 大模块）
 * 返回招聘管理员、企业介绍、福利、风采等模块化信息。
 * @returns {Promise<AxiosResponse<ResultCompanyInfoResponse>>}
 */
export const getCompanyInfo = () =>
  axios.request({
    method: 'get',
    url: `/api/company/info`,
  });

/**
 * 保存 / 更新企业信息（6 大模块）
 * 若不存在则新增，存在则整体更新。
 * @param {Object} data 请求体（CompanyInfoRequest）
 * @param {string} data.companyName 企业名称
 * @param {string} [data.companyLogo] LOGO URL
 * @param {string} [data.industry] 所属产业字典 key
 * @param {string} [data.companySize] 企业规模字典 key
 * @param {string[]} [data.companyBenefits] 企业福利字典 key 列表
 * @param {string} [data.companyIntroduction] 企业介绍（富文本）
 * @param {string[]} [data.welfareImages] 食宿福利图片地址
 * @param {string[]} [data.companyShowcaseImages] 企业风采图片地址
 * @param {string} [data.managerEnglishName] 招聘管理员英文名
 * @param {string} [data.managerOccupation] 职务
 * @param {number} [data.managerGender] 性别：0=女，1=男
 * @param {string} [data.managerTelegramAccount] Telegram 账号
 * @param {string[]} [data.managerOtherAccounts] 其他联系方式（JSON 数组）
 * @param {string} [data.managerAvatar] 管理员头像 URL
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const saveOrUpdateCompanyInfo = (data) =>
  axios.request({
    method: 'post',
    url: `/api/company/info`,
    data,
  });

/**
 * 企业列表 - 分页查询
 * 支持行业、城市、规模、融资阶段与关键词过滤。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.industry] 行业
 * @param {string} [params.city] 城市
 * @param {string} [params.companySize] 企业规模
 * @param {string} [params.financingStage] 融资阶段
 * @param {string} [params.keyword] 模糊搜索项
 * @returns {Promise<AxiosResponse<ResultPageResultCompanyDetailResponse>>}
 */
export const listCompanies = (params) =>
  axios.request({
    method: 'get',
    url: `/api/company/list`,
    params,
  });

/**
 * 获取我所在企业详情
 * 返回当前登录用户所属企业的详细资料。
 * @returns {Promise<AxiosResponse<ResultCompanyDetailResponse>>}
 */
export const getMyCompany = () =>
  axios.request({
    method: 'get',
    url: `/api/company/my`,
  });

/**
 * 企业详情
 * 查询任意企业的公开详情。
 * @param {number} id 企业 ID
 * @returns {Promise<AxiosResponse<ResultCompanyDetailResponse>>}
 */
export const getCompanyDetail = (id) =>
  axios.request({
    method: 'get',
    url: `/api/company/${id}`,
  });

/**
 * 更新企业信息
 * 覆盖式更新企业详情字段。
 * @param {number} id 企业 ID
 * @param {Object} data 请求体（CompanyRequest）
 * 同 `createCompany` 字段定义
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateCompany = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/company/${id}`,
    data,
  });

/**
 * 获取企业职位列表
 * 查看企业发布的职位，含分页。
 * @param {number} id 企业 ID
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultJobListResponse>>}
 */
export const getCompanyJobs = (id, params) =>
  axios.request({
    method: 'get',
    url: `/api/company/${id}/jobs`,
    params,
  });

/**
 * 上传营业执照
 * 上传企业营业执照文件（通常使用 FormData）。
 * @param {number} id 企业 ID
 * @returns {Promise<AxiosResponse<ResultFileUploadResponse>>}
 */
export const uploadBusinessLicense = (id) =>
  axios.request({
    method: 'post',
    url: `/api/company/${id}/license`,
  });

/**
 * 上传企业 LOGO
 * 上传企业 LOGO 图片。
 * @param {number} id 企业 ID
 * @returns {Promise<AxiosResponse<ResultFileUploadResponse>>}
 */
export const uploadLogo = (id) =>
  axios.request({
    method: 'post',
    url: `/api/company/${id}/logo`,
  });

// -------------------------------
// 财务 & 套餐
// -------------------------------

/**
 * 财务流水列表
 * 按时间范围查询企业的充值 / 消费流水。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {number} [params.type] 类型：1=充值，2=消费，3=邀请奖励，4=提现
 * @param {string} [params.startTime] 开始时间（yyyy-MM-dd HH:mm:ss）
 * @param {string} [params.endTime] 结束时间（yyyy-MM-dd HH:mm:ss）
 * @returns {Promise<AxiosResponse<ResultPageResultFinanceTransactionListResponse>>}
 */
export const getFinanceTransactionList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/company/finance/transactions`,
    params,
  });

/**
 * 我的套餐明细
 * 返回招聘套餐剩余次数与使用详情。
 * @returns {Promise<AxiosResponse<ResultCompanyPackageDetailResponse>>}
 */
export const getCompanyPackageDetail = () =>
  axios.request({
    method: 'get',
    url: `/api/company/package/detail`,
  });

/**
 * 获取储值方案单价
 * 查看职位发布 / 推广 / 刷新、联系方式的单价与折扣。
 * @returns {Promise<AxiosResponse<ResultStoragePriceResponse>>}
 */
export const getStoragePrices = () =>
  axios.request({
    method: 'get',
    url: `/api/company/storage/prices`,
  });

/**
 * 计算储值金额
 * 根据选购数量返回原价、折扣价及预下单号。
 * @param {Object} data 请求体（CalculateStoragePriceRequest）
 * @param {number} [data.jobPostCount] 职位发布数量
 * @param {number} [data.resumeContactCount] 查看联系方式数量
 * @param {number} [data.jobPromotionCount] 首页推广次数
 * @param {number} [data.jobRefreshCount] 职位刷新次数
 * @returns {Promise<AxiosResponse<ResultCalculateStoragePriceResponse>>}
 */
export const calculateStoragePrice = (data) =>
  axios.request({
    method: 'post',
    url: `/api/company/storage/calculate`,
    data,
  });

/**
 * 生成储值订单验证码
 * 储值下单前需要的图形验证码。
 * @returns {Promise<AxiosResponse<ResultCaptchaResponse>>}
 */
export const generateStorageCaptcha = () =>
  axios.request({
    method: 'get',
    url: `/api/company/storage/captcha`,
  });

/**
 * 创建储值订单
 * 校验验证码后生成正式订单。
 * @param {Object} data 请求体（CreateStorageOrderRequest）
 * @param {number} [data.jobPostCount] 职位发布数量
 * @param {number} [data.resumeContactCount] 查看联系方式数量
 * @param {number} [data.jobPromotionCount] 职位推广次数
 * @param {number} [data.jobRefreshCount] 刷新次数
 * @param {number} data.totalPrice 合计金额（USDT）
 * @param {string} data.captcha 验证码
 * @param {string} data.captchaKey 验证码标识
 * @param {string} data.preOrderNo 计算接口返回的预下单号
 * @returns {Promise<AxiosResponse<ResultCreateStorageOrderResponse>>}
 */
export const createStorageOrder = (data) =>
  axios.request({
    method: 'post',
    url: `/api/company/storage/order`,
    data,
  });

/**
 * 完成转账付款
 * 上传转账凭证，订单进入待审核状态。
 * @param {Object} data 请求体（CompletePaymentRequest）
 * @param {string} data.orderNo 订单号
 * @param {string} data.paymentVoucher 付款截图 URL
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const completePayment = (data) =>
  axios.request({
    method: 'post',
    url: `/api/company/storage/payment/complete`,
    data,
  });

// -------------------------------
// 简历处理
// -------------------------------

/**
 * 浏览记录
 * 查询最近浏览过的简历列表。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.keyword] 姓名或岗位关键字
 * @returns {Promise<AxiosResponse<ResultPageResultResumeBrowseHistoryResponse>>}
 */
export const getResumeBrowseHistory = (params) =>
  axios.request({
    method: 'get',
    url: `/api/company/resume/browse-history`,
    params,
  });

/**
 * 下载的简历列表
 * 查看企业已下载的简历记录。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.keyword] 姓名或岗位关键字
 * @returns {Promise<AxiosResponse<ResultPageResultDownloadedResumeListResponse>>}
 */
export const getDownloadedResumeList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/company/resume/downloaded`,
    params,
  });

/**
 * 删除下载的简历
 * 仅删除下载关系，不影响原始简历。
 * @param {number} id 下载 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteDownloadedResume = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/company/resume/downloaded/${id}`,
  });

/**
 * 查看下载的简历
 * 返回下载的简历详情并置为已查看。
 * @param {number} id 下载 ID
 * @returns {Promise<AxiosResponse<ResultResumeDetailResponse>>}
 */
export const viewDownloadedResume = (id) =>
  axios.request({
    method: 'get',
    url: `/api/company/resume/downloaded/${id}`,
  });

/**
 * 收到的简历列表
 * 查看通过职位投递收到的简历。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.keyword] 关键词（姓名或岗位）
 * @returns {Promise<AxiosResponse<ResultPageResultReceivedResumeListResponse>>}
 */
export const getReceivedResumeList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/company/resume/received`,
    params,
  });

/**
 * 删除收到的简历
 * 仅删除投递关系，不删除候选人简历。
 * @param {number} id 投递 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteReceivedResume = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/company/resume/received/${id}`,
  });

/**
 * 查看收到的简历
 * 返回投递简历详情并标记为已查看。
 * @param {number} id 投递 ID
 * @returns {Promise<AxiosResponse<ResultResumeDetailResponse>>}
 */
export const viewReceivedResume = (id) =>
  axios.request({
    method: 'get',
    url: `/api/company/resume/received/${id}`,
  });
