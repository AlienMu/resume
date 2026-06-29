<template>
  <div class="clearfix">
    <template v-if="props.dragger">
      <a-upload-dragger
        multiple
        :accept="props.accept"
        :before-upload="beforeUpload"
        :customRequest="customRequest"
        :file-list="fileList"
        list-type="picture"
        @change="handleChange"
        @preview="handlePreview"
        @remove="handleRemove"
        v-bind="$attrs"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined />
        </p>
        <p class="ant-upload-text">Click or drag a file to this area to upload</p>
        <p class="ant-upload-hint">{{ maxUploadSize > 1 ? 'Single or batch upload supported. ' : '' }}Supported formats: {{ imgFileType.join('/') }}</p>
      </a-upload-dragger>
    </template>
    <template v-else>
      <a-upload
        multiple
        class="upload"
        :accept="props.accept"
        v-bind="$attrs"
        :before-upload="beforeUpload"
        :customRequest="customRequest"
        :file-list="fileList"
        :list-type="listType"
        @change="handleChange"
        @preview="handlePreview"
        @remove="handleRemove"
        :class="showReplace && !(fileList.length < props.maxUploadSize && !props.disabled) ? 'hide-replace' : ''"
      >
        <div v-if="fileList.length < props.maxUploadSize && !props.disabled" @click="currentAction = ''">
          <template v-if="listType === 'picture-card'">
            <div style="color: #7b79fa">
              <PlusOutlined />
              <div class="ant-upload-text" style="padding: 0 6px">Click to upload</div>
              <div class="ant-upload-footer">
                <slot name="footer">{{ buttonText }}</slot>
              </div>
            </div>
          </template>
          <template v-if="listType === 'text'">
            <a-button>
              <upload-outlined />
              {{ buttonText }}
            </a-button>
          </template>
        </div>
        <div v-if="showReplace" ref="plusIcon"></div>
        <template #itemRender="{ file, actions }">
          <template v-if="file.status === 'uploading'">
            <div class="ant-upload-list-item ant-upload-list-item-uploading">
              <div class="ant-upload-list-item-thumbnail">Uploading</div>
              <div class="ant-upload-list-item-progress">
                <a-progress :percent="file.percent" :show-info="false" size="small" />
              </div>
            </div>
          </template>
          <template v-if="file.status === 'done' || !file.status">
            <div class="ant-upload-list-item ant-upload-list-item-done">
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
              <span class="ant-upload-list-item-actions">
                <a-button
                  title="Preview"
                  v-if="allowAction.includes('preview')"
                  class="ant-upload-list-item-action ant-btn-icon-only"
                  @click="actions.preview"
                  type="text"
                  :disabled="false"
                  size="small"
                >
                  <EyeOutlined />
                </a-button>
                <a-button
                  title="Delete"
                  v-if="allowAction.includes('remove') && !disabled"
                  class="ant-upload-list-item-action ant-btn-icon-only"
                  @click="actions.remove"
                  type="text"
                  size="small"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
                <a-button title="Re-upload" v-if="allowAction.includes('re-upload')" @click="reUpload(file)" type="text" size="small">
                  <slot name="re-upload"> <UndoOutlined style="color: #ccc" /></slot>
                </a-button>
              </span>
              <div class="ant-upload-list-item-footer" v-if="props.isShowName">
                <slot name="footer" :file="file">
                  <span>{{ file.name }}</span>
                </slot>
              </div>
              <slot name="mantle" :file="file"></slot>
            </div>
          </template>
          <template v-if="file.status === 'error'">
            <div class="ant-upload-list-item ant-upload-list-item-error">
              <div class="ant-upload-list-item-thumbnail ant-upload-list-item-file" style="padding-top: 20px">
                <span role="img" aria-label="picture" class="anticon anticon-picture">
                  <svg focusable="false" data-icon="picture" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                    <path
                      d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792zm0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2z"
                      fill="#1890ff"
                    />
                    <path d="M424.6 765.8l-150.1-178L136 752.1V792h752v-30.4L658.1 489z" fill="#e6f7ff" />
                    <path
                      d="M136 652.7l132.4-157c3.2-3.8 9-3.8 12.2 0l144 170.7L652 396.8c3.2-3.8 9-3.8 12.2 0L888 662.2V232H136v420.7zM304 280a88 88 0 110 176 88 88 0 010-176z"
                      fill="#e6f7ff"
                    />
                    <path d="M276 368a28 28 0 1056 0 28 28 0 10-56 0z" fill="#e6f7ff" />
                    <path
                      d="M304 456a88 88 0 100-176 88 88 0 000 176zm0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z"
                      fill="#1890ff"
                    /></svg
                  ><!----></span
                >
              </div>
              <span class="ant-upload-list-item-name" style="width: 100%">Upload failed</span>
              <span class="ant-upload-list-item-actions">
                <a-button
                  title="Delete"
                  v-if="allowAction.includes('remove') && !disabled"
                  class="ant-upload-list-item-action ant-btn-icon-only"
                  @click="actions.remove"
                  type="text"
                  size="small"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </span>
            </div>
          </template>
        </template>
      </a-upload>
    </template>
    <FilePreviewModal
      :is-show-footer="isShowPreviewFooter"
      :previewCurrent="previewIndex"
      v-model:visible="previewVisible"
      :fileList="fileList"
      title="Media preview"
    />
  </div>
