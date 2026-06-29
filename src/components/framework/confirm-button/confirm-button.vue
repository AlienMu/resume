<template>
  <a-button @click="onOpenDialog" v-bind="$attrs">
    <slot></slot>
  </a-button>
</template>

<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { createVNode } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { getModal } from '/@/utils/element-util';

  const props = defineProps({
    title: {
      type: String,
      default: 'Reminder',
    },
    content: {
      type: String,
      default: 'Data cannot be recovered after deletion. Please proceed with caution!',
    },
  });
  const emit = defineEmits(['click']);

  const onOpenDialog = () => {
    getModal('confirm', {
      title: props.title,
      centered: true,
      content: props.content,
      onOk() {
        emit('click');
      },
    });
  };
</script>
