/**
 * @typedef {Object} PageInfo
 * @property {number} pageSize
 * @property {number} pageIndex
 * @property {string} [extra]
 */

/**
 * @template T
 * @typedef {Object} RecordsResult
 * @property {number} size
 * @property {number} total
 * @property {number} current
 * @property {number} pages
 * @property {Array<T = any>} records
 */

/**
 * 通用响应数据结构
 * @typedef {Object} CommonResponse
 * @property {string} message 消息
 * @property {boolean} success 操作是否成功
 **/
