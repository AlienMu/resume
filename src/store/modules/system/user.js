/*
 * Logged-in user
 *

 */
import _ from 'lodash';
import { defineStore } from 'pinia';
import localKey from '/@/constants/local-storage-key-const';
import { HOME_PAGE_NAME, HOME_PAGE_PATH, PAGE_PATH_LOGIN } from '/@/constants/common-const';
import { localRead, localRemove } from '/@/utils/local-util';
import { buildMenuTree, getFilterMenuList } from '/@/router/router-menus';
import { clearAllCoolies } from '/@/utils/cookie-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const';
import { getUnreadCountByType } from '/@/api/message';
import { getSiteConfig } from '/@/api/base';

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    token: '',
    //employee id
    employeeId: '',
    // avatar
    avatar: '',
    //login name
    loginName: '',
    //full name
    actualName: '',
    //phone number
    phone: '',
    //email
    email: '',
    //phone country code
    countryCode: '',
    //telegram account
    telegramAccount: '',
    //user type
    userType: '',
    //user status
    status: '',
    //last login time
    lastLoginTime: '',
    //invite code
    inviteCode: '',
    // unread message stats (per openapi definition, includes total and per-category counts)
    unreadMessageCount: 0,
    unreadMessageStats: createDefaultUnreadStats(),
    // site configuration
    siteConfig: {
      footerCooperationTelegram: '',
      footerCooperationEmail: '',
      sidebarCustomerTelegram: '',
      withdrawFeeRate: '',
      minWithdrawAmount: '',
      logoImage: {
        id: null,
        imageType: '',
        imageUrl: '',
        standardSize: '',
        sizeLimit: '',
        supportedFormats: '',
      },
      faviconImage: {
        id: null,
        imageType: '',
        imageUrl: '',
        standardSize: '',
        sizeLimit: '',
        supportedFormats: '',
      },
      invitationImage: {
        id: null,
        imageType: '',
        imageUrl: '',
        standardSize: '',
        sizeLimit: '',
        supportedFormats: '',
      },
      paymentAddressInfo: {
        addressId: null,
        address: '',
        qrcodeId: null,
        qrcodeUrl: '',
        qrcodeSize: '',
        qrcodeSizeLimit: '',
      },
      otherItems: {
        companyFreezeDays: 30,
        carouselAdCount: 5,
        freeJobPostingCount: 3,
      },
    },
  }),
  getters: {
    getToken(state) {
      if (state.token) {
        return state.token;
      }
      return localRead(localKey.USER_TOKEN);
    },
    getNeedUpdatePwdFlag(state) {
      return state.needUpdatePwdFlag;
    },
    //whether routes have been initialized
    getMenuRouterInitFlag(state) {
      return state.menuRouterInitFlag;
    },
    //menu tree
    getMenuTree(state) {
      return state.menuTree;
    },
    //menu routes
    getMenuRouterList(state) {
      return state.menuRouterList;
    },
    //menu parent ids
    getMenuParentIdListMap(state) {
      return state.menuParentIdListMap;
    },
    //feature points
    getPointList(state) {
      if (_.isEmpty(state.pointsList)) {
        let localUserPoints = localRead(localKey.USER_POINTS) || '';
        state.pointsList = localUserPoints ? JSON.parse(localUserPoints) : [];
      }
      return state.pointsList;
    },
    //tab navigation
    getTagNav(state) {
      if (_.isNull(state.tagNav)) {
        let localTagNav = localRead(localKey.USER_TAG_NAV) || '';
        state.tagNav = localTagNav ? JSON.parse(localTagNav) : [];
      }
      let tagNavList = _.cloneDeep(state.tagNav) || [];
      tagNavList.unshift({
        menuName: HOME_PAGE_NAME,
        menuTitle: 'Home',
      });
      return tagNavList;
    },
    getTenantNo(state) {
      if (state.tenantNo) {
        return state.tenantNo;
      }
      return localRead(localKey.TENANTNO);
    },
  },

  actions: {
    logout() {
      this.token = '';
      this.menuList = [];
      this.tagNav = [];
      this.userType = '';
      this.unreadMessageCount = 0;
      this.unreadMessageStats = createDefaultUnreadStats();
      localRemove(localKey.USER_TOKEN);
      localRemove(localKey.USER_POINTS);
      localRemove(localKey.USER_TAG_NAV);
      window.location.href = '/';
      clearAllCoolies();
    },
    // query unread message count
    async queryUnreadMessageCount() {
      try {
        const data = (await getUnreadCountByType()) || {};
        const stats = normalizeUnreadStats(data);
        this.unreadMessageStats = stats;
        this.unreadMessageCount = stats.total;
        return stats;
      } catch (error) {
        this.unreadMessageStats = createDefaultUnreadStats();
        this.unreadMessageCount = 0;
        return Promise.reject(error);
      }
    },
    setRouterInfo(formatMenuList) {
      //menu permissions
      this.menuTree = buildMenuTree(formatMenuList);
      //menus that have routes
      this.menuRouterList = formatMenuList.filter((e) => e.path);
      //parent menu collection
      this.menuParentIdListMap = buildMenuParentIdListMap(this.menuTree);
    },
    //set login info
    async setUserLoginInfo(data) {
      // basic user info
      this.token = localRead(LocalStorageKeyConst.USER_TOKEN);
      this.avatar = data.avatar;
      this.loginName = data.username;
      this.actualName = '';
      this.userType = data.userType;
      this.email = data.email;
      this.telegramAccount = data.telegramAccount;
      this.countryCode = data.countryCode;
      this.phone = data.phone;
      this.inviteCode = data.inviteCode;
      this.status = data.status;
      this.lastLoginTime = data.lastLoginTime;
      await this.queryUnreadMessageCount().catch(() => {});
    },
    setAvatar(val) {
      this.avatar = val;
    },
    setToken(token) {
      this.token = token;
    },
    // Add to keep-alive cache
    pushKeepAliveIncludes(val) {
      if (!val) {
        return;
      }
      if (!this.keepAliveIncludes) {
        this.keepAliveIncludes = [];
      }
      if (this.keepAliveIncludes.length < 30) {
        let number = this.keepAliveIncludes.findIndex((e) => e === val);
        if (number === -1) {
          this.keepAliveIncludes.push(val);
        }
      }
    },
    // Remove from keep-alive cache
    deleteKeepAliveIncludes(val) {
      if (!this.keepAliveIncludes || !val) {
        return;
      }
      let number = this.keepAliveIncludes.findIndex((e) => e === val);
      if (number !== -1) {
        this.keepAliveIncludes.splice(number, 1);
      }
    },
    // Clear keep-alive cache
    clearKeepAliveIncludes(val) {
      if (!val || !this.keepAliveIncludes.includes(val)) {
        this.keepAliveIncludes = [];
        return;
      }
      this.keepAliveIncludes = [val];
    },
    // Fetch website configuration
    async fetchWebsiteImages() {
      try {
        const res = await getSiteConfig();
        const data = res || {};

        // Persist full config, prioritizing the latest API data
        this.siteConfig = {
          footerCooperationTelegram: data.footerCooperationTelegram || '',
          footerCooperationEmail: data.footerCooperationEmail || '',
          sidebarCustomerTelegram: data.sidebarCustomerTelegram || '',
          logoImage: data.logoImage || {
            id: null,
            imageType: '',
            imageUrl: '',
            standardSize: '',
            sizeLimit: '',
            supportedFormats: '',
          },
          faviconImage: data.faviconImage || {
            id: null,
            imageType: '',
            imageUrl: '',
            standardSize: '',
            sizeLimit: '',
            supportedFormats: '',
          },
          invitationImage: data.invitationImage || {
            id: null,
            imageType: '',
            imageUrl: '',
            standardSize: '',
            sizeLimit: '',
            supportedFormats: '',
          },
          paymentAddressInfo: data.paymentAddressInfo || {
            addressId: null,
            address: '',
            qrcodeId: null,
            qrcodeUrl: '',
            qrcodeSize: '',
            qrcodeSizeLimit: '',
          },
          otherItems: {
            companyFreezeDays: data.otherItems?.companyFreezeDays ?? 30,
            carouselAdCount: data.otherItems?.carouselAdCount ?? 5,
            freeJobPostingCount: data.otherItems?.freeJobPostingCount ?? 3,
          },
          highValueResumeOriginalPrice: data.highValueResumeOriginalPrice,
          highValueResumeDiscountPrice: data.highValueResumeDiscountPrice,
          withdrawFeeRate: data.withdrawFeeRate,
          minWithdrawAmount: data.minWithdrawAmount,
        };
      } catch (error) {
        // Do not surface a message in catch
      }
    },
  },
});

