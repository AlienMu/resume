/**
 * 计算表格自适应高度
 * 如果是自定义组件需要自己在组件里面搂一个domRef的字段出来
 * 如果是原生标签则不需要
 *
 * @method useCalcTableHeight
 * @param {*} removeRefArray
 * @param {*} extraRemoveHeight
 * @returns {Object}
 */
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { debounce } from 'lodash';

export function useCalcTableHeight(excludeRemoveRefArray, extraRemoveHeight) {
  const height = ref();
  const refs = computed(() => {
    return getCurrentInstance().refs;
  });

  const handleCalc = () => {
    const defaultExtra = extraRemoveHeight || 0;
    const MIN_HEIGHT = 200;
    const PAGE_HEIGHT = 56;
    const PADDING_HEIGHT = 16 + 40; //margin + th + button
    let removeHeight = 0;
    const refKey = Object.keys(refs.value);
    if (refs.value) {
      for (const key of refKey) {
        const item = refs.value[key];
        if (Array.isArray(excludeRemoveRefArray) && excludeRemoveRefArray.includes(key)) continue;
        if (item) {
          if (item.domRef) removeHeight += item.domRef.offsetHeight;
          else if (item.offsetHeight) removeHeight += item.offsetHeight;
        }
      }
    }
    removeHeight = removeHeight + defaultExtra + PADDING_HEIGHT + PAGE_HEIGHT;
    const handleCalcHeight = document.querySelector('#muiAdminLayoutContent').offsetHeight - removeHeight;
    height.value = Math.max(MIN_HEIGHT, handleCalcHeight);
  };

  //监听元素高度变化
  const resizeObserver = new ResizeObserver(() => {
    handleCalc();
  });

  //监听浏览器视窗变化
  onMounted(() => {
    window.addEventListener('resize', handleCalc);
    Object.values(refs.value).forEach((item) => {
      if (item) {
        if (item.domRef) resizeObserver.observe(item.domRef);
        else if (item.offsetHeight) resizeObserver.observe(item);
      }
    });
    handleCalc();
  });

  //解除监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleCalc);
  });
  return {
    height,
    handleCalc: handleCalc,
  };
}
