export const getValueDescList = (list) => {
  if (!Object.prototype.hasOwnProperty.call(list)) {
    return [];
  }
  const result = [];
  const targetSmartEnum = list;
  for (const item in targetSmartEnum) {
    result.push(targetSmartEnum[item]);
  }
  return result;
};

/**
 * 对象数组排序处理器
 * @param {Array} dataArray - 需要排序的原始数组
 * @param {string | Function} sortFn - 用于排序的对象键名
 * @param {boolean} [isAsc=true] - 是否升序排列，默认true
 * @returns {Array} 排序后的新数组（不修改原数组）
 */
export function getSortArray(dataArray, sortFn, isAsc = true) {
  // 防御性编程：确保输入合法
  if (!Array.isArray(dataArray)) {
    console.error('Invalid input: Expected an array');
    return [];
  }
  const getVal = (item) => {
    if (typeof sortFn === 'function') {
      return sortFn(item);
    } else {
      const sortKey = sortFn;
      return typeof item[sortKey] === 'string' ? item[sortKey].toLowerCase() : item[sortKey];
    }
  };

  // 创建副本避免修改原数组
  return [...dataArray].sort((a, b) => {
    // 统一转换为小写比较（适用于字符串）
    const valA = getVal(a);
    const valB = getVal(b);

    // 处理undefined情况
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;

    // 数值比较逻辑
    if (typeof valA === 'number' && typeof valB === 'number') {
      return isAsc ? valA - valB : valB - valA;
    }

    // 字符串比较逻辑
    return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
}
