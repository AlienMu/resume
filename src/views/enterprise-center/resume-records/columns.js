import { computed } from 'vue';
import i18n from '/@/i18n';
import { getColumn } from '/@/utils/desc-util';
import { getColumnStatusTag } from '/@/utils/element-util';
import { getFormatText } from '/@/utils/str-util';

const getColumnLabel = (index) => i18n.global.t(`enterpriseCenter.resumeList.columns[${index}]`);
const getDownloadedColumnLabel = (index) => i18n.global.t(`enterpriseCenter.resumeList.downloadedColumns[${index}]`);
const getBrowseHistoryColumnLabel = (index) => i18n.global.t(`enterpriseCenter.resumeList.browseHistoryColumns[${index}]`);

// Received resumes list columns
export const receivedColumns = computed(() => [
  getColumn({
    title: getColumnLabel(0), // Applied At
    dataIndex: 'appliedAt',
    width: 120,
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
  }),
  getColumn({
    title: getColumnLabel(1), // Applied Job
    dataIndex: 'jobTitle',
    width: 180,
    ellipsis: true,
  }),
  getColumn({
    title: getColumnLabel(2), // Applicant
    dataIndex: 'applicantInfo',
    width: 120,
  }),
  getColumn({
    title: getColumnLabel(3), // Resume Status
    dataIndex: 'statusText',
    width: 120,
    customRender: ({ text, record }) => {
      const status = record?.status === 2 ? 'success' : 'warning';
      return getColumnStatusTag({ label: text, status, icon: false });
    },
  }),
  getColumn({
    title: 'Actions',
    dataIndex: 'operate',
    width: 200,
    fixed: 'right',
  }),
]);

// Downloaded resumes list columns
export const downloadedColumns = computed(() => [
  getColumn({
    title: getDownloadedColumnLabel(0),
    dataIndex: 'downloadedAt',
    width: 140,
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
  }),
  getColumn({
    title: getDownloadedColumnLabel(1),
    dataIndex: 'jobTitle',
    width: 120,
    ellipsis: true,
  }),
  getColumn({
    title: getDownloadedColumnLabel(2),
    dataIndex: 'applicantInfo',
    width: 120,
  }),
  getColumn({
    title: getDownloadedColumnLabel(3),
    dataIndex: 'operate',
    width: 200,
    fixed: 'right',
  }),
]);

// Browse history columns
export const browseHistoryColumns = computed(() => [
  getColumn({
    title: getBrowseHistoryColumnLabel(0),
    dataIndex: 'viewedAt',
    width: 140,
    customRender: ({ text }) => getFormatText(text, 'YYYY-MM-DD'),
  }),
  getColumn({
    title: getBrowseHistoryColumnLabel(1),
    dataIndex: 'jobTitle',
    width: 120,
    ellipsis: true,
  }),
  getColumn({
    title: getBrowseHistoryColumnLabel(2),
    dataIndex: 'applicantInfo',
    width: 120,
  }),
  getColumn({
    title: getBrowseHistoryColumnLabel(3),
    dataIndex: 'operate',
    width: 120,
    fixed: 'right',
  }),
]);
