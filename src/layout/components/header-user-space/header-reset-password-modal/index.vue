<!--
  * Change password
  *
-->
<template>
  <a-modal
    :keyboard="!isInit"
    :maskClosable="!isInit"
    :closable="!isInit"
    :open="visible"
    :title="!isInit ? 'Change Password' : 'Reset Password'"
    centered
    @close="cancelModal"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="Current Password" name="oldPassword">
        <a-input v-model:value.trim="form.oldPassword" type="password" placeholder="Enter current password" />
      </a-form-item>
      <a-form-item label="New Password" name="newPassword" required :help="tips">
        <a-input v-model:value.trim="form.newPassword" type="password" placeholder="Enter new password" />
      </a-form-item>
      <a-form-item label="Confirm Password" name="confirmPwd" required :help="tips">
        <a-input v-model:value.trim="form.confirmPwd" type="password" placeholder="Re-enter new password" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="cancelModal" v-if="!isInit">Close</a-button>
      <a-button type="primary" @click="updatePwd" :loading="isLoading">Save</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import { ref, reactive, watch, onMounted, watchEffect } from 'vue';
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/system/user';

  const props = defineProps({
    display: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['update:display', 'onLogout']);

  const visible = ref(false);
  const userInfo = useUserStore();
  const formRef = ref();
  const tips = 'Password must be 6-20 characters long and contain numbers or letters'; // validation rule
  const reg = /^[A-Za-z0-9]{6,20}$/;
  const isInit = ref(false);
  const isLoading = ref(false);
  const rules = {
    oldPassword: [{ required: true, message: 'Please enter your current password' }],
    newPassword: [{ type: 'string', pattern: reg, message: 'Invalid password format' }],
    confirmPwd: [{ type: 'string', pattern: reg, message: 'Please confirm your password' }],
  };

  const formDefault = {
    oldPassword: '',
    newPassword: '',
  };

  let form = reactive({
    ...formDefault,
  });

  async function updatePwd() {
    formRef.value.validate().then(async () => {
      if (form.newPassword !== form.confirmPwd) {
        message.error('New password and confirm password do not match');
        return;
      }
      try {
        isLoading.value = true;
        //await updatePassword({ ...form, staffNo: 'asdf' });
        message.success('Updated successfully');
        visible.value = false;
        cancelModal();
        // need login
        emits('onLogout');
      } finally {
        isLoading.value = false;
      }
    });
  }

  function showModal() {
    visible.value = true;
    form.oldPassword = '';
    form.newPassword = '';
    form.confirmPwd = '';
  }

  function cancelModal() {
    visible.value = false;
    emits('update:display', false);
  }
  watch(
    () => props.display,
    (val) => {
      if (val) showModal();
    },
    { immediate: true }
  );

  watchEffect(() => {
    if (userInfo.passwordStatus === 'INIT') {
      isInit.value = true;
      visible.value = true;
    }
  });

  defineExpose({ showModal });
</script>
