import axios from '/@/lib/axios';

/**
 * 获取前台有效公告列表
 * @param {Object} [params]
 * @param {number} [params.current=1]
 * @param {number} [params.size=20]
 * @returns {Promise<AxiosResponse<ResultPageResultAnnouncementResponse>>}
 */
export const getActiveAnnouncements = (params = {}) => axios.get('/api/system/announcements/latest', params);
