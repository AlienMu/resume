<template>
  <VueDraggableNext class="drag-list" v-if="!disabled" noTransitionOnDrag v-model="list" :class="wrapClass" @change="handleDragEnd">
    <transition-group name="list">
      <div v-for="(element, index) in list" :key="sourceKey ? element[sourceKey] || index : element">
        <slot name="item" :item="element">
          <div>{{ element.name || 'empty' }}</div>
        </slot>
      </div>
    </transition-group>
  </VueDraggableNext>
  <div v-else class="drag-list drag-list--disabled" :class="wrapClass">
    <div class="drag-list-item" v-for="(element, index) in list" :key="sourceKey ? element[sourceKey] || index : element">
      <slot name="item" :item="element">
        <div>{{ element.name || 'empty' }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup>
  import { VueDraggableNext } from 'vue-draggable-next';

  import { computed } from 'vue';

  const props = defineProps({
    wrapClass: String,
    disabled: Boolean,
    sourceKey: String,
    source: {
      type: Array,
      default: () => [],
    },
  });

  const emits = defineEmits(['update:source', 'change']);

  const list = computed({
    set(val) {
      emits('update:source', val);
    },
    get() {
      return props.source;
    },
  });

  const handleDragEnd = () => {
    emits('change', list.value);
  };
</script>

<style scoped lang="less">
  /* 自定义动画 */
  .list-move {
    transition: transform 0.3s ease;
  }

  .drag-list {
    &.drag-list--disabled {
      opacity: 0.6;
      .drag-list-item {
        cursor: not-allowed;
      }
    }
  }

  /* 被拖拽元素样式 */
  .sortable-chosen {
    background: #f8f8f8 !important;
  }

  /* 放置占位符样式 */
  .sortable-ghost {
    border: 1px dashed @primary-color !important;
    border-radius: 4px;
    box-sizing: border-box;
    opacity: 0.4;
  }
</style>
