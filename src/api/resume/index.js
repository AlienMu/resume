import axios from '/@/lib/axios';

/**
 * 02-简历管理接口
 * 覆盖公开人才库、我的简历、以及教育 / 项目 / 技能等子模块操作。
 * 接口字段参考 OpenAPI 文档：http://127.0.0.1:4523/export/openapi/39?version=3.0
 */

// -------------------------------
// 创建与管理我的简历
// -------------------------------

/**
 * 创建草稿简历
 * 创建草稿简历，包含五大部分：基础信息、联系方式、求职意向、工作经历、附件履历。
 * 草稿简历状态为草稿(status=4)，不公开(is_public=0)。
 * @param {Object} data 请求体（ResumeCreateRequest）
 * @param {string} [data.resumeName] 简历名称(不填则自动生成:岗位+姓名+简历序号)
 * @param {string} data.name 姓名（必填）
 * @param {string} data.phone 手机号（必填）
 * @param {string} [data.englishName] 英文名
 * @param {number} [data.gender] 性别:0=女,1=男
 * @param {string} [data.birthDate] 出生日期
 * @param {number} [data.age] 年龄
 * @param {string} [data.nationality] 国籍(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.phoneCountryCode] 手机号国家码(如:+86,+1)
 * @param {number} [data.phonePublic] 手机号是否公开:0=隐藏,1=公开
 * @param {string} [data.telegram] Telegram账号
 * @param {string} [data.email] 邮箱
 * @param {string} [data.otherAccount] 其它账号(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.otherAccountValue] 其它账号值
 * @param {string} [data.moreAccounts] 更多账号(JSON数组)
 * @param {string} [data.jobTitle] 职位名称/意向职位
 * @param {string} [data.jobCategory] 职位类别
 * @param {string} [data.expectedSalary] 期望月薪(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.currentSalary] 目前月薪(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.abroadWillingness] 出国意愿(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.workStyle] 工作方式(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.workYears] 工作年限(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.education] 学历(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.workExperience] 工作经验(字典itemKey)
 * @param {string} [data.province] 省份
 * @param {string} [data.city] 城市
 * @param {string} [data.address] 详细地址
 * @param {string} [data.avatar] 头像URL
 * @param {string} [data.jobStatus] 求职状态(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.currentLocation] 目前所在(国家/地区)(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.expectedCountry] 期望国家(字典itemKey，格式:type_code:item_key)
 * @param {string} [data.selfIntroduction] 自我介绍
 * @param {string} [data.experienceContent] 经历内容(工作经验与专案介绍，富文本，支持Quill Delta格式或字符串)
 * @param {Array<string>} [data.resumeFile] 简历附件URL列表(支持多个文件)
 * @param {number} [data.isPublic] 是否公开:0=不公开,1=公开
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const createDraftResume = (data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/create-draft`,
    data,
  });

/**
 * 创建简历
 * 包含基础信息、联系方式、求职意向、经历与附件五大部分。
 * @param {Object} data 请求体（ResumeCreateRequest）
 * @param {string} [data.resumeName] 自定义简历名称（留空则岗位+姓名+序号）
 * @param {string} data.name 姓名
 * @param {string} data.phone 手机号
 * @param {string} [data.jobTitle] 意向岗位
 * @param {string} [data.jobCategory] 职位类别（字典 itemKey）
 * @param {string} [data.expectedSalary] 期望薪资字典 key
 * @param {string} [data.currentSalary] 当前薪资字典 key
 * @param {number} [data.abroadWillingness] 出国意愿：0=否，1=是
 * @param {string} [data.workStyle] 工作方式字典 key
 * @param {number} [data.workYears] 工作年限
 * @param {string} [data.education] 学历字典 key
 * @param {string} [data.email] 邮箱
 * @param {string} [data.telegram] Telegram 账号
 * @param {number} [data.phonePublic] 手机是否公开：0/1
 * @param {string} [data.resumeFile] 附件简历地址（仅支持单份简历文件）
 * @param {number} [data.isPublic] 是否公开：0/1
 * @param {number} [data.viewContactPrice] 简历基础查看价格（U）
 * @param {number} [data.highValueViewPrice] 高价值简历查看价格（U）
 * @param {number} [data.highValueStatus] 高价值履历状态：0-未申请 1-申请中 2-已通过
 * 其余字段同 OpenAPI 描述。
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const createResume = (data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/create`,
    data,
  });

/**
 * 编辑简历
 * 覆盖更新指定简历的全部字段。
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（ResumeCreateRequest）同 `createResume`
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateResume = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}`,
    data,
  });

/**
 * 更新简历基础信息
 * 兼容旧版接口，仅更新基础信息模块。
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（ResumeCreateRequest）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateResumeBasic = (id, data) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/basic`,
    data,
  });

/**
 * 删除简历
 * 对指定简历执行软删除。
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteResume = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/resume/${id}`,
  });

/**
 * 获取简历详情
 * 求职者或企业均可查看。
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultResumeDetailResponse>>}
 */
