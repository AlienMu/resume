import axios from '/@/lib/axios';

export const getDictionary = (data) => axios.get('/api/base/dictionary/items', data);

/**
 * 获取网站配置（整合版）
 * 获取网站所有配置信息，包括：基础配置（底部合作联系Telegram、底部合作邮箱、右侧客户联系Telegram）、图片配置（Logo、邀请图片）、收款配置（U地址、收款二维码）
 * @returns {Promise<AxiosResponse<ResultSiteConfigDTO>>}
 */
export const getSiteConfig = () =>
  axios.request({
    method: 'get',
    url: `/api/admin/system/site-config`,
  });
