import axios from '/@/lib/axios';

/**
 * 05-简历投递管理接口
 * 数据来源：`默认模块.openapi.json`
 * 所有方法保持既有导出名称，方便调用方平滑升级。
 */

/**
 * 【投递管理】【求职者】投递简历
 * 使用指定简历，将本人简历投递到指定职位。
 * @param {Object} data 请求体（ApplyJobRequest）
 * @param {number} data.jobId 职位 ID
 * @param {number} data.resumeId 简历 ID
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const applyJob = (data) =>
  axios.request({
    method: 'post',
    url: `/api/application/apply`,
    data,
  });

/**
 * 【投递管理】【企业】批量更新投递状态
 * HR 批量更新多条投递记录的处理状态。
 * @param {Object} data 请求体（BatchUpdateStatusRequest）
 * @param {string} data.ids 投递 ID 集合，使用英文逗号分隔（示例：`1,2,3`）
 * @param {1|2|3|4} data.status 状态：1=待查看，2=已查看，3=已沟通，4=不合适
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const batchUpdateStatus = (data) =>
  axios.request({
    method: 'put',
    url: `/api/application/batch/status`,
    data,
  });

/**
 * 【招聘管理】【履历列表】收到的简历列表
 * HR查看收到的简历列表，返回：投递时间、投递职位、投递人、简历状态。
 * status为null时查询收到的投递履历（job_applications表），status=0表示已下载的简历列表（company_resume_downloads表），status=1表示浏览记录（resume_views表）
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页，默认 1
 * @param {number} params.size 每页条数，默认 10
 * @param {number|null|0|1} [params.status] 状态:null=收到的投递履历,0=已下载的简历列表,1=浏览记录
 * @param {string} [params.keyword] 关键词（姓名或岗位模糊搜索）
 * @returns {Promise<AxiosResponse<ResultPageResultReceivedApplicationResponse>>}
 */
export const getReceivedApplications = (params) =>
  axios.request({
    method: 'get',
    url: `/api/application/received`,
    params,
  });

/**
 * 【投递管理】【企业】投递统计
 * 汇总企业维度的投递数量及处理状态。
 * @returns {Promise<AxiosResponse<ResultApplicationStatisticsResponse>>}
 */
export const getApplicationStatistics = () =>
  axios.request({
    method: 'get',
    url: `/api/application/statistics`,
  });

/**
 * 【投递管理】【企业】投递详情
 * 查询单条投递记录的完整信息。
 * @param {number} id 投递 ID
 * @returns {Promise<AxiosResponse<ResultApplicationListResponse>>}
 */
export const getApplicationDetail = (id) =>
  axios.request({
    method: 'get',
    url: `/api/application/${id}`,
  });

/**
 * 【投递管理】【求职者】取消投递
 * 求职者主动撤回已提交的投递。
 * @param {number} id 投递 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const cancelApplication = (id) =>
  axios.request({
    method: 'put',
    url: `/api/application/${id}/cancel`,
  });

/**
 * 【投递管理】【企业】单条更新投递状态
 * HR 针对特定投递记录设置处理状态及备注。
 * @param {number} id 投递 ID
 * @param {Object} data 请求体（UpdateApplicationStatusRequest）
 * @param {1|2|3|4} data.status 状态：1=待查看，2=已查看，3=已沟通，4=不合适
 * @param {string} [data.remark] 备注，例如“候选人经验符合要求”
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateApplicationStatus = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/application/${id}/status`,
    data,
  });
