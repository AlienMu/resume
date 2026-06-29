<template>
  <a-flex gap="10" class="work-banner">
    <!-- Carousel section -->
    <div class="carousel-container">
      <a-carousel autoplay arrows dotPosition="bottom" duration="5000" class="banner-carousel">
        <div v-for="ad in carouselAds" :key="ad.id" class="carousel-item">
          <a :href="ad.linkUrl?.startsWith('http') ? ad.linkUrl : `https://${ad.linkUrl}`" target="_blank" rel="noopener noreferrer">
            <img v-if="ad.imageUrl && ad.imageUrl.length > 0" :src="ad.imageUrl[0].url" :alt="ad.title" class="carousel-image" />
          </a>
        </div>
      </a-carousel>
    </div>

    <a
      v-for="ad in fixedAds.slice(0, 2)"
      :key="ad.id"
      :href="ad.linkUrl?.startsWith('http') ? ad.linkUrl : `https://${ad.linkUrl}`"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed-image-link"
    >
      <img :src="ad.imageUrl && ad.imageUrl.length > 0 ? ad.imageUrl[0].url : ''" :alt="ad.title" class="fixed-image" width="351" />
    </a>
  </a-flex>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { getAdvertisements } from '/@/api/system';

  const carouselAds = ref([]);
  const fixedAds = ref([]);

  // Fetch advertisement data
  const fetchAdvertisements = async () => {
    try {
      const data = await getAdvertisements({
        current: 1,
        size: 20, // Fetch enough data
      });

      const ads = data.records;
      // Categorize ads by position type
      carouselAds.value = ads.filter((ad) => ad.position === 'carousel');
      fixedAds.value = ads.filter((ad) => ad.position === 'small_left' || ad.position === 'small_right');

      // Sort in the order of small_left, small_right
      fixedAds.value.sort((a, b) => {
        if (a.position === 'small_left') return -1;
        if (b.position === 'small_left') return 1;
        return 0;
      });
    } catch (error) {
      console.error('Failed to fetch advertisement data:', error);
    }
  };

  onMounted(() => {
    fetchAdvertisements();
  });
</script>

<style scoped lang="less">
  .work-banner {
    padding: 20px 0;
  }

  .carousel-container {
    width: 719px;
    height: 160px;
  }

  .banner-carousel {
    height: 100%;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
    :deep(.slick-dots) {
      bottom: 10px;
    }

    :deep(.slick-dots li button) {
      background: rgba(255, 255, 255, 0.5);
    }

    :deep(.slick-dots li.slick-active button) {
      background: #fff;
    }
  }

  .carousel-item {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fixed-images {
    width: 351px;
  }

  .fixed-image-link {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  .fixed-image {
    height: 160px;
    object-fit: cover;
    cursor: pointer;
  }
</style>
