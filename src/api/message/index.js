import axios from '/@/lib/axios';

/**
 * 06-消息管理接口
 * 提供消息列表、批量操作与未读统计能力。
 */

/**
 * 全部删除消息
 * 清空当前用户的全部消息记录。
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteAllMessages = () =>
  axios.request({
    method: 'delete',
    url: `/api/message/all`,
  });

/**
 * 全部标记为已读
 * 将当前账户所有未读消息设为已读。
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const markAllAsRead = () =>
  axios.request({
    method: 'put',
    url: `/api/message/all/read`,
  });

/**
 * 批量删除消息
 * 通过逗号分隔的 ID 集合删除多条消息。
 * @param {Object} params 查询参数
 * @param {string} params.ids 消息 ID 列表（示例：`1,2,3`）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const batchDeleteMessages = (params) =>
  axios.request({
    method: 'delete',
    url: `/api/message/batch`,
    params,
  });

/**
 * 批量标记为已读
 * 为多条消息一次性更新已读状态。
 * @param {Object} data 请求体（BatchReadRequest）
 * @param {string} data.ids 消息 ID 列表（逗号分隔）
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const batchMarkAsRead = (data) =>
  axios.request({
    method: 'put',
    url: `/api/message/batch/read`,
    data,
  });

/**
 * 消息列表（分页）
 * 支持按类型和已读状态过滤。
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页
 * @param {number} params.size 每页条数
 * @param {1|2|3} [params.type] 消息类型：1=系统通知，2=投递通知，3=职位推荐
 * @param {0|1} [params.isRead] 是否已读：0=未读，1=已读
 * @returns {Promise<AxiosResponse<ResultPageResultMessageListResponse>>}
 */
export const listMessages = (params) =>
  axios.request({
    method: 'get',
    url: `/api/message/list`,
    params,
  });

/**
 * 获取未读消息总数
 * 统计全部类型的未读数量。
 * @returns {Promise<AxiosResponse<ResultInteger>>}
 */
export const getUnreadCount = () =>
  axios.request({
    method: 'get',
    url: `/api/message/unread-count`,
  });

/**
 * 按类型统计未读数量
 * 返回系统 / 投递 / 推荐等分类的未读数量。
 * @returns {Promise<AxiosResponse<ResultUnreadCountResponse>>}
 */
export const getUnreadCountByType = () =>
  axios.request({
    method: 'get',
    url: `/api/message/unread-count-by-type`,
  });

/**
 * 删除单条消息
 * 根据消息 ID 删除。
 * @param {number} id 消息 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const deleteMessage = (id) =>
  axios.request({
    method: 'delete',
    url: `/api/message/${id}`,
  });

/**
 * 消息详情
 * 返回消息内容并自动标记为已读。
 * @param {number} id 消息 ID
 * @returns {Promise<AxiosResponse<ResultMessageDetailResponse>>}
 */
export const getMessageDetail = (id) =>
  axios.request({
    method: 'get',
    url: `/api/message/${id}`,
  });

/**
 * 标记消息已读
 * 针对单条消息更新已读状态。
 * @param {number} id 消息 ID
 * @returns {Promise<AxiosResponse<ResultCommonResponse>>}
 */
export const markAsRead = (id) =>
  axios.request({
    method: 'put',
    url: `/api/message/${id}/read`,
  });
