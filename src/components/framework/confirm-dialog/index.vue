<template>
  <a-modal :closable="false" :maskClosable="false" :open="props.visible" v-bind="$attrs">
    <slot></slot>
    <template #footer>
      <a-space>
        <ConfirmButton v-if="isShowConfirmText" :confirmText="props.confirmText" type="default" @click="handleCancel">Cancel</ConfirmButton>
        <a-button v-else type="default" @click="handleCancel">Cancel</a-button>
        <slot name="footer">
          <a-button :loading="props.isLoading" type="primary" @click="emit('ok')">{{ props.okText }} </a-button>
        </slot>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup>
  import ConfirmButton from '/@/components/framework/confirm-button/index.vue';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: '',
    },
    okText: {
      type: String,
      default: 'Confirm',
    },
    isShowConfirmText: {
      type: Boolean,
      default: false,
    },
  });

  const handleCancel = () => {
    emit('update:visible', false);
  };

  const emit = defineEmits(['ok', 'update:visible']);
</script>
