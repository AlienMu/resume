import XLSX from 'xlsx';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';

/**
 * @typedef Column
 * @property {String} dataIndex
 * @property {Number} width
 * @property {String} title
 * @property {Function} [customRender]
 */
/**
 * @method exportData
 * @description 导出数据为excel
 * @param {Object} data 数据源
 * @param {Array<Column>} configs 配置项
 * @param {String} fileName 下载后的文件名
 */
export const exportData = (data, configs, fileName) => {
  // 定义新的列标题
  const filterConfigs = configs.filter((item) => item.dataIndex !== 'operate');
  const header = filterConfigs.reduce((pre, cur) => {
    return [...pre, cur.dataIndex];
  }, []);
  const headerDisplay = filterConfigs.reduce((pre, cur) => {
    return {
      ...pre,
      [cur.dataIndex]: cur.title,
    };
  }, {});
  const filterData = data.map((item) => {
    let object = {};
    filterConfigs.forEach((config) => {
      const key = config.dataIndex;

      if (config?.customRender) {
        object[key] = config.customRender({ text: item[key], record: item });
      } else {
        object[key] = item[key];
      }
    });
    return object;
  });
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([headerDisplay, ...filterData], { header, skipHeader: true });
  XLSX.utils.book_append_sheet(workbook, worksheet, String(dayjs().format('YYYYMMDDHHssmm')));
  worksheet['!cols'] = filterConfigs.map((item) => {
    return {
      wch: new Decimal(item.width || 200).div(10).toNumber(),
    };
  });
  XLSX.writeFile(workbook, (fileName || dayjs().valueOf()) + '.xlsx', { compression: true });
};
