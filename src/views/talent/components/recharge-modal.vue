<template>
  <a-modal
    :cancel-button-props="{ ghost: true, type: 'primary' }"
    width="420px"
    :title="getLabel('recharge.title')"
    v-model:open="isOpen"
    wrap-class-name="mui-modal"
    :ok-text="getLabel('recharge.okButton')"
    :cancel-text="cancelButtonText"
    :mask-closable="false"
    destroy-on-close
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-flex vertical gap="20">
      <div class="mui-desc-text" v-html="contentText"></div>
    </a-flex>
  </a-modal>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { useRouter } from 'vue-router';

  const { getLabel } = useI18nText({ local: 'talent.modal' });
  const router = useRouter();

  const isOpen = ref(false);
  const countdown = ref(10);
  const viewContactCount = ref(0);
  let countdownTimer = null;

  const emit = defineEmits(['ok', 'cancel']);

  const contentText = computed(() => {
    return getLabel('recharge.content', { num: viewContactCount.value });
  });

  const cancelButtonText = computed(() => {
    return getLabel('recharge.cancelButton', { num: countdown.value });
  });

  const startCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    countdown.value = 10;
    countdownTimer = setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        clearInterval(countdownTimer);
        handleCancel();
      }
    }, 1000);
  };

  const handleOk = () => {
    emit('ok');
    // 跳转到储值页面
    router.push({ name: 'prepaidPlan' });
    isOpen.value = false;
  };

  const handleCancel = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    emit('cancel');
    // 返回找人才页面
    router.push({ name: 'talent' });
    isOpen.value = false;
  };

  const open = (options = {}) => {
    if (options.viewContactCount !== undefined) {
      viewContactCount.value = options.viewContactCount;
    }
    isOpen.value = true;
    startCountdown();
  };

  onMounted(() => {
    if (isOpen.value) {
      startCountdown();
    }
  });

  onBeforeUnmount(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
  });

  defineExpose({
    open,
  });
</script>

<style scoped lang="less"></style>
