import { message } from 'ant-design-vue';

export const validateImageFile = (file, size) => {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    return message.warning('Please select an image file');
  }

  if (file.size > size * 1024 * 1024) {
    return message.warning(`File size cannot exceed ${size}MB`);
  }
  return true;
};

export const dataUrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',');
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
