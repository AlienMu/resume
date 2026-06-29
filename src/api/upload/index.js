import OSS from 'ali-oss';
import { getUrlFileType } from '/@/utils/str-util';
import axios from '/@/lib/axios';
import imageCompression from 'browser-image-compression';

/**
 * @typedef {Object} FileReturn
 * @property {string} storageAddress - File address
 * @property {string} id - File id
 * @property {string} type - File type
 * @property {string} name - File name
 * @property {string} size - File size
 */

const getCredentials = () => {
  return axios.request({
    url: '/api/base/oss/sts-token',
    headers: {
      'X-Client-Source': 'web',
    },
  });
};

/**
 * @method compressImage
 * @description Compress image
 * @param {File} file - Image file
 * @returns {Promise<File>} The compressed file
 */
const compressImage = async (file) => {
  // Check whether it is an image file
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
  if (!imageTypes.includes(file.type)) {
    return file; // Return non-image files directly
  }

  try {
    const options = {
      maxSizeMB: 1, // Max file size 1MB
      maxWidthOrHeight: 1920, // Max width or height
      useWebWorker: true, // Use Web Worker to improve performance
      fileType: file.type, // Keep the original file type
    };

    const compressedFile = await imageCompression(file, options);
    console.log(`Image compression: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.warn('Image compression failed, using original file:', error);
    return file; // Return the original file if compression fails
  }
};

/**
 * @method uploadFile
 * @description File upload
 * @param {File} file - File instance
 * @param {number} maxSize? - Max image size limit
 * @param {boolean} compress? - Whether to compress the image, defaults to true
 * @returns {Promise<FileReturn>}
 */
export const uploadFile = async ({ file, maxSize, onProgress, compress = true } = {}) => {
  try {
    if (!file) {
      return Promise.reject(new Error('Upload failed, no file provided!'));
    }

    // If compression is enabled and the file is an image, compress it first
    let fileToUpload = file;
    if (compress) {
      fileToUpload = await compressImage(file);
    }

    const defaultMaxSize = (maxSize || 200) * 1024 * 1024;
    const { size } = fileToUpload;

    if (size > defaultMaxSize) {
      return Promise.reject(new Error(`${file.name} exceeds ${defaultMaxSize / 1024 / 1024}M!`));
    }

    const { bucketName, region, accessKeySecret, accessKeyId, securityToken, uploadDir, endpoint, bucketDomain } = await getCredentials(file.name);

    const client = new OSS({
      region: region, // e.g. 'oss-cn-hangzhou'
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      stsToken: securityToken,
      bucket: bucketName,
      endpoint: endpoint,
    });

    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${uploadDir}${timestamp}_${randomStr}_${file.name}`;
      // Use multipart upload (supports large files / resumable upload)

      client
        .multipartUpload(fileName, fileToUpload, {
          progress: onProgress,
          partSize: 5 * 1024 * 1024, // 5MB per part
          parallel: 4, // 4 parts uploaded concurrently
          timeout: 120000, // 120s timeout
        })
        .then(() => {
          const url = `https://${bucketDomain}/${fileName}`;
          resolve({
            url,
            name: file.name,
            type: getUrlFileType(file.name),
          });
        })
        .catch((error) => {
          console.error('Upload failed:', error);
          reject(error);
        });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
