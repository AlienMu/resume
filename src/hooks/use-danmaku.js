import { ref, onMounted, onUnmounted } from 'vue';
import { getHotJobs } from '/@/api/job';

const DEFAULT_FALLBACK_TITLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full-stack Engineer',
  'Product Manager',
  'UI Designer',
  'Data Analyst',
  'Operations Specialist',
  'Marketing',
  'Sales Manager',
  'Project Manager',
];

const extractJobRecords = (response) => {
  if (!response) return [];
  if (Array.isArray(response.records)) {
    return response.records;
  }
  if (Array.isArray(response?.data?.records)) {
    return response.data.records;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
};

const normalizeJobTitles = (records = []) =>
  records
    .map((item) => item?.jobTitle)
    .filter((title) => typeof title === 'string' && title.trim())
    .map((title) => title.trim());

/**
 * 弹幕 Hook
 * @param {Object} options 配置选项
 * @param {number} options.baseSpeed 基础速度（百分比/秒），默认 0.5（即每秒移动屏幕宽度的0.5%）
 * @param {number} options.trackCount 轨道数量，默认 5
 * @param {number} options.fontSizes 字体大小数组，默认 [120, 90, 60]
 * @param {number} options.opacities 透明度数组，默认 [0.1, 0.03]
 * @param {Object} options.fetchParams 获取弹幕数据的参数
 * @param {number} options.maxTitleCount API 返回的最大弹幕条数，默认 60
 * @param {string[]} options.fallbackTitles API 失败时的兜底标题
 * @returns {Object} 弹幕相关数据和方法
 */
export const useDanmaku = (options = {}) => {
  const {
    baseSpeed = 0.5,
    trackCount = 5,
    fontSizes = [100, 80, 60],
    opacities = [0.1, 0.05],
    fetchParams = { current: 1, size: 30 },
    maxTitleCount = 60,
    fallbackTitles = DEFAULT_FALLBACK_TITLES,
  } = options;

  const danmakuList = ref([]); // 当前显示的弹幕列表
  const jobTitles = ref([]); // 职位名称列表
  const containerRef = ref(null); // 容器引用
  const animationFrameId = ref(null); // 动画帧ID

  // 随机获取数组中的元素
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 获取随机字体大小
  const getRandomFontSize = () => randomItem(fontSizes);

  // 获取随机颜色（白色 + 随机透明度）
  const getRandomColor = () => {
    const opacity = randomItem(opacities);
    return `rgba(255, 255, 255, ${opacity})`;
  };

  // 获取随机速度（返回百分比/秒）
  const getRandomSpeed = () => {
    const speedMultiplier = Math.random() < 0.5 ? 1 : 1.1;
    return baseSpeed * speedMultiplier; // baseSpeed 现在是百分比/秒
  };

  // 获取随机轨道索引
  const getRandomTrack = () => Math.floor(Math.random() * trackCount);

  // 获取弹幕的估算宽度（百分比）
  const getDanmakuWidthPercent = (danmaku, containerWidth) => {
    if (!containerWidth) return 0;
    const estimatedWidth = danmaku.fontSize * 10; // 粗略估算：字体大小 * 10
    return (estimatedWidth / containerWidth) * 100;
  };

  // 获取弹幕的右边界位置（百分比）
  const getDanmakuRightEdge = (danmaku, containerWidth) => {
    const widthPercent = getDanmakuWidthPercent(danmaku, containerWidth);
    return danmaku.left + widthPercent;
  };

  // 检查轨道是否可以添加新弹幕（避免重叠）
  const canAddToTrack = (track, containerWidth, minDistance = 20) => {
    // 获取该轨道上所有弹幕
    const trackDanmakus = danmakuList.value.filter((d) => d.track === track);

    if (trackDanmakus.length === 0) {
      return true; // 轨道为空，可以添加
    }

    // 找到该轨道上最右侧的弹幕（即最后一条弹幕的右边界）
    const rightmostEdge = Math.max(...trackDanmakus.map((d) => getDanmakuRightEdge(d, containerWidth)));

    // 新弹幕从右侧（100%）开始，如果最右侧弹幕已经移出足够距离，可以添加
    // minDistance 是最小安全距离（百分比）
    return rightmostEdge < 100 - minDistance;
  };

  // 智能选择轨道（优先选择空闲轨道，避免重叠）
  const getAvailableTrack = (containerWidth) => {
    // 首先尝试找到完全空闲的轨道
    const emptyTracks = [];
    for (let i = 0; i < trackCount; i++) {
      const trackDanmakus = danmakuList.value.filter((d) => d.track === i);
      if (trackDanmakus.length === 0) {
        emptyTracks.push(i);
      }
    }

    if (emptyTracks.length > 0) {
      return randomItem(emptyTracks);
    }

    // 如果没有空闲轨道，找到可以添加的轨道（有足够安全距离）
    const availableTracks = [];
    for (let i = 0; i < trackCount; i++) {
      if (canAddToTrack(i, containerWidth, 15)) {
        availableTracks.push(i);
      }
    }

    if (availableTracks.length > 0) {
      return randomItem(availableTracks);
    }

    // 如果所有轨道都很拥挤，随机选择一个（这种情况应该很少）
    return getRandomTrack();
  };

  // 创建新弹幕
  const createDanmaku = (containerWidth) => {
    if (jobTitles.value.length === 0) return null;

    const text = randomItem(jobTitles.value);
    const fontSize = getRandomFontSize();
    const color = getRandomColor();
    const speed = getRandomSpeed();
    const track = getAvailableTrack(containerWidth);

    return {
      id: Date.now() + Math.random(),
      text,
      fontSize,
      color,
      speed,
      track,
      left: 100, // 初始位置：100%（屏幕右侧外）
    };
  };

  // 更新弹幕位置
  const updateDanmaku = (danmaku, deltaTime, containerWidth) => {
    if (!containerWidth) return false;
    // 从右往左移动，speed 是百分比/秒，转换为百分比/毫秒
    // 假设弹幕宽度约为字体大小的 10 倍（粗略估算）
    const estimatedWidth = danmaku.fontSize * 10;
    const speedPercentPerMs = danmaku.speed / 1000; // 将 百分比/秒 转换为 百分比/毫秒
    danmaku.left -= speedPercentPerMs * deltaTime;
    // 如果完全移出屏幕左侧，返回 true 表示需要移除
    return danmaku.left < -((estimatedWidth / containerWidth) * 100);
  };

  // 动画循环
  const animate = () => {
    if (!containerRef.value) return;

    const containerWidth = containerRef.value.offsetWidth || window.innerWidth;
    if (containerWidth === 0) {
      animationFrameId.value = requestAnimationFrame(animate);
      return;
    }

    const now = Date.now();
    if (!animate.lastTime) {
      animate.lastTime = now;
    }
    const deltaTime = now - animate.lastTime;
    animate.lastTime = now;

    // 更新所有弹幕位置
    danmakuList.value = danmakuList.value.filter((danmaku) => {
      const shouldRemove = updateDanmaku(danmaku, deltaTime, containerWidth);
      return !shouldRemove;
    });

    // 检查是否需要添加新弹幕（确保每条轨道都有弹幕）
    const tracksWithDanmaku = new Set(danmakuList.value.map((d) => d.track));
    for (let i = 0; i < trackCount; i++) {
      if (!tracksWithDanmaku.has(i)) {
        const newDanmaku = createDanmaku(containerWidth);
        if (newDanmaku) {
          danmakuList.value.push(newDanmaku);
        }
      }
    }

    // 增加弹幕密度，但保持防重叠机制
    // 提高添加概率和最大数量，让弹幕更密集
    const maxDanmakuPerTrack = 10; // 每条轨道最多3条弹幕
    const currentTotal = danmakuList.value.length;
    const maxTotal = trackCount * maxDanmakuPerTrack;

    // 增加添加频率（从0.9提高到更频繁）
    if (Math.random() < 0.95 && currentTotal < maxTotal) {
      const newDanmaku = createDanmaku(containerWidth);
      if (newDanmaku && canAddToTrack(newDanmaku.track, containerWidth, 12)) {
        danmakuList.value.push(newDanmaku);
      }
    }

    animationFrameId.value = requestAnimationFrame(animate);
  };

  // 加载职位数据
  const loadJobTitles = async () => {
    let titles = fallbackTitles;
    try {
      const response = await getHotJobs(fetchParams);
      const records = extractJobRecords(response);
      const normalizedTitles = normalizeJobTitles(records).slice(0, maxTitleCount);
      if (normalizedTitles.length > 0) {
        titles = normalizedTitles;
      }
    } catch (error) {
      console.error('Failed to load job titles:', error);
    }

    jobTitles.value = titles;

    // 初始化弹幕
    if (jobTitles.value.length > 0) {
      // 获取容器宽度用于计算
      const containerWidth = containerRef.value?.offsetWidth || window.innerWidth;

      for (let i = 0; i < trackCount; i++) {
        const newDanmaku = createDanmaku(containerWidth);
        if (newDanmaku) {
          // 为每条轨道设置不同的初始位置，避免重叠
          // 每条轨道间隔20%的距离
          newDanmaku.left = 100 + i * 20;
          danmakuList.value.push(newDanmaku);
        }
      }
    }
  };

  // 启动弹幕
  const start = () => {
    if (animationFrameId.value) return;
    animate.lastTime = null;
    animationFrameId.value = requestAnimationFrame(animate);
  };

  // 停止弹幕
  const stop = () => {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
  };

  // 清理
  const cleanup = () => {
    stop();
    danmakuList.value = [];
    jobTitles.value = [];
  };

  onMounted(() => {
    loadJobTitles().then(() => {
      start();
    });
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    danmakuList,
    containerRef,
    trackCount,
    start,
    stop,
    cleanup,
  };
};
