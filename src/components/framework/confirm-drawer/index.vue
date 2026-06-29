<template>
  <a-drawer :body-style="{ paddingBottom: '80px' }" :maskClosable="false" :open="visibleComputed" v-bind="$attrs">
    <template #closeIcon>
      <ConfirmButton size="small" type="text" @click="onClose" v-if="isShowConfirmText">
        <CloseOutlined />
      </ConfirmButton>
      <a-button v-else @click="onClose" type="text" size="small"> <CloseOutlined /></a-button>
    </template>
    <slot></slot>
    <div class="footer">
      <a-space>
        <ConfirmButton v-if="isShowConfirmText" type="default" @click="onClose">{{ props.closeText }}</ConfirmButton>
        <a-button v-else @click="onClose" type="default">{{ props.closeText }}</a-button>
        <slot name="footer"></slot>
      </a-space>
    </div>
    <template #extra><slot name="extra"></slot></template>
  </a-drawer>
</template>

<script setup>
  import ConfirmButton from '/@/components/framework/confirm-button/index.vue';
  import { computed } from 'vue';

  const props = defineProps({
    confirmText: {
      type: String,
      default: 'Please confirm whether to perform this action',
    },
    closeText: {
      type: String,
      default: 'Cancel',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isShowConfirmText: {
      type: Boolean,
      default: false,
    },
  });

  const visibleComputed = computed({
    get: () => {
      return props.visible;
    },
    set: (value) => {
      emit('update:visible', value);
    },
  });
  const onClose = () => {
    emit('close');
    visibleComputed.value = false;
  };
  const emit = defineEmits(['close', 'update:visible']);
</script>
<style lang="less" scoped>
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
    z-index: 2;
  }
</style>
