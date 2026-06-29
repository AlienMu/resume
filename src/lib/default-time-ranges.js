/*
 * Quick selection presets for the date range picker
 *

 */

import dayjs from 'dayjs';
import { ref } from 'vue';

export const defaultTimeRanges = ref([
  { label: 'Today', value: [dayjs(), dayjs()] },
  {
    label: 'Yesterday',
    value: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
  },
  { label: 'This month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  {
    label: 'Last month',
    value: [dayjs().subtract(1, 'months').startOf('month'), dayjs().subtract(1, 'months').endOf('month')],
  },
  {
    label: 'Next month',
    value: [dayjs().subtract(-1, 'months').startOf('month'), dayjs().subtract(-1, 'months').endOf('month')],
  },

  { label: 'This year', value: [dayjs().startOf('year'), dayjs().endOf('year')] },
  {
    label: 'Last year',
    value: [dayjs().subtract(1, 'years').startOf('year'), dayjs().subtract(1, 'years').endOf('year')],
  },
]);
