<!--
  * Main application page
-->

<template>
  <a-config-provider :locale="antdLocale" :theme="currentTheme">
    <!---Global loading--->
    <a-spin :spinning="spinning" tip="Just a moment, loading..." size="large">
      <!--- Router -->
      <RouterView />
    </a-spin>
  </a-config-provider>
</template>

<script setup>
  import dayjs from 'dayjs';
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { messages } from '/@/i18n';

  import { useSpinStore } from '/@/store/modules/system/spin';
  import { theme } from 'ant-design-vue';
  import { themeColors } from '/@/theme/color.js';

  const { locale } = useI18n();
  const antdLocale = computed(() => messages[locale.value]?.antdLocale ?? messages['en_US'].antdLocale);
  watch(
    () => locale.value,
    (val) => {
      dayjs.locale(messages[val]?.dayjsLocale ?? messages['en_US'].dayjsLocale);
    },
    { immediate: true }
  );

  // Global loading
  let spinStore = useSpinStore();
  const spinning = computed(() => spinStore.loading);

  // Theme colors
  const colorIndex = ref(0);

  const currentTheme = ref({
    token: {
      colorPrimary: themeColors[colorIndex.value].primaryColor,
      colorLink: themeColors[colorIndex.value].primaryColor,
      colorBgLayout: 'transparent',
      colorLinkActive: themeColors[colorIndex.value].activeColor,
      colorLinkHover: themeColors[colorIndex.value].hoverColor,
      colorIcon: themeColors[colorIndex.value].primaryColor,
      borderRadiusSM: 4,
      borderRadiusLG: 4,
      borderRadius: 4,
      colorBorder: 'rgba(231, 231, 231, 1)',
    },
    components: {
      Layout: {
        menuSubMenuBg: '#000',
        colorBgContainer: themeColors[colorIndex.value].primaryColor,
      },
      Modal: {
        borderRadiusLG: 20,
        paddingMD: 20,
        marginXS: 16,
        marginSM: 30,
        paddingContentHorizontalLG: 20,
        colorTextHeading: 'rgba(82, 91, 115, 1)',
        fontSizeHeading5: 20,
        lineHeightHeading5: 1,
        fontSizeLG: 20,
        controlHeightLG: 1,
        fontSize: 14,
      },
      Menu: {
        colorItemBg: 'transparent',
        colorItemText: themeColors[colorIndex.value].fontPrimaryColor,
        colorSubItemBg: 'transparent',
        colorItemBgSelected: 'rgba(186, 205, 227, 0.3)',
        colorItemBgHover: 'rgba(186, 205, 227, 0.3)',
        colorActiveBarBorderSize: 0,
        colorItemTextHover: themeColors[colorIndex.value].primaryColor,
        colorItemTextSelected: themeColors[colorIndex.value].primaryColor,
      },
      Button: {
        colorLink: themeColors[colorIndex.value].primaryColor,
        colorLinkActive: themeColors[colorIndex.value].activeColor,
        colorLinkHover: themeColors[colorIndex.value].hoverColor,
        colorPrimary: themeColors[colorIndex.value].primaryColor,
        textColorDisabled: themeColors[colorIndex.value].fontTipColor,
        borderColorDisabled: themeColors[colorIndex.value].disableColor,
        colorBgContainerDisabled: themeColors[colorIndex.value].disableColor,
        colorBorder: themeColors[colorIndex.value].disableColor,
        controlHeight: 36,
        paddingContentHorizontal: 48,
        lineWidth: 1,
        fontSize: 14,
      },
      Icon: {
        colorIcon: themeColors[colorIndex.value].primaryColor,
      },
      Segmented: {
        colorBgElevated: '#E3E9FC',
        colorFillSecondary: themeColors[colorIndex.value].activeColor,
        colorText: '#2C2C35',
        colorTextLabel: '#2C2C35',
      },
      Breadcrumb: {
        colorText: themeColors[colorIndex.value].primaryColor,
      },
      Descriptions: {
        descriptionItemPaddingBottom: '17px',
      },
      Table: {
        colorBorderSecondary: 'rgba(247, 247, 247, 1)',
        colorFillAlterSolid: 'rgba(247, 247, 247, 1)',
        colorTextHeading: themeColors[colorIndex.value].fontSubColor,
        fontWeightStrong: '400',
        tableFontSize: 14,
        paddingXS: 16,
      },
      Upload: {
        controlHeightLG: 90,
      },
      Card: {
        borderRadius: 8,
      },
    },
  });
</script>
