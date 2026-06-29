<template>
  <a-upload
    multiple
    class="mui-upload-card"
    :class="{ 'mui-upload-card--small': size === 'small' }"
    :accept="props.accept"
    :disabled="props.disabled"
    v-bind="$attrs"
    :before-upload="beforeUpload"
    :customRequest="customRequest"
    :file-list="fileList"
    list-type="picture-card"
    @change="handleChange"
    @remove="handleRemove"
  >
    <div v-if="fileList.length < props.maxUploadSize && !props.disabled">
      <span class="upload-button"><svg-icon name="plus" /></span>
    </div>
    <template #itemRender="{ file, actions }">
      <template v-if="file.status === 'uploading'">
        <div class="ant-upload-list-item ant-upload-list-item-uploading">
          <div class="ant-upload-list-item-progress" style="width: 80%; left: 10%; bottom: 40%">
            <a-progress :percent="file.percent" :show-info="false" size="small" />
          </div>
        </div>
      </template>
      <template v-if="file.status === 'done' || !file.status">
        <div class="ant-upload-list-item">
          <template v-if="imgFileType.includes(file.fileType)">
            <a-image :src="file.url" width="100%" height="100%" :preview="false" />
          </template>
          <template v-else-if="videoFileType.includes(file.fileType)">
            <video style="width: 100%; height: 100%">
              <source :src="file.url" />
            </video>
          </template>
          <template v-else>
            <div class="ant-upload-list-item-thumbnail ant-upload-list-item-file">
              <a-flex align="center" justify="center" style="height: 100%">
                <span style="font-size: 60px">
                  <svg width="1em" height="1em" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M30.0445 10.1496C30.2555 10.3605 30.375 10.6453 30.375 10.9441V32.625C30.375 33.2473 29.8723 33.75 29.25 33.75H6.75C6.12773 33.75 5.625 33.2473 5.625 32.625V3.375C5.625 2.75273 6.12773 2.25 6.75 2.25H21.6809C21.9797 2.25 22.268 2.36953 22.4789 2.58047L30.0445 10.1496ZM27.7805 11.4609L21.1641 4.84453V11.4609H27.7805ZM11.25 16.9453C11.1754 16.9453 11.1039 16.9749 11.0511 17.0277C10.9984 17.0804 10.9688 17.152 10.9688 17.2266V18.9141C10.9688 18.9887 10.9984 19.0602 11.0511 19.1129C11.1039 19.1657 11.1754 19.1953 11.25 19.1953H24.75C24.8246 19.1953 24.8961 19.1657 24.9489 19.1129C25.0016 19.0602 25.0312 18.9887 25.0312 18.9141V17.2266C25.0312 17.152 25.0016 17.0804 24.9489 17.0277C24.8961 16.9749 24.8246 16.9453 24.75 16.9453H11.25ZM11.25 21.7266C11.1754 21.7266 11.1039 21.7562 11.0511 21.8089C10.9984 21.8617 10.9688 21.9332 10.9688 22.0078V23.6953C10.9688 23.7699 10.9984 23.8414 11.0511 23.8942C11.1039 23.9469 11.1754 23.9766 11.25 23.9766H17.7188C17.7933 23.9766 17.8649 23.9469 17.9176 23.8942C17.9704 23.8414 18 23.7699 18 23.6953V22.0078C18 21.9332 17.9704 21.8617 17.9176 21.8089C17.8649 21.7562 17.7933 21.7266 17.7188 21.7266H11.25Z"
                      fill="#7B79FA"
                      fill-opacity="0.85"
                    />
                  </svg>
                </span>
              </a-flex>
            </div>
          </template>

          <span v-if="!props.disabled" class="mui-upload-card-remove" @click="actions.remove">
            <svg-icon name="close-block" />
          </span>

          <div class="ant-upload-list-item-footer" v-if="props.isShowName">
            <slot name="footer" :file="file">
              <span>{{ file.name }}</span>
            </slot>
          </div>
          <slot name="mantle" :file="file"></slot>
        </div>
      </template>
    </template>
  </a-upload>
</template>

<script setup>
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import { computed, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import { muiSentry } from '/@/lib/mui-sentry';
  import { uploadFile } from '/@/api/upload';
  import { useInjectFormItemContext } from 'ant-design-vue/es/form';
  import { imgFileType, videoFileType } from '/@/constants/common-const';
  import { getUrlFileType } from '/@/utils/str-util';

  const props = defineProps({
    files: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: 'default',
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
    disabled: {
      type: Boolean,
      default: false,
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
      message.warning(`You can upload at most ${props.maxUploadSize} file(s).`);
      return false;
    }

    if (!validAccept(file)) {
      message.warning(`Only ${props.accept.replaceAll(',', ' ')} file formats are supported`);
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
      name: options.file.name,
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

      file.fileType = getUrlFileType(data.url);
      file.url = data.url;
      fileList.value[index].percent = 100;
      setTimeout(() => {
        file.status = 'done';
        fileList.value[index] = {
          ...fileList.value[index],
          ...file,
        };
        emit('update:value', fileList.value);
        emit('change', fileList.value, fileList.value[index]);
        onFieldChange();
      }, 300);
    } catch (e) {
      muiSentry.captureError(e);
      fileList.value[index].status = 'error';
    }
  };

  function handleRemove(file) {
    const index = fileList.value.findIndex((e) => e.url === file.url);
    fileList.value.splice(index, 1);
    emit('remove', file);
  }
</script>

<style lang="less">
  .mui-upload-card {
    &.mui-upload-card--small {
      .ant-upload-select-picture-card {
        width: 70px !important;
        height: 70px !important;
      }
      .ant-upload-list-item,
      .ant-upload-list-item-container {
        width: 70px !important;
        height: 70px !important;
      }
      .mui-upload-card-remove {
        font-size: 18px;
        right: 0;
        top: -3px;
      }
    }
    .ant-upload-select-picture-card {
      height: 160px !important;
      background: transparent !important;
      width: 230px !important;
    }
    .ant-upload-list-item {
      padding: 0 !important;
      &:before {
        display: none;
      }
    }

    .ant-upload-list-item,
    .ant-upload-list-item-container {
      height: 160px !important;
    }
    .mui-upload-card-remove {
      font-size: 32px;
      line-height: 1em;
      position: absolute;
      cursor: pointer;
      right: -1px;
      top: -5px;
      z-index: 9;
    }
  }

  .upload-button {
    font-size: 20px;
    color: @primary-color;
  }
</style>
