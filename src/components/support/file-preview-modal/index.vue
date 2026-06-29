<template>
  <rm-modal :footer="null" isDraggable v-model:open="open" :title="props.title" :mask="false" :maskClosable="false" width="60%">
    <div style="height: 70vh; width: 100%; display: flex; flex-direction: column">
      <div style="width: 100%; padding: 24px; flex: 1">
        <img :url="currentUrl" v-if="imgFileType.includes(currentFileType)" style="width: 100%; height: 100%; visibility: hidden" ref="imgRef" />
        <video-player ref="videoPlayerRef" style="height: 100%" v-show="videoFileType.includes(currentFileType)" :src="currentUrl" />
      </div>
      <div style="width: 100%; overflow: auto" v-if="fileList.length > 1">
        <div style="position: absolute; left: 26px; top: 50%; transform: translate(0, -50%)">
          <a-button class="arrow-button" :disabled="currentIndex === 0" shape="circle" @click="handleUpdate(currentIndex - 1)">
            <template #icon>
              <LeftOutlined />
            </template>
          </a-button>
        </div>
        <div style="position: absolute; right: 26px; top: 50%; transform: translate(0, -50%)">
          <a-button
            :disabled="props.fileList.length - 1 === currentIndex"
            @click="handleUpdate(currentIndex + 1)"
            shape="circle"
            class="arrow-button"
          >
            <template #icon><RightOutlined /></template>
          </a-button>
        </div>
      </div>
      <div class="footer" v-if="props.isShowFooter">
        <div style="text-align: center">
          <a-typography-title style="font-size: 16px">{{
            fileList[currentIndex].name || getFileName(fileList[currentIndex].url)
          }}</a-typography-title>
          <a-typography-text style="font-size: 16px">
            <span class="rm-primary-color">{{ currentIndex + 1 }}</span>
            /{{ fileList.length }}
          </a-typography-text>
        </div>
        <Swiper
          @swiper="swiperRef = $event"
          :modules="[]"
          freeMode
          resistanceRatio="0"
          :centeredSlides="true"
          :slide-to-clicked-slide="true"
          :slidesPerGroup="1"
          slidesPerView="auto"
          :space-between="20"
          :loop="false"
          :autoplay="false"
          :pagination="false"
          @slide-change="handleSlideChange"
        >
          <swiper-slide class="viewer-list" v-for="(item, index) in fileList" :key="index">
            <div class="content" :style="`background-image: url(${getUrl(item, index)})`"></div>
          </swiper-slide>
        </Swiper>
      </div>
    </div>
  </rm-modal>
</template>

<script setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import VideoPlayer from '/@/components/support/video-player/index.vue';
  import 'viewerjs/dist/viewer.css';
  import Viewer from 'viewerjs';
  import { imgFileType, videoFileType } from '/@/constants/common-const';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/css';
  import { getFileName, getUrlFileType } from '/@/utils/str-util';

  let viewer = null;

  const imgRef = ref();

  const videoPlayerRef = ref();

  const props = defineProps({
    fileList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'Preview',
    },
    previewCurrent: [Number, String],
    visible: Boolean,
    isShowFooter: Boolean,
  });

  const currentIndex = ref(0);

  const swiperRef = ref();

  const thumbnailMap = ref(new Map());

  const emits = defineEmits(['update:visible']);

  const currentUrl = computed(() => props.fileList[currentIndex.value]?.url || '');

  const currentFileType = computed(() => currentUrl.value.match(/[^/]+\.(\w{2,})$/) && '.' + currentUrl.value.match(/[^/]+\.(\w{2,})$/)[1]);

  const open = computed({
    set: (val) => {
      emits('update:visible', val);
    },
    get: () => {
      return props.visible;
    },
  });

  /**
   * Get the cover image of a video
   * @param url video URL
   * @param second seconds
   */
  async function getVideoBase64(url, second = 5) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.setAttribute('crossOrigin', 'anonymous'); // handle cross-origin
      video.setAttribute('src', url);
      // Mute to prevent playback failure
      video.setAttribute('muted', 'muted');
      video.onloadeddata = () => {
        video.currentTime = second;
        video.onseeked = async () => {
          const canvas = document.createElement('canvas');
          const { videoWidth: width, videoHeight: height } = video; // Canvas dimensions match the image
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(video, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png'));
        };
      };
    });
  }

  const getThumbnail = async (url) => {
    return await getVideoBase64(url);
  };

  const getUrl = (item) => {
    if (videoFileType.includes(getUrlFileType(item.url))) {
      return thumbnailMap.value.get(item.url);
    }
    return item.url;
  };

  const handleSlideChange = (swiper) => {
    handleUpdate(swiper.activeIndex, true);
  };

  const handleInitThumbnail = () => {
    props.fileList.forEach(async (item) => {
      if (videoFileType.includes(getUrlFileType(item.url))) {
        if (!thumbnailMap.value.has(item.url)) {
          const base64 = await getThumbnail(item.url);
          thumbnailMap.value.set(item.url, base64);
        }
      }
    });
  };

  const handleUpdate = (index, bool = false) => {
    currentIndex.value = index;
    if (!bool && swiperRef.value) swiperRef.value.slideTo(index);
    if (imgRef.value) createImgView();
  };

  const createImgView = () => {
    if (viewer) viewer.destroy();
    viewer = new Viewer(imgRef.value, {
      url: 'url',
      inline: true,
      navbar: false,
      button: false,
      backdrop: false,
      title: false,
      toolbar: {
        zoomOut: false,
        zoomIn: false,
        rotateRight: false,
        rotateLeft: false,
        flipVertical: false,
        flipHorizontal: false,
      },
    });
  };

  watch(imgRef, () => {
    createImgView();
  });

  watch(
    () => [props.previewCurrent, props.fileList],
    () => {
      if (typeof props.previewCurrent === 'number') {
        currentIndex.value = props.previewCurrent;
        nextTick(() => {
          if (swiperRef.value) swiperRef.value.slideTo(props.previewCurrent);
        });
      }
      handleInitThumbnail();
      if (imgRef.value) createImgView();
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.viewer-container) {
    background: transparent;
  }

  .footer {
    background: #fff;
    padding-top: 16px;
    .swiper-slide-active {
      .content {
        border: 2px solid @primary-color;
      }
    }
    .viewer-list {
      height: 120px;

      width: 120px;
      .content {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        margin-right: 16px;
        border-radius: 4px;
        overflow: hidden;
        filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.12));
      }
    }
  }

  .arrow-button {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.12);
    width: 36px;
    height: 36px;
    line-height: 20px;
    font-size: 20px;
    border: none;
    background: #fff;
  }
</style>
