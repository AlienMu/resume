<template>
  <a-modal
    ref="dragRef"
    :mask="false"
    :wrap-style="{ overflow: 'hidden', pointerEvents: 'none' }"
    v-bind="$attrs"
    v-model:open="openComputed"
    @cancel="emits('cancel')"
  >
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">{{ title }}</div>
    </template>
    <slot></slot>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>

<script setup>
  import { computed, ref, watch, watchEffect } from 'vue';
  import { useDraggable } from '@vueuse/core';

  const props = defineProps({
    open: Boolean,
    title: String,
  });

  const emits = defineEmits(['update:open', 'cancel']);

  const modalTitleRef = ref();

  const { x, y, isDragging } = useDraggable(modalTitleRef);

  const startX = ref(0);

  const startY = ref(0);

  const startedDrag = ref(false);

  const transformX = ref(0);

  const transformY = ref(0);

  const preTransformX = ref(0);

  const preTransformY = ref(0);

  const dragRect = ref({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const openComputed = computed({
    get: () => {
      return props.open;
    },
    set: (val) => {
      emits('update:open', val);
    },
  });

  watch([x, y], () => {
    if (!startedDrag.value) {
      startX.value = x.value;
      startY.value = y.value;
      const bodyRect = document.body.getBoundingClientRect();
      const titleRect = modalTitleRef.value.getBoundingClientRect();
      dragRect.value.right = bodyRect.width - titleRect.width;
      dragRect.value.bottom = bodyRect.height - titleRect.height;
      preTransformX.value = transformX.value;
      preTransformY.value = transformY.value;
    }
    startedDrag.value = true;
  });

  watch(isDragging, () => {
    if (!isDragging) {
      startedDrag.value = false;
    }
  });

  watchEffect(() => {
    if (startedDrag.value) {
      transformX.value = preTransformX.value + Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) - startX.value;
      transformY.value = preTransformY.value + Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) - startY.value;
    }
  });

  const transformStyle = computed(() => {
    return {
      transform: `translate(${transformX.value}px, ${transformY.value}px)`,
    };
  });
</script>

<style scoped lang="less"></style>
