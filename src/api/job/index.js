import axios from '/@/lib/axios';

/**
 * 03-职位管理接口
 * 包含企业职位管理、公共职位检索与收藏等 API。
 */

// -------------------------------
// 企业职位管理
// -------------------------------

/**
 * 【招聘管理】添加职位
 * 企业在控制台创建新职位（需先完善企业信息）。
 * @param {Object} data 请求体（CompanyJobPublishRequest）
 * @param {string} data.jobTitle 职位名称
 * @param {string} [data.expiredAt] 招聘截止日期
 * @param {string} [data.industry] 所属产业（字典 itemKey）
 * @param {string} [data.jobCategory] 职位分类（字典 itemKey）
 * @param {string} [data.salaryRange] 薪资区间（字典 itemKey）
 * @param {string} [data.recruitmentNumber] 招聘人数（字典 itemKey）
 * @param {string} [data.jobNature] 工作方式（字典 itemKey）
 * @param {string} [data.workLocation] 工作地点（三级字典 key）
 * @param {string} [data.resumeEmail] 简历接收邮箱
 * @param {string} [data.workExperience] 经验要求（字典 itemKey）
 * @param {string} [data.education] 学历要求（字典 itemKey）
 * @param {string[]} [data.languageRequirements] 语言要求数组
 * @param {string[]} [data.nationalityRequirements] 国籍要求数组
 * @param {string} [data.jobDescription] 岗位描述（富文本）
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const addJob = (data) =>
  axios.request({
    method: 'post',
    url: `/api/job/company/add`,
    data,
  });

/**
 * 【招聘管理】【职位列表】添加草稿职位
 * 草稿职位 status=4，仅保存，不发布。
 * @param {Object} data 请求体（CompanyJobPublishRequest）
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const addDraftJob = (data) =>
  axios.request({
    method: 'post',
    url: `/api/job/company/add-draft`,
    data,
  });

/**
 * 【招聘管理】职位列表
 * 查看企业发布的职位并支持按名称 / 状态过滤。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.jobTitle] 职位名称（模糊）
 * @param {0|1|2} [params.status] 状态：0=关闭，1=招聘中，2=暂停
 * @returns {Promise<AxiosResponse<ResultPageResultCompanyJobListResponse>>}
 */
export const getCompanyJobList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/job/company/list`,
    params,
  });

/**
 * 【招聘管理】职位详情
 * 企业内部查看职位详情。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultJobDetailResponse>>}
 */
export const getJobDetail = (id) =>
  axios.request({
    method: 'get',
    url: `/api/job/company/${id}`,
  });

/**
 * 【招聘管理】编辑职位
 * 覆盖式更新职位信息。
 * @param {number} id 职位 ID
 * @param {Object} data 请求体（CompanyJobPublishRequest）
 * 字段同 `addJob`
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const editJob = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/job/company/${id}`,
    data,
  });

/**
 * 【招聘管理】暂停职位
 * 将职位状态调整为暂停。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const pauseJob = (id) =>
  axios.request({
    method: 'post',
    url: `/api/job/company/${id}/pause`,
  });

/**
 * 【招聘管理】推广职位
 * 将职位推广到首页，需扣除 USDT。
 * @param {number} id 职位 ID
 * @param {Object} [data] 请求体
 * @param {number} [data.days] 自动推广天数
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const promoteJob = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/job/company/${id}/promote`,
    data,
  });

/**
 * 【招聘管理】刷新职位（付费版）
 * 刷新职位排序并扣费。
 * @param {number} id 职位 ID
 * @param {Object} [data] 请求体
 * @param {number} [data.days] 自动刷新天数
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const refreshJobWithPayment = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/job/company/${id}/refresh`,
    data,
  });

/**
 * 【招聘管理】重新发布职位
 * 对已关闭或暂停的职位再次上线。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const republishJob = (id) =>
  axios.request({
    method: 'post',
    url: `/api/job/company/${id}/republish`,
  });

// -------------------------------
// C 端职位检索 & 收藏
// -------------------------------

/**
 * 热门职位列表
 * 获取热门职位的分页数据。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultWithTopCategories>>}
 */
export const getHotJobs = (params) =>
  axios.request({
    method: 'get',
    url: `/api/job/hot`,
    params,
  });

/**
 * 职位列表 - 多条件筛选
 * 面向求职者的职位检索接口。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.jobCategory] 职位类别
 * @param {string} [params.city] 城市
 * @param {string} [params.salaryRange] 薪资范围
 * @param {1|2|3} [params.jobType] 工作类型
 * @param {string} [params.education] 学历
 * @param {number} [params.workYears] 工作年限
 * @param {string} [params.keyword] 模糊关键词
 * @param {0|1} [params.isHot] 是否热门
 * @param {0|1} [params.isUrgent] 是否急聘
 * @returns {Promise<AxiosResponse<ResultPageResultJobListResponse>>}
 */