/**
 * Build the menu parent-id collection
 */
function buildMenuParentIdListMap(menuTree) {
  let menuParentIdListMap = new Map();
  recursiveBuildMenuParentIdListMap(menuTree, [], menuParentIdListMap);

  return menuParentIdListMap;
}

function recursiveBuildMenuParentIdListMap(menuList, parentMenuList, menuParentIdListMap) {
  for (const e of menuList) {
    // Reset parentMenuList at the top level
    if (e.parentId === 0) {
      parentMenuList = [];
    }
    let menuIdStr = e.menuId.toString();
    let cloneParentMenuList = _.cloneDeep(parentMenuList);
    if (!_.isEmpty(e.children) && e.menuName) {
      // Recurse
      cloneParentMenuList.push({ name: menuIdStr, title: e.menuName });
      recursiveBuildMenuParentIdListMap(e.children, cloneParentMenuList, menuParentIdListMap);
    } else {
      menuParentIdListMap.set(menuIdStr, cloneParentMenuList);
    }
  }
}

function createDefaultUnreadStats() {
  return {
    total: 0,
    systemCount: 0,
    applicationCount: 0,
    jobRecommendCount: 0,
  };
}

function normalizeUnreadStats(payload = {}) {
  const base = createDefaultUnreadStats();
  return {
    total: Number(payload.total) || base.total,
    systemCount: Number(payload.systemCount) || base.systemCount,
    applicationCount: Number(payload.applicationCount) || base.applicationCount,
    jobRecommendCount: Number(payload.jobRecommendCount) || base.jobRecommendCount,
  };
}
