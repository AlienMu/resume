import { computed } from 'vue';
import i18n from '/@/i18n';
import { getColumn, muiEnumPlugin } from '/@/utils/desc-util';
import { getFormatText } from '/@/utils/str-util';
import { getColumnColorText } from '/@/utils/element-util';
import MuiEnumsPlugin from '/@/plugins/mui-enums-plugin';

export const columns = computed(() => [
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.item'),
    dataIndex: 'item',
    width: 200,
  }),
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.unitPrice'),
    dataIndex: 'unitPrice',
    width: 120,
  }),
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.quantity'),
    dataIndex: 'quantity',
    width: 120,
  }),
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.discount'),
    dataIndex: 'discount',
    width: 120,
  }),
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.originalTotalPrice'),
    dataIndex: 'originalTotalPrice',
    width: 160,
  }),
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.discountedPrice'),
    dataIndex: 'discountedPrice',
    width: 160,
  }),
  getColumn({
    title: i18n.global.t('enterpriseCenter.prepaidPlan.validityPeriod'),
    dataIndex: 'validityPeriod',
    width: 140,
  }),
]);
