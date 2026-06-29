import { computed, h } from 'vue';
import i18n from '/@/i18n';
import { getColumn, muiEnumPlugin } from '/@/utils/desc-util';
import { getFormatText } from '/@/utils/str-util';
import { getColumnColorText } from '/@/utils/element-util';
import { JOB_STATUS_ENUM } from '/@/constants/api-const';
import { useI18nText } from '/@/hooks/use-i18n-text';
import { Image } from 'ant-design-vue';

const { getLabel } = useI18nText({ local: 'inviteCenter.myIncome' });

const getColumnLabel = (name, index) => {
  return getLabel(`${name}.${index}`);
};

export const columns = computed(() => [
  getColumn({
    title: getColumnLabel('detailColumn', 0), // Time
    dataIndex: 'createdAt',
    width: 160,
  }),
  getColumn({
    title: getColumnLabel('detailColumn', 1), // Earnings (U)
    dataIndex: 'amount',
    width: 120,
  }),
  getColumn({
    title: getColumnLabel('detailColumn', 2), // Commission Level
    dataIndex: 'level',
    width: 140,
  }),
  getColumn({
    title: getColumnLabel('detailColumn', 3), // Invite Chain
    dataIndex: 'inviteChain',
    width: 240,
    ellipsis: true,
  }),
]);
export const recordsColumns = computed(() => [
  getColumn({
    title: getColumnLabel('recordsColumn', 0), // Withdrawal Time
    dataIndex: 'createdAt',
    width: 160,
  }),
  getColumn({
    title: getColumnLabel('recordsColumn', 1), // Payee Account
    dataIndex: 'account',
    width: 200,
  }),
  getColumn({
    title: getColumnLabel('recordsColumn', 2), // Payee Account Image
    dataIndex: 'accountImage',
    width: 160,
    customRender: ({ text }) => {
      if (!text) return '-';
      return h(Image, {
        width: 60,
        height: 60,
        src: text,
        alt: 'Payee Account Image',
        style: {
          borderRadius: '4px',
        },
      });
    },
  }),
  getColumn({
    title: getColumnLabel('recordsColumn', 3), // Amount Received
    dataIndex: 'amount',
    width: 120,
  }),
  getColumn({
    title: getColumnLabel('recordsColumn', 4), // Payment Voucher
    dataIndex: 'voucher',
    width: 160,
  }),
  getColumn({
    title: getColumnLabel('recordsColumn', 5), // Withdrawal Status
    dataIndex: 'status',
    width: 120,
  }),
  getColumn({
    title: getColumnLabel('recordsColumn', 6), // Withdrawal Feedback
    dataIndex: 'feedback',
    width: 220,
    ellipsis: true,
  }),
]);
