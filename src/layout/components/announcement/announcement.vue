<template>
  <div class="announcement" v-if="shouldDisplay && marqueeSource.length > 0">
    <div class="marquee-wrapper" ref="wrapperRef">
      <div
        class="marquee-item"
        :style="itemStyle"
        ref="itemRef"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @transitionstart="onTransitionStart"
        @transitionend="onTransitionEnd"
      >
        {{ currentAnnouncement.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { getActiveAnnouncements } from '/@/api/announcement';

  const notShowPages = ['/home', '/login'];
  const SCROLL_SPEED = 80; // Scroll speed, pixels/second
  const PAUSE_DURATION = 3000; // 3-second wait time

  const route = useRoute();
  const announcements = ref([]);
  const currentIndex = ref(0);
  const wrapperRef = ref();
  const itemRef = ref();
  const pauseTimer = ref(null);
  let resizeObserver = null;

  // Animation state: 'idle' | 'showing' | 'scrolling' | 'paused' | 'pausing'
  const animationState = ref('idle');
  // Mouse hover state
  const isHovering = ref(false);
  // Record the transform value when paused
  const pausedTransform = ref('');

  const shouldDisplay = computed(() => !notShowPages.some((path) => route.fullPath.indexOf(path) > -1));

  const marqueeSource = computed(() =>
    (Array.isArray(announcements.value) ? announcements.value : [])
      .map((item, index) => ({
        key: item.id ?? item.announcementId ?? index,
        text: item.content,
      }))
      .filter((item) => item.text?.trim())
  );

  const currentAnnouncement = computed(() => {
    if (marqueeSource.value.length === 0) return { key: '', text: '' };
    return marqueeSource.value[currentIndex.value % marqueeSource.value.length];
  });

  const itemStyle = computed(() => {
    if (!wrapperRef.value || !itemRef.value) return {};

    const containerWidth = wrapperRef.value.clientWidth;
    const itemWidth = itemRef.value.scrollWidth;

    switch (animationState.value) {
      case 'showing':
        // Text enters from the right and is fully visible on screen
        return {
          transform: `translateX(${containerWidth}px)`,
          transition: 'none',
        };
      case 'scrolling':
        // Scroll from right to left, completely off screen
        return {
          transform: `translateX(-${itemWidth}px)`,
          transition: `transform ${(containerWidth + itemWidth) / SCROLL_SPEED}s linear`,
        };
      case 'paused':
        // Paused on mouse hover, keep the current position
        return {
          transform: pausedTransform.value || `translateX(${containerWidth}px)`,
          transition: 'none',
        };
      case 'pausing':
        // Paused state, text fully hidden
        return {
          transform: `translateX(-${itemWidth}px)`,
          transition: 'none',
          opacity: 0,
        };
      default:
        // Default: hidden on the right
        return {
          transform: `translateX(${containerWidth}px)`,
          transition: 'none',
          opacity: 0,
        };
    }
  });

  const fetchAnnouncements = async () => {
    try {
      announcements.value = await getActiveAnnouncements({ current: 1, size: 20 });
    } catch {
      announcements.value = [];
    }
  };

  const startNextAnnouncement = () => {
    if (marqueeSource.value.length === 0) return;

    // Switch to the next announcement
    currentIndex.value = (currentIndex.value + 1) % marqueeSource.value.length;

    // Start a new announcement cycle
    startAnnouncementCycle();
  };

  const startAnnouncementCycle = () => {
    if (marqueeSource.value.length === 0) return;

    // 1. Show the text (entering from the right)
    animationState.value = 'showing';

    nextTick(() => {
      if (!wrapperRef.value || !itemRef.value) return;

      // 2. Start scrolling after a short delay
      setTimeout(() => {
        if (!isHovering.value) {
          animationState.value = 'scrolling';
        }
      }, 50);
    });
  };

  const onTransitionStart = (event) => {
    // You can handle the transition-start event here
  };

  const onTransitionEnd = (event) => {
    if (animationState.value === 'scrolling') {
      // Scrolling finished, enter the paused state
      animationState.value = 'pausing';

      // Wait 3 seconds, then show the next one
      pauseTimer.value = setTimeout(() => {
        startNextAnnouncement();
      }, PAUSE_DURATION);
    }
  };

  const clearTimers = () => {
    if (pauseTimer.value) {
      clearTimeout(pauseTimer.value);
      pauseTimer.value = null;
    }
  };

  const initResizeObserver = () => {
    if (typeof ResizeObserver === 'undefined' || !wrapperRef.value) return;
    resizeObserver = new ResizeObserver(() => {
      // When the container size changes, restart the current announcement
      if (animationState.value !== 'idle') {
        clearTimers();
        startAnnouncementCycle();
      }
    });
    resizeObserver.observe(wrapperRef.value);
  };

  // Watch for mouse hover
  watch(isHovering, (hovering) => {
    if (hovering && animationState.value === 'scrolling') {
      // Pause scrolling - record current position and switch to paused state
      const computedStyle = getComputedStyle(itemRef.value);
      pausedTransform.value = computedStyle.transform;
      animationState.value = 'paused';
    } else if (!hovering && animationState.value === 'paused') {
      // Resume scrolling - switch back to scrolling state and continue the animation
      animationState.value = 'scrolling';
    }
  });

  // Watch for announcement data changes
  watch(
    marqueeSource,
    (newSource) => {
      if (newSource.length > 0) {
        currentIndex.value = 0;
        clearTimers();
        startAnnouncementCycle();
      }
    },
    { immediate: true }
  );

  onMounted(async () => {
    await fetchAnnouncements();
    await nextTick();
    startAnnouncementCycle();
    initResizeObserver();
  });

  onUnmounted(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    clearTimers();
  });
</script>

<style scoped lang="less">
  .announcement {
    background: rgba(255, 255, 255, 0.7);
    padding: 0 20px;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(231, 231, 231, 0.6);
  }

  .marquee-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
    height: 100%;
  }

  .marquee-item {
    position: absolute;
    top: 0;
    color: @error-color;
    font-size: 14px;
    line-height: 40px;
    white-space: nowrap;
    flex-shrink: 0;
    opacity: 1;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }
</style>
