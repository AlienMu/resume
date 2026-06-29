import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import i18n from '/@/i18n';
import { getAccountSettings, updateAccountSettings } from '/@/api/account';
import { uploadFile } from '/@/api/upload';
import { useUserStore } from '/@/store/modules/system/user';

export const AVATAR_ACCEPT_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
export const AVATAR_MAX_SIZE_MB = 5;
const { setAvatar } = useUserStore();
const getI18nLabel = (key, ...args) => i18n.global.t(`userCenter.content.accountSetting.${key}`, ...args);

const createDefaultForm = () => ({
  avatar: '',
  englishName: '',
  position: '',
  phone: '',
  phonePublic: 1,
  email: '',
  telegramAccount: '',
});

export const useAccountSetting = () => {
  const form = reactive(createDefaultForm());
  const snapshot = ref(createDefaultForm());
  const isLoading = ref(false);
  const buttonLoading = reactive({
    name: false,
    job: false,
  });
  const phonePublicLoading = ref(false);
  const avatarUploading = ref(false);

  const fetchAccountSettings = async () => {
    try {
      isLoading.value = true;
      const data = await getAccountSettings();
      const next = {
        avatar: data?.avatar ?? '',
        englishName: data?.englishName ?? '',
        position: data?.position ?? '',
        phone: data?.phone ?? '',
        phonePublic: typeof data?.phonePublic === 'number' ? data.phonePublic : 1,
        email: data?.email ?? '',
        emailVerified: data.emailVerified,
        telegramAccount: data?.telegramAccount ?? '',
      };
      Object.assign(form, next);
      snapshot.value = { ...next };
      return next;
    } catch (error) {
      message.error(getI18nLabel('messages.loadFailed'));
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const revertField = (field) => {
    if (!field) return;
    form[field] = snapshot.value[field] ?? '';
  };

  const saveField = async (type, payload, options = {}) => {
    if (!payload || Object.keys(payload).length === 0) return false;
    buttonLoading[type] = true;
    const prevValues = {};
    Object.keys(payload).forEach((key) => {
      prevValues[key] = form[key];
    });
    try {
      await updateAccountSettings(payload);
      snapshot.value = {
        ...snapshot.value,
        ...payload,
      };
      message.success(i18n.global.t('common.messages.success.save'));
      return true;
    } catch (error) {
      Object.keys(payload).forEach((key) => {
        form[key] = prevValues[key];
      });
      message.error(error?.message || i18n.global.t('common.messages.failed.save'));
      return false;
    } finally {
      buttonLoading[type] = false;
    }
  };

  const updatePhonePublic = async (value) => {
    const targetValue = Number(value);
    if (Number.isNaN(targetValue) || targetValue === snapshot.value.phonePublic) return;
    phonePublicLoading.value = true;
    try {
      await updateAccountSettings({ phonePublic: targetValue });
      snapshot.value.phonePublic = targetValue;
      message.success(i18n.global.t('common.messages.success.update'));
    } catch (error) {
      form.phonePublic = snapshot.value.phonePublic;
      message.error(error?.message || i18n.global.t('common.messages.failed.update'));
    } finally {
      phonePublicLoading.value = false;
    }
  };

  const uploadAvatarFile = async (file) => {
    if (!file) return false;
    avatarUploading.value = true;
    try {
      const data = await uploadFile({
        file,
      });
      const fileUrl = data?.url;
      await updateAccountSettings({ avatar: fileUrl });
      form.avatar = fileUrl;
      snapshot.value.avatar = fileUrl;
      setAvatar(fileUrl);
      message.success(i18n.global.t('common.messages.success.update'));
      return true;
    } catch (error) {
      message.error(error?.message || i18n.global.t('common.messages.failed.update'));
      return false;
    } finally {
      avatarUploading.value = false;
    }
  };

  return {
    form,
    snapshot,
    isLoading,
    buttonLoading,
    phonePublicLoading,
    avatarUploading,
    fetchAccountSettings,
    revertField,
    saveField,
    updatePhonePublic,
    uploadAvatarFile,
  };
};
