import { computed } from 'vue';
import i18n from '/@/i18n';
import { getColumn } from '/@/utils/desc-util';
import { getColumnStatusTag } from '/@/utils/element-util';
import { useI18nText } from '/@/hooks/use-i18n-text';
import { getFormatText } from '/@/utils/str-util';

const { getLabel } = useI18nText({ local: 'inviteCenter.resumeManage.columns' });

export const columns = computed(() => [
  getColumn({
    title: getLabel(0), // Upload Time
    dataIndex: 'createdAt',
    width: 120,
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
  }),
  getColumn({
    title: getLabel(1), // Candidate
    dataIndex: 'name',
    width: 140,
  }),
  getColumn({
    title: getLabel(2), // Desired Position
    dataIndex: 'jobCategoryShow',
    width: 120,
    ellipsis: true,
  }),
  getColumn({
    title: getLabel(3), // Download Count
    dataIndex: 'downloadCount',
    width: 120,
  }),

  getColumn({
    title: getLabel(5), // Resume Earnings USDT
    dataIndex: 'earnings',
    width: 160,
  }),
  getColumn({
    title: getLabel(4), // Resume Price/USD
    dataIndex: 'downloadPrice',
    width: 120,
    customRender: ({ record: { originalPrice, discountPrice } }) => {
      return `${originalPrice}(discounted ${discountPrice})`;
    },
  }),
  getColumn({
    title: getLabel(6), // Resume Status
    dataIndex: 'statusShow',
    width: 120,
    customRender: ({ text, record }) => {
      const status = record.status === 1 ? 'success' : 'warning';
      return getColumnStatusTag({ label: text, status });
    },
  }),

  getColumn({
    title: i18n.global.t('common.operate'), // Actions
    dataIndex: 'operate',
    fixed: 'right',
    width: 180,
  }),
]);
