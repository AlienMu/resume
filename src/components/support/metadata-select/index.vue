<template>
  <a-select
    v-model:value="selectValue"
    :allowClear="true"
    :options="options"
    :placeholder="props.placeholder"
    :showSearch="true"
    :size="size"
    :field-names="{ label: 'name', value: 'code' }"
    showArrow
    :mode="props.multiple ? 'multiple' : 'combobox'"
    :style="`width: ${width}`"
    @change="handleChange"
    v-bind="$attrs"
  >
  </a-select>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { useMetadata } from '/@/store/modules/system/metadata.js';

  const props = defineProps({
    metadataName: String,
    value: [Number, String],
    filterMetaData: {
      type: Array,
      default: () => {},
    },
    width: {
      type: String,
      default: '100%',
    },
    placeholder: {
      type: String,
      default: 'Please select',
    },
    size: {
      type: String,
      default: 'default',
    },
    multiple: Boolean,
  });

  const { getMetadata } = useMetadata();

  const options = computed(() => getMetadata(props.metadataName)?.filter((item) => !props.filterMetaData.includes(item.code)));

  const emit = defineEmits(['update:value', 'change']);

  const selectValue = ref(props.value);

  watch(
    () => props.value,
    (newValue) => {
      selectValue.value = newValue;
    },
    {
      immediate: true,
    }
  );

  function handleChange(value, option) {
    emit('update:value', value);
    emit('change', value, option);
  }
</script>
