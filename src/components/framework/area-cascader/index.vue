<template>
  <a-cascader
    :style="`width:${width}`"
    v-model:value="areaValue"
    :show-search="{ filter }"
    :options="type === 'province-city' ? provinceCityOptions : regionOptions"
    :fieldNames="{ label: 'regionName', value: 'regionCode', children: 'childList' }"
    :placeholder="placeholder"
    :size="size"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script setup>
  // import { PROVINCE_CITY_DISTRICT } from './province-city-district';
  // import { PROVINCE_CITY } from './province-city';
  import { computed, nextTick, ref, toRaw, watch } from 'vue';
  import { useRegion } from '/@/store/modules/system/region';
  import { useInjectFormItemContext } from 'ant-design-vue/es/form';

  // ============ 组件属性 ============

  // const TYPE_PROVINCE_CITY_DISTRICT = 'province_city_district';

  const { onFieldChange } = useInjectFormItemContext();

  const props = defineProps({
    type: String,
    value: [Number, Array],
    width: {
      type: String,
      default: '100%',
    },
    placeholder: {
      type: String,
      default: '请选择地区',
    },
    size: {
      type: String,
      default: 'default',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  // ============ 组件业务 ============
  // const { regionOptions, provinceCityOptions } = useRegion();

  const regionOptions = computed(() => useRegion().regionOptions);

  const provinceCityOptions = computed(() => useRegion().provinceCityOptions);

  // 绑定地区数据
  const areaValue = computed({
    get() {
      if (Array.isArray(props.value)) {
        let array = [];
        for (let index = 0; index < 3; index++) {
          if (props.value[index]) {
            array.push(props.value[index]);
          }
        }
        return array;
      } else {
        return [];
      }
    },
    set(value) {
      emit('update:value', value);
    },
  });

  function handleChange(value, selectedOptions) {
    const { regionCode, regionName, ...arg } = selectedOptions || [
      { regionCode: undefined, regionName: undefined },
      { regionCode: undefined, regionName: undefined },
      { regionCode: undefined, regionName: undefined },
    ];
    emit(
      'change',
      value || [],
      toRaw({
        label: regionName,
        value: regionCode,
        ...arg,
      })
    );
    nextTick(() => {
      onFieldChange();
    });
  }

  const filter = (inputValue, path) => {
    return path.some((option) => option.regionName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };
</script>
