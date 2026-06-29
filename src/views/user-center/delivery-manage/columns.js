import { computed } from 'vue';
import i18n from '/@/i18n';
import { getColumn, muiEnumPlugin } from '/@/utils/desc-util';
import { getFormatText } from '/@/utils/str-util';
import { getColumnColorText } from '/@/utils/element-util';

const getColumnLabel = (index) => i18n.global.t(`userCenter.content.delivery.column[${index}]`);
export const columns = computed(() => [
  getColumn({
    title: getColumnLabel(0),
    dataIndex: 'createdAt',
    width: 80,
  }),
  getColumn({
    title: getColumnLabel(1),
    dataIndex: 'jobTitle',
    width: 120,
  }),
  getColumn({
    title: getColumnLabel(2),
    dataIndex: 'companyName',
    width: 370,
  }),
  getColumn({
    title: getColumnLabel(3),
    dataIndex: 'expectedSalary',
    customRender: ({ text }) => {
      return getColumnColorText({
        label: getFormatText(text),
        status: 'error',
      });
    },
    width: 120,
  }),
  getColumn({
    title: getColumnLabel(4),
    dataIndex: 'workLocation',
    width: 200,
  }),
  getColumn({
    title: getColumnLabel(5),
    dataIndex: 'status',
    width: 200,
    customRender: ({ text }) => {
      const enums = muiEnumPlugin.getValueDesc('APPLICATION_STATUS_ENUM');
      const config = {
        1: 'primary',
        2: 'success',
        3: 'success',
        4: 'warning',
        5: 'error',
      };
      return getColumnColorText({
        label: enums[text],
        status: config[text],
      });
    },
  }),
]);
