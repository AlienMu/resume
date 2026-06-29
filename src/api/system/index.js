import axios from '/@/lib/axios';

/**
 * 获取广告列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页 (必填)
 * @param {number} params.size - 每页条数 (必填)

 * @returns {Promise<AxiosResponse<ResultPageResultAdvertisementListResponse>>}
 */
export const getAdvertisements = (params) => axios.get('/api/system/advertisements');
