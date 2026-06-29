// 生成随机数
export function randomNum() {
  return Math.random().toString(36).substring(2, 10);
}

// 生成16位安全随机字符串
export const secureRandom = () => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36))
    .join('')
    .substring(0, 16);
};

// 检测是否为移动端
export const isMobile = () => {
  // 检查屏幕宽度，通常移动端宽度小于 768px
  if (window.innerWidth < 768) {
    return true;
  }
  // 检查 User Agent
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent);
};
