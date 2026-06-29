import { computed, h } from 'vue';
import i18n from '/@/i18n';
import { getColumn, muiEnumPlugin } from '/@/utils/desc-util';
import { getFormatText } from '/@/utils/str-util';
import { getColumnColorText } from '/@/utils/element-util';
import MuiEnumsPlugin from '/@/plugins/mui-enums-plugin';

const getColumnLabel = (index) => i18n.global.t(`userCenter.content.messageCenter.column[${index}]`);

export const columns = computed(() => [
  getColumn({
    title: getColumnLabel(0),
    dataIndex: 'createdAt',
    width: 120,
    customRender: ({ text, record }) => {
      const formatted = getFormatText(text);
      return record?.isRead === 0 ? h('strong', formatted) : formatted;
    },
  }),
  getColumn({
    title: getColumnLabel(1),
    dataIndex: 'relatedType',
    customRender: ({ text, record }) => {
      const desc = muiEnumPlugin.getDescByValue('RELATED_TYPE_ENUM', text);
      return record?.isRead === 0 ? h('strong', desc) : desc;
    },
    width: 120,
  }),
  getColumn({
    title: getColumnLabel(2),
    dataIndex: 'contentSummary',
    width: 370,
    ellipsis: true,
    customRender: ({ text, record }) => {
      const formatted = getFormatText(text)?.replace(/\n/g, '<br/>');
      return record?.isRead === 0 ? h('strong', { innerHTML: formatted }) : h('span', { innerHTML: formatted });
    },
  }),
]);
