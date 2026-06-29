import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useRegion = defineStore('region', () => {
  const _Level = ['province', 'city', 'district'];

  const regionOptions = ref([]);

  const regionOptionsFlat = computed(() => flat(regionOptions.value));

  const flat = (array) =>
    array.reduce((acc, val) => {
      if (Array.isArray(val.childList)) {
        acc.push(...flat(val.childList));
      }
      acc.push(val);
      return acc;
    }, []);

  const init = async () => {
    regionOptions.value = {}; //await getRegionOptions();
  };

  const getProvinceOptions = () => regionOptionsFlat.value.filter((item) => item.level === _Level[0]);

  const getCityOptions = () => regionOptionsFlat.value.filter((item) => item.level === _Level[1]);
  // 省市级联数据
  const provinceCityOptions = computed(() => {
    return regionOptions.value.map((item) => {
      return {
        ...item,
        childList: item.childList?.map((el) => {
          return {
            ...el,
            childList: [],
          };
        }),
      };
    });
  });
  const getDistrictOptions = (parentKey) => {
    if (parentKey) {
      return regionOptionsFlat.value.find((item) => item.regionCode === parentKey).childList;
    } else {
      return console.error('parentKey is undefined');
    }
  };

  const getLabelByCode = (regionCode) => regionOptionsFlat.value.find((item) => item.regionCode === regionCode)?.regionName || '';

  return {
    init,
    regionOptions,
    getLabelByCode,
    getProvinceOptions,
    getCityOptions,
    getDistrictOptions,
    provinceCityOptions,
  };
});
