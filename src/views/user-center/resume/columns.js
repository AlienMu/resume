import { computed } from 'vue';
import i18n from '/@/i18n';
import { getColumn } from '/@/utils/desc-util';
import { getColumnStatusTag } from '/@/utils/element-util';

export const columns = computed(() => [
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[0]'),
    dataIndex: 'index',
    width: 80,
  }),
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[1]'),
    dataIndex: 'date',
    width: 100,
  }),
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[2]'),
    dataIndex: 'updatedAt',
    width: 100,
  }),
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[3]'),
    dataIndex: 'jobTitle',
    width: 160,
  }),
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[4]'),
    dataIndex: 'count',
    width: 50,
  }),
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[5]'),
    dataIndex: 'status',
    width: 100,
    customRender: ({ text, record }) => {
      const status = record?.status === 2 ? 'success' : 'warning';
      return getColumnStatusTag({ label: text, status });
    },
  }),
  getColumn({
    title: i18n.global.t('userCenter.content.resume.column[6]'),
    dataIndex: 'isPublic',
    width: 120,
  }),
  getColumn({
    title: i18n.global.t('common.operate'),
    dataIndex: 'operate',
    width: 200,
  }),
]);
