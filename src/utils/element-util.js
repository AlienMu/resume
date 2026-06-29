import { h } from 'vue';
import { Button, Flex, Modal, Tag } from 'ant-design-vue';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import i18n from '/@/i18n';

export const getColumnStatusTag = ({ label, status, icon = true }) => {
  if (!label) return '-';
  if (!status) return label;

  switch (status) {
    case 'success':
      return h(Tag, { color: 'success', icon: icon && h(CheckCircleOutlined) }, label);
    case 'warning':
      return h(Tag, { color: 'warning', icon: icon && h(ExclamationCircleOutlined) }, label);
    case 'primary':
      return h(Tag, { class: 'mui-primary-tag' }, label);
    case 'error':
      return h(Tag, { color: 'error', icon: icon && h(CloseCircleOutlined) }, label);
  }
};

export const getColumnColorText = ({ label, status, icon = true }) => {
  if (!label) return '-';
  if (!status) return label;

  switch (status) {
    case 'success':
      return h('span', { class: 'mui-success-text' }, label);
    case 'warning':
      return h('span', { class: 'mui-warning-text' }, label);
    case 'primary':
      return h('span', { class: 'mui-primary-text' }, label);
    case 'error':
      return h('span', { class: 'mui-error-text' }, label);
  }
};

export const getModal = (type, { centerText, title, icon = null, closable = true, content, okText, cancelText, ...arg }) => {
  return Modal[type]?.({
    title,
    icon,
    closable,
    content,
    okText: okText || i18n.global.t('common.modal.ok'),
    cancelText: cancelText || i18n.global.t('common.modal.cancel'),
    cancelButtonProps: {
      type: 'primary',
      ghost: true,
    },
    wrapClassName: centerText ? 'mui-modal text-center' : 'mui-modal',
    ...arg,
  });
};

export const getElementByString = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString;
  const children = Array.from(div.childNodes)
    .map((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const props = {};
        const classList = Array.from(node.classList).join(' ');
        if (classList) {
          props.class = classList;
        }
        const attrs = node.attributes;
        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          props[attr.name] = attr.value;
        }
        return h(
          node.tagName,
          props,
          Array.from(node.childNodes).map((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE) {
              return childNode.textContent;
            }
            const childProps = {};
            const childClassList = Array.from(childNode.classList).join(' ');
            if (childClassList) {
              childProps.class = childClassList;
            }
            const childAttrs = childNode.attributes;
            for (let j = 0; j < childAttrs.length; j++) {
              const childAttr = childAttrs[j];
              childProps[childAttr.name] = childAttr.value;
            }
            return h(
              childNode.tagName,
              childProps,
              Array.from(childNode.childNodes).map((grandChildNode) => {
                if (grandChildNode.nodeType === Node.TEXT_NODE) {
                  return grandChildNode.textContent;
                }
                const grandChildProps = {};
                const grandChildClassList = Array.from(grandChildNode.classList).join(' ');
                if (grandChildClassList) {
                  grandChildProps.class = grandChildClassList;
                }
                const grandChildAttrs = grandChildNode.attributes;
                for (let k = 0; k < grandChildAttrs.length; k++) {
                  const grandChildAttr = grandChildAttrs[k];
                  grandChildProps[grandChildAttr.name] = grandChildAttr.value;
                }
                return h(grandChildNode.tagName, grandChildProps, [grandChildNode.textContent]);
              })
            );
          })
        );
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      return null;
    })
    .filter(Boolean);
  return h('div', {}, children);
};
