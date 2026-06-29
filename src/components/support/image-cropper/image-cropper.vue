<template>
  <a-modal
    width="540px"
    @close="onClose"
    @cancel="onClose"
    centered
    v-model:open="isOpen"
    @ok="onCropped"
    wrap-class-name="mui-modal"
    :title="$t('common.upload.cropper')"
  >
    <div class="image-cropper">
      <vue-cropper
        ref="cropper"
        :img="uploadImg"
        :outputSize="1"
        :outputType="'png'"
        :autoCrop="true"
        :canMove="false"
        :enlarge="2"
        :limitMinSize="300"
        :canScale="false"
        :fixed="true"
        :fixedNumber="[1, 1]"
        class="cropper"
      />
    </div>
  </a-modal>
</template>

<script setup>
  import { ref } from 'vue';
  import { VueCropper } from 'vue-cropper';
  import 'vue-cropper/dist/index.css';
  const isOpen = ref(false);

  const uploadImg = ref('');

  const cropper = ref();

  const emit = defineEmits(['cropped']);

  const handleOpen = (img) => {
    isOpen.value = true;
    uploadImg.value = img;
  };

  const onClose = () => {
    uploadImg.value = '';
    cropper.value.clearCrop();
  };

  const onCropped = () => {
    cropper.value.getCropData((url) => {
      emit('cropped', url);
      isOpen.value = false;
    });
  };

  defineExpose({
    handleOpen,
  });
</script>

<style scoped lang="less">
  .image-cropper {
    width: 500px;
    height: 500px;
  }
</style>
