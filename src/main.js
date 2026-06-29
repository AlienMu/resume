/*
 * Application bootstrap entry
 */
import { createApp } from 'vue';
import Antd, { message } from 'ant-design-vue';
import * as antIcons from '@ant-design/icons-vue';
import 'vue3-json-viewer/dist/index.css';
import App from './App.vue';
import { muiSentry } from '/@/lib/mui-sentry';
import { privilegeDirective } from '/@/directives/privilege';
import i18n from '/@/i18n/index';
import privilegePlugin from '/@/plugins/privilege-plugin';
import { buildRoutes, router } from '/@/router';
import { store } from '/@/store';
import { useUserStore } from '/@/store/modules/system/user';
import 'ant-design-vue/dist/reset.css';
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css';
import '/@/theme/index.less';
import { localRead, localSave } from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';
import { buildMenuTree, getFilterMenuList } from '/@/router/router-menus.js';
import 'virtual:svg-icons-register';
import { getUserInfo, adminLoginAsClient, logout } from '/@/api/auth';
import muiEnumsPlugin from '/@/plugins/mui-enums-plugin';
/**
 * Check URL params and handle admin auto-login
 * @returns {Promise<boolean>} returns true if admin auto-login was performed, false otherwise
 */
async function checkAdminLoginParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const t = urlParams.get('t');
  const p = urlParams.get('p');
  const c = urlParams.get('c');
  const u = urlParams.get('u');

  let loginData = null;
  let paramsToDelete = [];

  // Check whether the auto-login conditions are met
  if (t && p && c) {
    // Log in using phone number
    loginData = { countryCode: c, phone: p };
    paramsToDelete = ['t', 'p', 'c'];
  } else if (t && u && !p && !c) {
    // Log in using userId
    loginData = { userId: parseInt(u) };
    paramsToDelete = ['t', 'u'];
  }

  if (loginData) {
    try {
      localSave(LocalStorageKeyConst.USER_TOKEN, t);
      const loginResponse = await adminLoginAsClient(loginData, t);
      if (loginResponse?.token) {
        // Save token
        localSave(LocalStorageKeyConst.USER_TOKEN, loginResponse.token);
        // Clear URL params
        paramsToDelete.forEach((param) => urlParams.delete(param));
        const newSearch = urlParams.toString();
        const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
        window.history.replaceState({}, '', newUrl);

        return true; // indicates admin auto-login was performed
      }
    } catch (e) {
      try {
        if (t) {
          await logout({ Authorization: `Bearer ${t}` });
        }
      } catch (logoutError) {
        // Logout failure does not affect the main flow; handle silently
        console.warn('Logout failed:', logoutError);
      }
      // Clear token from local storage
      localSave(LocalStorageKeyConst.USER_TOKEN, '');
      // Clear URL params
      paramsToDelete.forEach((param) => urlParams.delete(param));
      const newSearch = urlParams.toString();
      const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }

  return false; // indicates admin auto-login was not performed
}

/**
 * Fetch user info and the routes corresponding to user permissions, then build dynamic routes
 */
async function getLoginInfo() {
  try {
    // Fetch logged-in user info
    const userInfo = await getUserInfo();
    initVue();
    // Update user info into pinia
    await useUserStore().setUserLoginInfo(userInfo);
  } catch (e) {
    message.error(e.data ? e.data?.msg : e?.message);
    muiSentry.captureError(e);
    initVue();
  }
}

function initVue() {
  // Build system routes
  const formatMenuList = getFilterMenuList();
  buildRoutes(buildMenuTree(formatMenuList));
  let vueApp = createApp(App);
  let app = vueApp.use(router).use(store).use(i18n).use(Antd).use(privilegePlugin).use(muiEnumsPlugin);
  // Register icon components
  Object.keys(antIcons).forEach((key) => {
    app.component(key, antIcons[key]);
  });
  //mount
  app.mount('#app');
  const { setRouterInfo, fetchWebsiteImages } = useUserStore();
  setRouterInfo(formatMenuList);
  fetchWebsiteImages();
}

// Start the application
(async function initApp() {
  // First check URL params to handle admin auto-login
  await checkAdminLoginParams();
  //No need to fetch user info, user menus, or dynamic routes; just initialize Vue directly
  let token = localRead(LocalStorageKeyConst.USER_TOKEN);
  if (!token) {
    initVue();
  } else {
    getLoginInfo();
  }
})();
