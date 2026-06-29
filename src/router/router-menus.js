import generatedRoutes from 'virtual:generated-pages';
import { MENU_DEFAULT_PARENT_ID, MENU_TYPE_ENUM } from '/@/constants/common-const';

export const getFilterMenuList = () => {
  const menuIdMap = new Map();

  generatedRoutes.forEach((item, index) => {
    menuIdMap.set(item.path, item.auth);
  });

  return generatedRoutes.reduce((cur, item) => {
    const getParentMenu = () => {
      const parts = item.path.split(/\/([^/]*)$/);
      return menuIdMap.get(parts[0]);
    };
    return [
      ...cur,
      {
        menuName: item?.auth,
        menuType: item.parentId === MENU_DEFAULT_PARENT_ID ? MENU_TYPE_ENUM.MENU.value : MENU_TYPE_ENUM.POINTS.value,
        parentId: item.parentId === MENU_DEFAULT_PARENT_ID ? MENU_DEFAULT_PARENT_ID : getParentMenu(),
        path: item.path,
        cacheFlag: item.keepAlive,
        visibleFlag: !item.hideInMenu,
        icon: item.icon,
        component: item.component,
        menuId: item.auth,
        sort: item.sort || 0,
        redirect: item.redirect,
      },
    ];
  }, []);
};

/**
 * 构建菜单树
 * @param  menuList
 * @returns
 */
export function buildMenuTree(menuList) {
  //1 获取所有 有效的 目录和菜单
  let catalogAndMenuList = menuList.filter((menu) => !menu.disabledFlag);
  //2 获取顶级目录
  let topCatalogList = catalogAndMenuList.filter((menu) => menu.parentId === 0);
  for (const topCatalog of topCatalogList) {
    buildMenuChildren(topCatalog, catalogAndMenuList);
  }
  return topCatalogList;
}

export function buildMenuChildren(menu, allMenuList) {
  let children = allMenuList
    .filter((e) => {
      return e.parentId === menu.menuId;
    })
    .sort((a, b) => a.sort - b.sort);

  if (children.length === 0) {
    return;
  }
  menu.children = children;
  for (const item of children) {
    buildMenuChildren(item, allMenuList);
  }
}
