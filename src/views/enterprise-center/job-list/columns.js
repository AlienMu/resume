import { computed } from 'vue';
import dayjs from 'dayjs';
import { getColumn, muiEnumPlugin } from '/@/utils/desc-util';
import { getColumnColorText } from '/@/utils/element-util';
import { useI18nText } from '/@/hooks/use-i18n-text';
import { getFormatText } from '/@/utils/str-util';

const { getLabel } = useI18nText({ local: 'enterpriseCenter.jobRecords.column' });

export const columns = computed(() => [
  getColumn({
    title: getLabel(0), // Published At
    dataIndex: 'publishedAt',
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
    width: 120,
  }),
  getColumn({
    title: getLabel(1), // Job Title
    dataIndex: 'jobTitle',
    ellipsis: true,
    width: 180,
  }),
  getColumn({
    title: getLabel(2), // Deadline
    dataIndex: 'deadTime',
    width: 120,
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
  }),
  getColumn({
    title: getLabel(3), // View Count
    dataIndex: 'viewCount',
    width: 100,
  }),
  getColumn({
    title: getLabel(4), // Refresh Time
    dataIndex: 'updatedAt',
    width: 120,
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
  }),
  getColumn({
    title: getLabel(5), // Status
    dataIndex: 'status',
    width: 120,
    fixed: 'right',
    customRender: ({ text }) => {
      const enums = muiEnumPlugin.getValueDesc('JOB_STATUS_ENUM');
      const config = {
        1: 'success',
        2: 'warning',
        0: 'warning',
      };
      return getColumnColorText({
        label: enums[text],
        status: config[text],
      });
    },
  }),
  getColumn({
    title: getLabel(6), // Applications
    dataIndex: 'applyCount',
    fixed: 'right',
    width: 100,
  }),
  getColumn({
    title: getLabel(7), // Actions
    dataIndex: 'operate',
    fixed: 'right',
    width: 160,
  }),
]);
