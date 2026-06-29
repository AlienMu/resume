<template>
  <div class="rich-text">
    <quill-editor ref="editorRef" v-model:content="content" :options="editorOption" @change="emit('change')" @textChange="handleTextChange" />
    <div class="rich-text-footer">
      <span
        class="rich-text-counter"
        :class="{
          'rich-text-counter--error': currentLength < minLength || currentLength > maxLength,
        }"
      >
        {{ currentLength }}/{{ minLength }}-{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch, nextTick, onMounted } from 'vue';
  import { Delta, QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const props = defineProps({
    value: Object,
    placeholder: {
      type: String,
      default: 'Please enter content...',
    },
    minLength: {
      type: Number,
      default: 30,
    },
    maxLength: {
      type: Number,
      default: 6000,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const editorRef = ref();
  const currentLength = ref(0);

  const getPlainTextLength = () => {
    const quill = editorRef.value?.getQuill?.();
    if (!quill) return 0;
    const text = quill.getText() || '';
    return text.replace(/\n/g, '').length;
  };

  const content = computed({
    set: (value) => {
      const isEmpty = !value || (value.ops && value.ops.length === 1 && value.ops[0].insert === '\n');
      emit('update:value', isEmpty ? undefined : value);
      currentLength.value = getPlainTextLength();
    },
    get: () => props.value,
  });

  const minLength = computed(() => props.minLength);
  const maxLength = computed(() => props.maxLength);

  const handleTextChange = () => {
    const quill = editorRef.value?.getQuill?.();
    if (!quill) return;
    const text = quill.getText() || '';
    let plain = text.replace(/\n/g, '');
    if (plain.length > maxLength.value) {
      quill.deleteText(maxLength.value, plain.length);
      plain = plain.slice(0, maxLength.value);
    }
    currentLength.value = plain.length;
  };

  watch(
    () => props.value,
    async () => {
      await nextTick();
      currentLength.value = getPlainTextLength();
    },
    { immediate: true }
  );

  const editorOption = computed(() => ({
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: [
        [{ font: [] }],
        ['bold', 'italic', 'underline'],
        [{ align: '' }], // Default dropdown menu
        [{ align: 'center' }], // Center align
        [{ align: 'right' }], // Right align
        [{ align: 'justify' }], // Justify
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
      clipboard: {
        matchers: [['img', handlePasteImage]],
      },
    },
  }));

  // Intercept image paste
  const handlePasteImage = (_, delta) => new Delta();

  onMounted(() => {
    const quill = editorRef.value.getQuill();
    console.log(quill);
  });
</script>

<style scoped lang="less">
  .rich-text {
    position: relative;
    border-radius: 8px;
    border: 1px solid rgba(231, 231, 231, 1);
    height: 300px;
    background: #fff;
    :deep(.ql-toolbar),
    :deep(.ql-container) {
      border: none;
    }
    :deep(.ql-editor) {
      height: calc(300px - 42px);
    }
    :deep(.ql-toolbar) {
      border-bottom: 1px solid rgba(231, 231, 231, 1);
    }
  }
  .rich-text-footer {
    position: absolute;
    right: 12px;
    bottom: 8px;
    pointer-events: none;
  }
  .rich-text-counter {
    font-size: 12px;
    color: @font-tip-color;
  }
  .rich-text-counter--error {
    color: @primary-color;
  }
</style>
