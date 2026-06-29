<template>
  <div class="video-container" ref="containerRef">
    <video ref="videoRef" class="video-js"></video>
  </div>
</template>
<script setup>
  import videoJs from 'video.js';
  import { onMounted, ref, watch } from 'vue';
  import 'videojs-flvjs-es6';
  import 'video.js/dist/video-js.css';

  const videoRef = ref();
  const props = defineProps({
    src: String,
  });
  const containerRef = ref();
  const getVideoType = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    switch (fileExtension) {
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'ogv':
        return 'video/ogg';
      case 'MOV':
        return 'video/quicktime';
      case 'flv':
        return 'video/flv';
      // 可根据需要添加更多视频格式
      default:
        return '';
    }
  };
  const video = ref(null);

  watch(
    () => props.src,
    () => {
      video.value.src('');
      video.value.poster('');
      video.value.src({
        src: props.src,
        type: getVideoType(props.src),
      });
    }
  );

  onMounted(() => {
    video.value = videoJs(videoRef.value, {
      autoplay: false,
      controls: true,
      techOrder: ['html5', 'flvjs'],
      html5: {
        hls: {
          withCredentials: true,
        },
      },
      flvjs: {
        mediaDataSource: {
          cors: true,
          withCredentials: false,
        },
      },
      sources: [
        {
          src: props.src,
          type: getVideoType(props.src),
        },
      ],
    });
  });
</script>
<style scoped lang="less">
  .video-container {
    width: 100%;
    height: 300px;
    .video-js {
      width: 100%;
      height: 100%;
    }
  }
</style>