</template>
<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { uploadFile } from '/@/api/upload';
  import { muiSentry } from '/@/lib/mui-sentry';
  import { imgFileType, videoFileType } from '/@/constants/common-const';
  import FilePreviewModal from '/@/components/support/file-preview-modal/index.vue';
  import { getUrlFileType } from '/@/utils/str-util.js';
  import { useInjectFormItemContext } from 'ant-design-vue/es/form';

  const props = defineProps({
    value: String,
    isShowPreviewFooter: Boolean,
    disabled: Boolean,
    buttonText: {
      type: String,
      default: 'Click to upload attachment',
    },
    dragger: {
      type: Boolean,
      default: false,
    },
    showUploadBtn: {
      type: Boolean,
      default: true,
    },
    isPaste: {
      type: Boolean,
      default: true,
    },
    defaultFileList: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // Maximum number of files allowed
    maxUploadSize: {
      type: Number,
      default: 1,
    },
    maxSize: {
      type: Number,
      default: 10,
    },
    // Accepted file types
    accept: {
      type: String,
      default: '',
    },
    // Built-in style of the upload list, supports three basic styles: text, picture and picture-card
    listType: {
      type: String,
      default: 'picture-card',
    },
    allowAction: {
      type: Array,
      default: () => {
        return ['preview', 'remove'];
      }, // 're-upload'
    },
    isShowName: {
      type: Boolean,
      default: false,
    },
  });

  const { onFieldChange } = useInjectFormItemContext();

  const plusIcon = ref();

  const currentAction = ref('');

  const replaceFile = ref();

  const previewIndex = ref(0);

  const previewVisible = ref(false);

  const showReplace = computed(() => props.allowAction.includes('re-upload'));

  const reUpload = (file) => {
    currentAction.value = 're-upload';
    replaceFile.value = file;
    plusIcon.value.click();
  };

  // -------------------- logic --------------------

  const fileList = ref([]);

  watch(
    () => props.value,
    (value) => {
      if (!value) {
        fileList.value = [];
        return;
      }
      if (Array.isArray(value)) {
        fileList.value = value;
      } else {
        fileList.value = [
          {
            url: props.value,
            fileType: getUrlFileType(value),
            name: value?.match(/.*\/([^/?#]+)(?=[?#]|$)/)?.[1],
            status: 'done',
          },
        ];
      }
    },
    {
      immediate: true,
    }
  );

  const emit = defineEmits(['update:value', 'change', 'onRemove']);

  const setAutoAddProgress = (index, { percent }) => {
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
      if (currentAction.value === 're-upload') {
        fileList.value.forEach((el, i) => {
          if (el.uid === replaceFile.value.uid) {
            Object.assign(el, file);
            index = i;
          }
        });
      } else {
        fileList.value.push(file);
        index = fileList.value.length - 1;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await uploadFile({
        file: options.file,
        maxSize: props.maxSize,
        onProgress: (data) => setAutoAddProgress(index, data),
      });

      file.url = data.storageAddress;
      file.id = data.id;
      file.name = data.name;
      file.fileType = data.type;
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
      fileList.value[index].status = 'error';
    }
  };

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

  function handleRemove(file) {
    emit('onRemove', file);
  }

  function beforeUpload(file, files) {
    if (fileList.value.length + files.length > props.maxUploadSize && currentAction.value !== 're-upload') {
      showErrorMsgOnce(`You can upload at most ${props.maxUploadSize} file(s).`);
      return false;
    }

    if (!validAccept(file)) {
      showErrorMsgOnce(`Only ${props.accept.replaceAll(',', ' ')} file formats are supported`);
      return false;
    }

    const isLimitSize = file.size / 1024 / 1024 < props.maxSize;
    if (!isLimitSize) {
      showErrorMsgOnce(`Each file must be smaller than ${props.maxSize} Mb`);
      return false;
    }

    return true;
  }

  const showErrorMsgOnce = (content) => {
    message.warning(content);
  };

  const validAccept = (file) => {
    if (props.accept) {
      const suffixIndex = file.name.lastIndexOf('.');
      const fileSuffix = file.name.substring(suffixIndex <= -1 ? 0 : suffixIndex).toLowerCase();
      if (props.accept.indexOf(fileSuffix) === -1) {
        return false;
      }
    }
    return true;
  };

  const handlePreview = async (file) => {
    previewIndex.value = fileList.value.findIndex((item) => item.uid === file.uid);
    previewVisible.value = true;
  };

  // ------------------------ paste ------------------------
  const handlePaste = (event) => {
    if (props.disabled) return;
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //if (!items || items.length === 0) return message.warn('The current browser does not support pasting local images, please try another method!');
    for (let item in items) {
      if (items[item].kind !== 'file') return; // ignore non-file types
      const file = items[item].getAsFile(); //
      if (!file) return; // ignore empty file
      if (beforeUpload(file, items)) {
        customRequest({ file });
      }
    }
  };
  const initPaste = () => {
    if (props.isPaste) {
      window.addEventListener('paste', handlePaste);
    }
  };
  onMounted(initPaste);
  onUnmounted(() => {
    document.removeEventListener('paste', handlePaste);
  });

  // ------------------------ clear upload ------------------------
  function clear() {
    fileList.value = [];
  }

  defineExpose({
    clear,
  });
</script>
<style lang="less" scoped>
  .upload {
    :deep(.ant-upload-picture-card-wrapper) {
      display: flex;
    }

    .ant-upload-footer {
      left: 0;
      bottom: 0;
      position: absolute;
      width: 100%;
      font-size: 12px;
      color: #fff;
      line-height: 24px;
      height: 24px;
      background: rgba(@primary-color, 0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :deep(.ant-upload-select-picture-card) {
      position: relative;
      padding-bottom: 24px;
      box-sizing: border-box;
    }
    .ant-upload-list-item {
      border: none !important;
      border-radius: 4px;
      overflow: hidden;
      &:not(.ant-upload-list-item-uploading) {
        padding: 0 !important;
      }
      &:before {
        width: 100% !important;
        height: 100% !important;
      }

      .ant-upload-list-item-footer {
        z-index: 2;
        .ant-upload-footer;
      }
    }

    .ant-upload-list-item-loading {
      margin-top: 20px;
      text-align: center;
    }
  }

  .hide-replace {
    :deep(.ant-upload-select) {
      display: none;
    }
  }
</style>
