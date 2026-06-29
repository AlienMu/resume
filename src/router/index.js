import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routerArray } from './routers';
import { PAGE_PATH_404 } from '/@/constants/common-const';
import { HOME_PAGE_NAME } from '/@/constants/common-const';
import Layout from '../layout/index.vue';
import { useUserStore } from '/@/store/modules/system/user';
import _ from 'lodash';
import { USER_TYPE_ENUM } from '/@/constants/api-const';

export const router = createRouter({
  history: createWebHistory('/'),
  routes: routerArray,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

const nameMap = {
  [USER_TYPE_ENUM.PERSON.value]: 'user-center',
  [USER_TYPE_ENUM.COMPANY.value]: 'enterprise-center',
  [USER_TYPE_ENUM.INVITED.value]: 'invite-center',
};

// ----------------------- 路由加载前 -----------------------
router.beforeEach(async (to, from, next) => {
  // 进度条开启
  nProgress.start();

  const { pushKeepAliveIncludes, userType, token } = useUserStore();

  // 公共页面，任何时候都可以跳转
  if (to.path === PAGE_PATH_404) {
    next();
    return;
  }

  if (Object.values(nameMap).some((item) => to.fullPath.indexOf(item) > -1)) {
    if (userType && token) {
      const isAuth = to.fullPath.indexOf(nameMap[userType]) > -1;
      if (!isAuth) {
        next({ path: PAGE_PATH_404 });
        return;
      }
    } else {
      next({ path: PAGE_PATH_404 });
      return;
    }
  }

  if (to.path === HOME_PAGE_NAME) {
    next();
    return;
  }

  // 下载路由对应的 页面组件，并修改组件的Name，如果修改过，则不需要修改
  if (to.name) {
    let toRouterInfo = routerMap.get(to.name);
    if (toRouterInfo && _.isFunction(toRouterInfo.component) && toRouterInfo.meta.renameComponentFlag === false) {
      // 因为组件component 为 lazy load是个方法，所以可以直接执行 component()方法
      toRouterInfo.component().then((val) => {
        // 修改组件的name
        val.default.name = to.meta.componentName;
        // 记录已经修改过 组件的name
        toRouterInfo.meta.renameComponentFlag = true;
      });
    }
  }

  // 设置keepAlive
  if (to.meta.keepAlive) {
    nextTick(() => {
      pushKeepAliveIncludes(to.meta.componentName);
    });
  }

  next();
});

// ----------------------- 路由加载后 -----------------------
router.afterEach(() => {
  nProgress.done();
});

// ----------------------- 构建router对象 -----------------------
const routerMap = new Map();

export function buildRoutes(menuRouterList) {
  let menuList = menuRouterList ? menuRouterList : useUserStore().getMenuTree || [];
  const buildMenu = (menuList) => {
    /**
     * 1、构建整个路由信息
     * 2、添加到路由里
     */
    const routerList = [];
    //1、构建整个路由信息
    for (const e of menuList) {
      if (!e.menuId) {
        continue;
      }
      if (!e.path) {
        continue;
      }
      let route = {
        path: e.path.startsWith('/') ? e.path : `/${e.path}`,
        // 使用【menuId】作为name唯一标识
        name: e.menuId.toString(),
        meta: {
          // 数据库菜单(页面)id
          id: e.menuId.toString(),
          // 组件名称
          componentName: e.menuId.toString(),
          // 菜单展示
          title: e.menuName,
          // 菜单图标展示
          icon: e.icon,
          // 是否在菜单隐藏
          hideInMenu: !e.visibleFlag,
          // 页面是否keep-alive缓存
          keepAlive: e.cacheFlag,
          parentId: e.parentId,
        },
      };

      route.component = e.component;
      route.redirect = e.redirect;
      route.children = e.children ? buildMenu(e.children) : [];
      routerList.push(route);
      routerMap.set(e.menuId.toString(), route);
    }
    return routerList;
  };
  //2、添加到路由里
  router.addRoute({
    path: '/',
    meta: {},
    component: Layout,
    children: buildMenu(menuList),
  });
}
