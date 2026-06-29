<template>
  <m-select
    v-bind="$attrs"
    v-if="!cascader"
    v-model:value="value"
    :options="options"
    :filter-option="filterOption"
    @search="handleSelectSearch"
    @change="handleSelectChange"
    :fieldNames="{ label: 'itemName', value: 'itemKey' }"
    allow-clear
    isCustomerIcon
    :maxTagCount="1"
    :show-search="showSearch"
    :mode="props.multiple ? 'multiple' : 'combobox'"
  >
    <template #option="data">
      <slot name="option" :option="data">
        <div class="option-text">{{ data.itemName }}</div>
      </slot>
    </template>
  </m-select>
  <a-cascader
    v-bind="$attrs"
    v-model:value="value"
    :options="options"
    :filter-option="filterOption"
    @search="handleSelectSearch"
    @change="handleSelectChange"
    :fieldNames="{ label: 'itemName', value: 'itemKey', children: 'children' }"
    :displayRender="displayRender"
    allow-clear
    popupClassName="mui-select-menu"
    class="mui-select mui-select-cascader"
    :maxTagCount="1"
    :show-search="showSearch"
    :mode="props.multiple ? 'multiple' : 'combobox'"
    v-else
  >
    <template #option="data">
      <slot name="option" :option="data">
        <div class="option-text">{{ data.itemName }}</div>
      </slot>
    </template>
    <template #suffixIcon v-if="isCustomerIcon">
      <div class="icon">
        <svg-icon name="arrow" />
      </div>
    </template>
  </a-cascader>
</template>
<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
  import { getDictionary } from '/@/api/base';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';

  const props = defineProps({
    type: String,
    value: [String, Array],
    itemKey: String,
    multiple: Boolean,
    isCustomerIcon: Boolean,
    showSearch: {
      type: Boolean,
      default: false,
    },
    cascader: Boolean,
  });

  const emits = defineEmits(['update:value', 'change']);

  const filterOption = (input, option) => {
    return option.itemName?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const displayRender = ({ labels, selectedOptions }) => {
    // 如果是树形选择，只显示最后一个标签
    return labels && labels.length > 0 ? labels[labels.length - 1] : '';
  };

  const value = computed({
    get: () => {
      if (props.cascader) {
        const item = optionsFlat.value.find((item) => item.itemKey === props.value);
        if (item?.parentId) {
          const parentItem = optionsFlat.value.find((_item) => _item.id === item.parentId);

          return [parentItem.itemKey, item.itemKey];
        }
        return item ? [item.itemKey] : undefined;
      }
      return props.value;
    },
    set: (val) => {
      if (props.cascader) {
        emits('update:value', val?.length > 0 ? val[val.length - 1] : undefined);
        return;
      }
      emits('update:value', val);
    },
  });

  const isLoading = ref(false);

  const options = ref();

  const flat = (array) =>
    array.reduce((acc, val) => {
      if (Array.isArray(val.children)) {
        acc.push(...flat(val.children));
      }
      acc.push(val);
      return acc;
    }, []);

  const optionsFlat = computed(() => flat(options.value ?? []));

  const getOptions = async () => {
    isLoading.value = true;
    try {
      options.value = await getDictionary({ typeCode: props.type, itemKey: props.itemKey });
    } finally {
      isLoading.value = false;
    }
  };

  const handleSelectSearch = (val) => {
    getOptions(val);
  };

  const handleSelectChange = (val, option) => {
    emits('change', { value: val, option: option ?? {} });
  };

  watch(
    () => [props.params, props.type],
    () => {
      getOptions();
    }
  );

  onMounted(getOptions);
</script>
