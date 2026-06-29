import axios from '/@/lib/axios';

/**
 * 07-用户中心接口
 * 聚合求职者与企业在用户中心可用的常用 API。
 */

/**
 * 用户中心 Dashboard
 * 获取首页统计信息（职位、收益、消息等）。
 * @returns {Promise<AxiosResponse<ResultDashboardResponse>>}
 */
export const getDashboard = () =>
  axios.request({
    method: 'get',
    url: `/api/user-center/dashboard`,
  });

/**
 * 财务流水
 * 企业用户查询充值 / 消费等流水。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {1|2|3|4} [params.type] 类型：1充值，2消费，3邀请奖励，4提现
 * @returns {Promise<AxiosResponse<ResultPageResultFinanceTransactionResponse>>}
 */
export const getFinanceTransactions = (params) =>
  axios.request({
    method: 'get',
    url: `/api/user-center/finance/transactions`,
    params,
  });

/**
 * 我的职位（B 端）
 * 查看本人发布的职位列表。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {0|1|2} [params.status] 职位状态：0=关闭，1=招聘中，2=暂停
 * @returns {Promise<AxiosResponse<ResultPageResultJobListResponse>>}
 */
export const getMyJobs = (params) =>
  axios.request({
    method: 'get',
    url: `/api/user-center/my-jobs`,
    params,
  });

/**
 * 我的简历（C 端）
 * 查看我创建的所有简历。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultResumeListResponse>>}
 */
export const getMyResumes = (params) =>
  axios.request({
    method: 'get',
    url: `/api/user-center/my-resumes`,
    params,
  });

/**
 * 查询简历投递岗位
 * 查看指定简历投递过的职位列表。
 * @param {number} resumeId 简历 ID
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {1|2|3|4|5} [params.status] 投递状态：1=待查看，2=已查看，3=已沟通，4=不合适，5=已取消
 * @returns {Promise<AxiosResponse<ResultPageResultResumeApplicationJobResponse>>}
 */
export const getResumeApplications = (resumeId, params) =>
  axios.request({
    method: 'get',
    url: `/api/user-center/resume/${resumeId}/applications`,
    params,
  });

/**
 * 获取套餐列表
 * 企业端可获取系统提供的充值套餐。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {1|2|3} [params.type] 套餐类型：1 查看简历，2 职位刷新，3 组合
 * @returns {Promise<AxiosResponse<ResultPageResultPackageResponse>>}
 */
export const getPackages = (params) =>
  axios.request({
    method: 'get',
    url: `/api/user-center/packages`,
    params,
  });

/**
 * 创建充值订单
 * 企业端下单充值。
 * @param {Object} data 请求体（CreateRechargeOrderRequest）
 * @param {number} [data.packageId] 套餐 ID
 * @param {number} data.amount 充值金额
 * @param {string} data.paymentMethod 支付方式：alipay / wechat
 * @returns {Promise<AxiosResponse<ResultRechargeOrderResponse>>}
 */
export const createRechargeOrder = (data) =>
  axios.request({
    method: 'post',
    url: `/api/user-center/recharge/create`,
    data,
  });

/**
 * 充值订单列表
 * 查看企业充值记录。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {0|1|2|3} [params.status] 订单状态：0 待支付，1 已支付，2 已取消，3 已退款
 * @returns {Promise<AxiosResponse<ResultPageResultRechargeOrderResponse>>}
 */
export const getRechargeOrders = (params) =>
  axios.request({
    method: 'get',
    url: `/api/user-center/recharge/orders`,
    params,
  });
