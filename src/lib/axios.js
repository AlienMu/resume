import { message } from 'ant-design-vue';
import axios from 'axios';
import { decryptData } from './encrypt';
import { APPID, DATA_TYPE_ENUM } from '../constants/common-const';
import _ from 'lodash';
import { localRead, localRemove } from '/@/utils/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const';
import localKey from '/@/constants/local-storage-key-const';
import { clearAllCoolies } from '../utils/cookie-util';
import { isMockEnabled, handleMockRequest } from '/@/mock';
// Token request header
const TOKEN_HEADER = 'Authorization';

const STATIC_HEADER = {
  client: APPID,
  terminal: 0,
};

// Create the axios instance
const MuiAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 100000, // request timeout
});

// ================================= Request interceptor =================================

MuiAxios.interceptors.request.use(
  (config) => {
    const token = localRead(LocalStorageKeyConst.USER_TOKEN);
    config.headers = {
      ...config.headers,
      ...STATIC_HEADER,
    };
    if (token) {
      config.headers[TOKEN_HEADER] = `Bearer ${token}`;
    } else {
      delete config.headers[TOKEN_HEADER];
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// ================================= Response interceptor =================================

// Add a response interceptor
MuiAxios.interceptors.response.use(
  (response) => {
    // Determine whether the response is JSON based on content-type
    let contentType = response.headers['content-type'] ? response.headers['content-type'] : response.headers['Content-Type'];
    if (contentType.indexOf('application/json') === -1) {
      return Promise.resolve(response);
    }

    // If it is JSON data
    if (response.data && response.data instanceof Blob) {
      return Promise.reject(response.data);
    }

    // If it is encrypted data
    if (response.data.dataType === DATA_TYPE_ENUM.ENCRYPT.value) {
      response.data.encryptData = response.data.data;
      let decryptStr = decryptData(response.data.data);
      if (decryptStr) {
        response.data.data = JSON.parse(decryptStr);
      }
    }

    // Process the response data
    const res = response.data;
    const successCodes = [0, 200];
    const errorTokenCode = 2008;
    const hasCode = Object.prototype.hasOwnProperty.call(res, 'code');

    if (!hasCode || successCodes.includes(res.code)) {
      return Promise.resolve(res.data);
    }
    if (errorTokenCode === res.code) {
      localRemove(localKey.USER_TOKEN);
      localRemove(localKey.USER_POINTS);
      localRemove(localKey.USER_TAG_NAV);
      window.location.href = '/';
      clearAllCoolies();
      message.destroy();
      return Promise.reject(response);
    }
    message.destroy();
    message.error(res.message || 'Something went wrong, please try again later');
    return Promise.reject(response);
  },
  (error) => {
    const response = error?.response;
    const { code } = response?.data ?? {};
    if (code === 401 || code === 409) {
      message.destroy();
      return Promise.reject(response);
    }
    // Handle response errors
    if (error.message.indexOf('timeout') !== -1) {
      message.destroy();
      message.error('Request timeout');
    } else if (error.message === 'Network Error') {
      message.destroy();
      message.error('Network connection error');
    } else if (error.message.indexOf('Request') !== -1) {
      message.destroy();
      message.error('A network error occurred');
    }
    return Promise.reject(error);
  }
);

// ================================= Exposed request methods: generic request, get, post, download, etc. =================================

/**
 * Generic request wrapper
 * @param config
 * @returns {Promise<any>}
 */
const request = (config) => {
  if (isMockEnabled()) {
    const mockResult = handleMockRequest(config);
    if (mockResult !== undefined) {
      return mockResult;
    }
  }
  return MuiAxios.request(config);
};

// ================================= Download =================================

export const postDownload = function (url, data) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      url,
      data,
      responseType: 'blob',
    })
      .then((data) => {
        handleDownloadData(data);
        resolve(data);
      })
      .catch((error) => {
        handleDownloadError(error);
        reject(error);
      });
  });
};

/**
 * File download
 */
export const getDownload = function (url, params) {
  request({
    method: 'get',
    url,
    params,
    responseType: 'blob',
  })
    .then((data) => {
      handleDownloadData(data);
    })
    .catch((error) => {
      handleDownloadError(error);
    });
};

function handleDownloadError(error) {
  if (error instanceof Blob) {
    const fileReader = new FileReader();
    fileReader.readAsText(error);
    fileReader.onload = () => {
      const msg = fileReader.result;
      const jsonMsg = JSON.parse(msg);
      message.destroy();
      message.error(jsonMsg.msg);
    };
  } else {
    message.destroy();
    message.error('A network error occurred', error);
  }
}

function handleDownloadData(response) {
  if (!response) {
    return;
  }

  // Get the response content type
  let contentType = _.isUndefined(response.headers['content-type']) ? response.headers['Content-Type'] : response.headers['content-type'];

  // Build the download data
  let url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;

  // Get the file name from the response headers
  let str = _.isUndefined(response.headers['content-disposition'])
    ? response.headers['Content-Disposition'].split(';')[1]
    : response.headers['content-disposition'].split(';')[1];

  let filename = _.isUndefined(str.split('fileName=')[1]) ? str.split('filename=')[1] : str.split('fileName=')[1];
  link.setAttribute('download', decodeURIComponent(filename));

  // Trigger the download click
  document.body.appendChild(link);
  link.click();

  // Release resources after download
  document.body.removeChild(link); // Remove the element once the download completes
  window.URL.revokeObjectURL(url); // Release the blob object
}

export default {
  get: (url, params) => request({ url, method: 'get', params }),
  post: (url, data) => request({ url, method: 'post', data }),
  put: (url, data) => request({ url, method: 'put', data }),
  patch: (url, data) => request({ url, method: 'patch', data }),
  delete: (url, data) => request({ url, method: 'delete', data }),
  request,
  postDownload,
  getDownload,
};