export const listJobs = (params) =>
  axios.request({
    method: 'get',
    url: `/api/job/list`,
    params,
  });

/**
 * 我的收藏职位
 * 返回当前用户收藏夹中的职位。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultJobListResponse>>}
 */
export const getMyCollections = (params) =>
  axios.request({
    method: 'get',
    url: `/api/job/my-collections`,
    params,
  });

/**
 * 推荐职位列表
 * 基于求职者简历推荐匹配职位。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultJobListResponse>>}
 */
export const getRecommendJobs = (params) =>
  axios.request({
    method: 'get',
    url: `/api/job/recommend`,
    params,
  });

/**
 * 举报职位
 * 举报职位信息异常或违规内容。
 * @param {number} id 职位 ID
 * @param {Object} data 请求体（JobReportRequest）
 * @param {number} data.jobId 职位 ID（与路径参数一致）
 * @param {string} data.reason 举报原因
 * @param {string} [data.description] 举报详情
 * @param {string[]} [data.images] 证明材料 URL 数组
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const reportJob = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/job/${id}/report`,
    data,
  });

/**
 * 收藏职位
 * 将职位加入个人收藏。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const collectJob = (id) =>
  axios.request({
    method: 'post',
    url: `/api/job/${id}/collect`,
  });

/**
 * 取消收藏职位
 * 从收藏夹移除职位。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const uncollectJob = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/job/${id}/collect`,
  });

/**
 * 【找工作】立即洽谈
 * 点击立即洽谈，获取HR的Telegram联系方式并自动投递简历。
 * @param {number} id 职位 ID
 * @param {Object} [data] 请求体（JobNegotiateRequest）
 * @param {number} [data.resumeId] 简历ID（可选，不传则使用最近更新的简历）
 * @returns {Promise<AxiosResponse<ResultJobNegotiateResponse>>}
 */
export const negotiateJob = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/job/${id}/negotiate`,
    data,
  });

// -------------------------------
// 公共职位 CRUD
// -------------------------------

/**
 * 发布职位（公共）
 * 面向平台运营的职位创建接口。
 * @param {Object} data 请求体（JobPublishRequest）
 * @param {string} data.jobTitle 职位名称
 * @param {string} data.jobCategory 职位类别
 * @param {1|2|3} data.jobType 工作类型：1=全职，2=兼职，3=实习
 * @param {number} data.salaryMin 薪资下限（K）
 * @param {number} data.salaryMax 薪资上限（K）
 * @param {number} [data.salaryMonth] 年终 / 额外薪资月数
 * @param {number} [data.workYearsMin] 最少经验年限
 * @param {number} [data.workYearsMax] 最大经验年限
 * @param {string} [data.educationRequired] 学历要求
 * @param {string} data.city 工作城市
 * @param {string} [data.district] 区县
 * @param {string} [data.address] 详细地址
 * @param {string} data.description 职位描述
 * @param {string} [data.requirements] 任职要求
 * @param {string[]} [data.highlights] 职位亮点
 * @param {string[]} [data.benefits] 福利待遇
 * @param {number} [data.recruitCount] 招聘人数
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const publishJob = (data) =>
  axios.request({
    method: 'post',
    url: `/api/job/publish`,
    data,
  });

/**
 * 职位详情（公共端）
 * 根据职位 ID 获取详情。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultJobDetailResponse>>}
 */
export const getJobDetail1 = (id) =>
  axios.request({
    method: 'get',
    url: `/api/job/${id}`,
  });

/**
 * 更新职位（公共端）
 * 覆盖式更新职位信息。
 * @param {number} id 职位 ID
 * @param {Object} data 请求体（JobPublishRequest）
 * 字段同 `publishJob`
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateJob = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/job/${id}`,
    data,
  });

/**
 * 删除职位
 * 完全删除一条公开职位。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteJob = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/job/${id}`,
  });

/**
 * 刷新职位（公共端）
 * 刷新公开职位排序。
 * @param {number} id 职位 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const refreshJob_1 = (id) =>
  axios.request({
    method: 'post',
    url: `/api/job/${id}/refresh`,
  });

/**
 * 更新职位状态（公共端）
 * 切换职位为招聘中 / 暂停 / 关闭。
 * @param {number} id 职位 ID
 * @param {Object} data 请求体（UpdateJobStatusRequest）
 * @param {0|1|2} data.status 状态：0=关闭，1=招聘中，2=暂停
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateJobStatus = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/job/${id}/status`,
    data,
  });
