import dayjs from 'dayjs';
import i18n from '/@/i18n';

export const getMonthRange = (number) => [dayjs().add(number, 'month').startOf('month'), dayjs().add(-1, 'month').endOf('month')];

export const getTimeComparison = (receivedTime) => {
  const now = new dayjs();
  const received = new dayjs(receivedTime);
  const diff = now.diff(received);
  if (diff < 60 * 60 * 1000) {
    return i18n.global.t('common.updateAgo.0');
  } else if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return i18n.global.t('common.updateAgo.1', { num: hours });
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return i18n.global.t('common.updateAgo.2', { num: days });
  } else if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    return i18n.global.t('common.updateAgo.3', { num: months });
  } else {
    const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
    return i18n.global.t('common.updateAgo.4', { num: years });
  }
};
