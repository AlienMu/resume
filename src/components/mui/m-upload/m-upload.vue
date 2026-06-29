<template>
  <a-flex gap="10" wrap="wrap">
    <a-upload
      multiple
      class="upload"
      :accept="props.accept"
      v-bind="$attrs"
      :before-upload="beforeUpload"
      :customRequest="customRequest"
      :showUploadList="false"
      list-type="text"
      :file-list="fileList"
      @change="handleChange"
      @remove="handleRemove"
    >
      <a-button class="upload-button">
        <a-flex align="center" gap="17">
          <svg-icon name="upload" class="upload-icon" />
          <a-flex class="upload-button-text" vertical style="text-align: left">
            <strong>{{ $t('common.upload.uploadText') }}</strong>
            <span class="upload-hint">
              <span class="file-type-text">{{ $t('common.upload.fileType', { type: props.accept }) }}</span
              >,
              {{ $t('common.upload.fileSize', { size: props.maxSize }) }}
            </span>
          </a-flex>
        </a-flex>
      </a-button>
    </a-upload>
    <a-flex gap="20" class="upload-item" align="center" v-for="(file, index) in fileList" :key="file.uid">
      <template v-if="file.status === 'uploading'">
        <svg-icon name="file" class="upload-icon" />
        <a-flex class="upload-item-text" vertical>
          <strong>{{ file.fileName }}</strong>
          <a-flex gap="5">
            <a-progress style="width: 200px" :percent="file.percent" :show-info="false" size="small" />
          </a-flex>
        </a-flex>
      </template>
      <template v-else>
        <svg-icon name="file" class="upload-icon" />
        <a-flex class="upload-item-text" vertical>
          <a-typography-text class="strong" :ellipsis="{ tooltip: true }" :content="file?.fileName" />
          <a-flex gap="5">
            <span>{{ file.fileSize }}mb</span>
            <span>{{ $t('userCenter.content.resumeEdit.form.uploadDate', { date: file.fileDate }) }}</span>
          </a-flex>
        </a-flex>
        <a-button type="text" size="small" shape="circle" class="remove" @click="handleRemove(file, index)">
          <svg-icon name="close-circle" />
        </a-button>
      </template>
    </a-flex>
  </a-flex>
</template>

<script setup>
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { computed } from 'vue';
  import { message } from 'ant-design-vue';
  import { muiSentry } from '/@/lib/mui-sentry';
  import { uploadFile } from '/@/api/upload';
  import { useInjectFormItemContext } from 'ant-design-vue/es/form';
  import { imgFileType } from '/@/constants/common-const';
  import { getUrlFileType } from '/@/utils/str-util';
  import dayjs, { Dayjs } from 'dayjs';
  import Decimal from 'decimal.js';

  const props = defineProps({
    files: {
      type: Array,
      default: () => [],
    },
    accept: {
      type: String,
      default: imgFileType.join(', '),
    },
    maxUploadSize: {
      type: Number,
      default: 10,
    },
    maxSize: {
      type: Number,
      default: 10,
    },
  });

  const { onFieldChange } = useInjectFormItemContext();

  const fileList = computed({
    get: () => props.files,
    set: (val) => emit('update:files', val),
  });

  const emit = defineEmits(['change', 'remove', 'update:files']);

  const validAccept = (file) => {
    if (props.accept) {
      const suffixIndex = file.name.lastIndexOf('.') + 1;
      const fileSuffix = file.name.substring(suffixIndex <= -1 ? 0 : suffixIndex).toLowerCase();
      if (props.accept.indexOf(fileSuffix) === -1) {
        return false;
      }
    }
    return true;
  };

  function beforeUpload(file, files) {
    if (fileList.value.length + files.length > props.maxUploadSize) {
      message.warning(`You can upload up to ${props.maxUploadSize} file(s)`);
      return false;
    }

    if (!validAccept(file)) {
      message.warning(`Only ${props.accept.replaceAll(',', ' ')} files are supported`);
      return false;
    }

    const isLimitSize = file.size / 1024 / 1024 < props.maxSize;

    if (!isLimitSize) {
      message.warning(`Each file must be smaller than ${props.maxSize} Mb`);
      return false;
    }

    return true;
  }

  function handleChange(info) {
    let fileStatus = info.file.status;
    let file = info.file;
    if (fileStatus === 'removed') {
      let index = fileList.value.findIndex((e) => e.uid === file.uid);
      if (index !== -1) {
        const file = fileList.value.splice(index, 1);
        emit('change', fileList.value, file);
      }
    }
  }

  const setAutoAddProgress = (index, percent) => {
    fileList.value[index].percent = percent * 100;
  };

  const customRequest = async (options) => {
    const file = {
      status: 'uploading',
      fileName: options.file.name,
      uid: options.file.uid,
      id: '',
      percent: 0,
    };
    let index = 0;
    try {
      fileList.value.push(file);
      index = fileList.value.length - 1;
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await uploadFile({
        file: options.file,
        maxSize: props.maxSize,
        onProgress: (data) => setAutoAddProgress(index, data),
      });

      file.fileSize = new Decimal(options.file.size).div(1024).div(1024).toFixed(2);
      file.fileDate = new dayjs().format('YYYY-MM-DD HH:mm:ss');
      file.url = data.url;
      file.id = data.id;
      file.fileName = data.name;
      file.fileType = getUrlFileType(data.url);
      fileList.value[index].percent = 100;
      file.status = 'done';
      fileList.value[index] = {
        ...fileList.value[index],
        ...file,
      };
      emit('update:value', fileList.value);
      emit('change', fileList.value, fileList.value[index]);
      onFieldChange();
    } catch (e) {
      muiSentry.captureError(e);
      fileList.value.splice(index, 1);
    }
  };

  function handleRemove(file, index) {
    fileList.value.splice(index, 1);
    emit('remove', file);
  }
</script>

<style scoped lang="less">
  .upload-icon {
    font-size: 38px;
    color: @primary-color;
  }
  .upload-button {
    width: 380px;
    height: 80px;
    padding: 0 20px;
    border-radius: 8px;
  }
  .upload-item {
    width: 380px;
    height: 80px;
    padding: 0 20px;
    border-radius: 8px;
    border: 1px solid rgba(237, 237, 237, 1);
    position: relative;
    background: #fff;
    .remove {
      color: @font-tip-color;
      font-size: 18px;
      line-height: 18px;
      padding: 0;
      position: absolute;
      right: -9px;
      top: -9px;
    }
  }

  .upload-button-text,
  .upload-item-text {
    .strong {
      font-weight: 400;
      color: @font-sub-color;
      font-size: 16px;
      max-width: 12em;
    }
    span {
      font-size: 12px;
      color: @font-tip-color;
    }
    .upload-hint {
      display: inline-flex;
      max-width: 280px;
      .file-type-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-shrink: 1;
        min-width: 0;
      }
    }
  }

  .upload {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;

    :deep(.ant-upload-list) {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
</style>
