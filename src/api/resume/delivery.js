import axios from '/@/lib/axios';

// -------------------- C端接口 --------------------
/**
 * 【投递管理】投递简历
 * @param {Object} params 请求体（ApplyJobRequest）
 * @param {number} params.jobId 职位 ID
 * @param {number} params.resumeId 简历 ID
 * @returns {Promise<CommonResponse & { data: number }>} 返回投递 ID
 */
export const applyJob = (params) => axios.post('/api/application/apply', params);

/**
 * 【投递管理】【求职者】我的投递记录（新版）
 * 分页查看自己的投递记录，支持按状态过滤。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页，默认 1
 * @param {number} params.size 每页条数，默认 10
 * @param {1|2|3|4|5} [params.status] 投递状态：1=待查看，2=已查看，3=已沟通，4=不合适，5=已取消
 * @returns {Promise<AxiosResponse<ResultPageResultMyApplicationListResponse>>}
 */
export const getMyApplicationList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/application/my-application-list`,
    params,
  });

// -------------------- B端接口 --------------------
/**
 * 【招聘管理】【履历列表】收到的简历列表
 * HR查看收到的简历列表，返回：投递时间、投递职位、投递人、简历状态。
 * status为null时查询收到的投递履历（job_applications表），status=0表示已下载的简历列表（company_resume_downloads表），status=1表示浏览记录（resume_views表）
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {number|null|0|1} [params.status] 状态:null=收到的投递履历,0=已下载的简历列表,1=浏览记录
 * @param {string} [params.keyword] 关键词（姓名或岗位模糊搜索）
 * @returns {Promise<RecordsResult<ReceivedApplicationResponse>>}
 */
export const getReceivedApplications = (params) => axios.get('/api/application/received', params);

/**
 * 更新单个投递状态
 * @param {Object} params 请求体（UpdateApplicationStatusRequest）
 * @param {number} params.id 投递 ID
 * @param {1|2|3|4} params.status 新状态：1=待查看，2=已查看，3=已沟通，4=不合适
 * @param {string} [params.remark] 备注
 * @returns {Promise<CommonResponse>}
 */
export const updateApplicationStatus = (params) => axios.put(`/api/application/${params.id}/status`, params);

/**
 * 批量更新投递状态
 * @param {Object} params 请求体（BatchUpdateStatusRequest）
 * @param {string} params.ids 逗号分隔的投递 ID 集合
 * @param {1|2|3|4} params.status 新状态：1=待查看，2=已查看，3=已沟通，4=不合适
 * @returns {Promise<CommonResponse>}
 */
export const batchUpdateApplicationStatus = (params) => axios.put('/api/application/batch/status', params);

// -------------------- 公共接口 --------------------
/**
 * 获取投递详情
 * @param {Object} params
 * @param {number} params.id 投递 ID
 * @returns {Promise<ApplicationRecord>}
 */
export const getApplicationDetail = (params) => axios.get(`/api/application/${params.id}`, {});

/**
 * 获取投递统计数据
 * @returns {Promise<Object>} B 端统计数据对象（ResultApplicationStatisticsResponse）
 */
export const getApplicationStatistics = () => axios.get('/api/application/statistics', {});

// ==================== 数据结构 ====================
/**
 * @typedef {Object} ApplicationRecord
 * @property {number} id 投递ID
 * @property {number} jobId 职位ID
 * @property {string} jobTitle 职位名称
 * @property {number} companyId 企业ID
 * @property {string} companyName 企业名称
 * @property {string} companyLogo 企业Logo URL
 * @property {number} resumeId 简历ID
 * @property {string} userAvatar 求职者头像
 * @property {string} userName 求职者姓名
 * @property {string} userPhone 联系电话
 * @property {1|2|3|4|5} status 投递状态
 * @property {string} createdAt 投递时间
 * @property {string} [remark] HR备注
 */
