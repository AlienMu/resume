import { themeColors } from '/@/theme/color.js';

export default {
  '@primary-color': themeColors[0].primaryColor, // Global primary color
  '@sub-color': themeColors[0].subColor, // Global secondary color
  '@base-bg-color': '#fff',
  '@hover-bg-color': themeColors[0].hoverColor,
  '@active-bg-color': themeColors[0].activeColor,
  '@error-color': themeColors[0].errorColor,
  '@warning-color': themeColors[0].warningColor,
  '@success-color': themeColors[0].successColor,
  '@font-primary-color': themeColors[0].fontPrimaryColor,
  '@font-sub-color': themeColors[0].fontSubColor,
  '@font-desc-color': themeColors[0].fontDescColor,
  '@font-tip-color': themeColors[0].fontTipColor,
  '@border-color': themeColors[0].borderColor,
  '@header-light-bg-hover-color': themeColors[0].borderColor,
  '@header-height': '80px',
  '@header-user-height': '48px',
  '@footer-height': '183px',
  '@page-tag-height': '40px',
  '@theme-list': ['light', 'dark', 'night'],
};