export const getResumeDetail = (id) =>
  axios.request({
    method: 'get',
    url: `/api/resume/${id}`,
  });

/**
 * 申请高价值履历
 * 邀请用户可为当前简历申请高价值定价，审核通过后在人才端以高价值履历展示。
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const applyHighValueResume = (id) =>
  axios.request({
    method: 'post',
    url: `/api/invite/resume/price-adjustment`,
    data: { resumeId: id },
  });

/**
 * 我的简历列表
 * 求职者查看自己最多 3 份的简历，按更新时间倒序。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultMyResumeListResponse>>}
 */
export const getMyResumeList = (params) =>
  axios.request({
    method: 'get',
    url: `/api/resume/my-list`,
    params,
  });

/**
 * 设置简历公开状态
 * 控制简历是否在人才市场展示。
 * @param {number} id 简历 ID
 * @param {Object} params 查询参数
 * @param {0|1} params.isPublic 是否公开：0=不公开，1=公开
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const setResumePublic = (id, params) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/public`,
    params,
  });

/**
 * 刷新简历
 * 更新简历刷新时间，提高排名。
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const refreshResume = (id) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/refresh`,
  });

/**
 * 获取自动刷新设置
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultResumeAutoRefreshResponse>>}
 */
export const getResumeAutoRefresh = (id) =>
  axios.request({
    method: 'get',
    url: `/api/resume/${id}/auto-refresh`,
  });

/**
 * 设置自动刷新
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（ResumeAutoRefreshRequest）
 * @param {number} data.refreshDays 连续刷新天数（1-365）
 * @returns {Promise<AxiosResponse<ResultResumeAutoRefreshResponse>>}
 */
export const setResumeAutoRefresh = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/auto-refresh`,
    data,
  });

/**
 * 取消自动刷新
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const cancelResumeAutoRefresh = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/resume/${id}/auto-refresh`,
  });

/**
 * 举报简历
 * 支持匿名举报，需携带举报原因及凭证。
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（ResumeReportRequest）
 * @param {number} data.resumeId 简历 ID（与路径参数一致）
 * @param {string} data.reason 举报原因
 * @param {string} [data.description] 详细描述
 * @param {string[]} [data.images] 举报图片 URL 列表
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const reportResume = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/report`,
    data,
  });

/**
 * 上传简历附件
 * 上传 PDF / Word 等附件（通常使用 FormData）。
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultFileUploadResponse>>}
 */
export const uploadResumeFile = (id) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/upload`,
  });

/**
 * 获取简历浏览记录
 * 查看哪些企业浏览了我的简历。
 * @param {number} id 简历 ID
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @returns {Promise<AxiosResponse<ResultPageResultResumeViewResponse>>}
 */
export const getResumeViews = (id, params) =>
  axios.request({
    method: 'get',
    url: `/api/resume/${id}/views`,
    params,
  });

// -------------------------------
// 人才市场
// -------------------------------

/**
 * 人才列表
 * 招聘侧查询公开简历，支持多条件过滤。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {string} [params.jobCategory] 职位类别
 * @param {string} [params.city] 城市
 * @param {number} [params.workYears] 工作年限
 * @param {string} [params.education] 学历
 * @param {string} [params.expectedSalary] 期望薪资
 * @param {string} [params.keyword] 关键词
 * @returns {Promise<AxiosResponse<ResultPageResultResumeListResponse>>}
 */
export const listResumes = (params) =>
  axios.request({
    method: 'get',
    url: `/api/resume/list`,
    params,
  });

// -------------------------------
// 教育 / 项目 / 技能 / 工作经历
// -------------------------------

/**
 * 添加教育经历
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（EducationRequest）
 * @param {string} data.schoolName 学校名称
 * @param {string} data.education 学历
 * @param {string} data.startDate 开始年月
 * @param {string} [data.endDate] 结束年月
 * @param {string} [data.major] 专业
 * @param {string} [data.description] 在校经历
 * @param {number} [data.sortOrder] 排序
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const addEducation = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/education`,
    data,
  });

