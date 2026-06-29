<template>
  <a-flex align="center" gap="13" justify="center" style="height: 30px" v-if="!isEdit">
    <a-typography-text :content="data.jobTitle" />
    <span class="edit-text" @click="onEdit"> <svg-icon name="editor" /></span>
  </a-flex>
  <a-input
    ref="inputRef"
    @pressEnter="handleSubmit"
    v-show="isEdit"
    v-model:value.trim="value"
    :disabled="submitLoading"
    style="background: rgba(247, 247, 247, 1)"
    :bordered="false"
  >
    <template #suffix>
      <a-space>
        <a-button type="link" size="small" @click="handleCancel">
          <svg-icon name="close" />
        </a-button>
        <a-button type="link" size="small" @click.stop.prevent="handleSubmit">
          <svg-icon name="success" style="font-size: 18px" />
        </a-button>
      </a-space>
    </template>
  </a-input>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { computed, nextTick, ref } from 'vue';
  import { updateResumeBasic } from '/@/api/resume';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const value = ref('');
  const isEdit = ref(false);
  const submitLoading = ref(false);

  const emit = defineEmits(['rename']);

  const inputRef = ref();
  const currentName = computed(() => props.data?.resumeName);
  const resumeId = computed(() => props.data?.id);

  const onEdit = () => {
    isEdit.value = true;
    value.value = currentName.value;
    nextTick(() => {
      inputRef.value.focus();
    });
  };

  const handleSubmit = async () => {
    console.log('ok');
    const nextName = value.value?.trim?.() ?? '';
    if (!resumeId.value) {
      message.error('Resume ID not found');
      return;
    }
    if (!nextName) {
      message.warning('Please enter a resume name');
      nextTick(() => inputRef.value?.focus?.());
      return;
    }
    if (nextName === currentName.value) {
      isEdit.value = false;
      return;
    }
    try {
      submitLoading.value = true;
      await updateResumeBasic(resumeId.value, { resumeName: nextName });
      message.success('Resume name updated');
      emit('rename', nextName);
      isEdit.value = false;
      value.value = nextName;
    } catch (error) {
      message.error(error?.message || 'Update failed, please try again later');
      value.value = currentName.value;
    } finally {
      submitLoading.value = false;
    }
  };

  const handleCancel = () => {
    isEdit.value = false;
    value.value = currentName.value;
  };
</script>

<style scoped lang="less">
  .edit-text {
    color: @font-tip-color;
    cursor: pointer;
    font-size: 16px;
    line-height: 16px;
    &:hover {
      color: @primary-color;
    }
  }
</style>
