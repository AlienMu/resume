import i18n from '/@/i18n';

export const useI18nText = ({ local } = {}) => {
  const getLabel = (name, ...arg) => i18n.global.t(`${local}.${name}`, ...arg);

  const getPlaceholder = (name, isSelect) => i18n.global.t('common.form.placeholders.general', { name: getLabel(name) }, isSelect ? 2 : 1);

  const getCommon = (name, ...arg) => i18n.global.t(`common.${name}`, ...arg);

  return {
    getLabel,
    getPlaceholder,
    getCommon,
  };
};