/**
 * 更新教育经历
 * @param {number} id 简历 ID
 * @param {number} eduId 教育经历 ID
 * @param {Object} data 请求体（EducationRequest）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateEducation = (id, eduId, data) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/education/${eduId}`,
    data,
  });

/**
 * 删除教育经历
 * @param {number} id 简历 ID
 * @param {number} eduId 教育经历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteEducation = (id, eduId) =>
  axios.request({
    method: 'delete',
    url: `/api/resume/${id}/education/${eduId}`,
  });

/**
 * 添加项目经历
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（ProjectRequest）
 * @param {string} data.projectName 项目名称
 * @param {string} [data.projectRole] 角色
 * @param {string} data.startDate 开始时间
 * @param {string} [data.endDate] 结束时间
 * @param {string} [data.description] 项目描述
 * @param {number} [data.sortOrder] 排序
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const addProject = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/project`,
    data,
  });

/**
 * 更新项目经历
 * @param {number} id 简历 ID
 * @param {number} projId 项目经历 ID
 * @param {Object} data 请求体（ProjectRequest）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateProject = (id, projId, data) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/project/${projId}`,
    data,
  });

/**
 * 删除项目经历
 * @param {number} id 简历 ID
 * @param {number} projId 项目经历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteProject = (id, projId) =>
  axios.request({
    method: 'delete',
    url: `/api/resume/${id}/project/${projId}`,
  });

/**
 * 添加技能专长
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（SkillRequest）
 * @param {string} data.skillName 技能名称
 * @param {1|2|3} [data.proficiency] 熟练度：1=了解，2=熟悉，3=精通
 * @param {number} [data.sortOrder] 排序
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const addSkill = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/skill`,
    data,
  });

/**
 * 更新技能专长
 * @param {number} id 简历 ID
 * @param {number} skillId 技能 ID
 * @param {Object} data 请求体（SkillRequest）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateSkill = (id, skillId, data) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/skill/${skillId}`,
    data,
  });

/**
 * 删除技能专长
 * @param {number} id 简历 ID
 * @param {number} skillId 技能 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteSkill = (id, skillId) =>
  axios.request({
    method: 'delete',
    url: `/api/resume/${id}/skill/${skillId}`,
  });

/**
 * 添加工作经历
 * @param {number} id 简历 ID
 * @param {Object} data 请求体（WorkExperienceRequest）
 * @param {string} data.companyName 公司名称
 * @param {string} data.jobTitle 职位名称
 * @param {string} data.startDate 开始时间（yyyy-MM）
 * @param {string} [data.endDate] 结束时间（为空表示至今）
 * @param {string} [data.department] 部门
 * @param {string} [data.description] 工作描述
 * @returns {Promise<AxiosResponse<ResultLong>>}
 */
export const addWorkExperience = (id, data) =>
  axios.request({
    method: 'post',
    url: `/api/resume/${id}/work-experience`,
    data,
  });

/**
 * 更新工作经历
 * @param {number} id 简历 ID
 * @param {number} expId 工作经历 ID
 * @param {Object} data 请求体（WorkExperienceRequest）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const updateWorkExperience = (id, expId, data) =>
  axios.request({
    method: 'put',
    url: `/api/resume/${id}/work-experience/${expId}`,
    data,
  });

/**
 * 删除工作经历
 * @param {number} id 简历 ID
 * @param {number} expId 工作经历 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteWorkExperience = (id, expId) =>
  axios.request({
    method: 'delete',
    url: `/api/resume/${id}/work-experience/${expId}`,
  });

/**
 * 付费查看简历
 * 企业用户付费查看简历联系方式。
 * @param {number} id 简历 ID
 * @returns {Promise<AxiosResponse<ResultResumeDetailResponse>>}
 */
export const payToViewResume = (id) => axios.get(`/api/company/resume/${id}/contact`);
