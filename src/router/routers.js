import NotFound from '/@/views/40X/404.vue';
import NoPrivilege from '/@/views/40X/403.vue';
import MuiLayout from '/@/layout/index.vue';
import { HOME_PAGE_NAME } from '/@/constants/common-const';
import { MENU_TYPE_ENUM } from '/@/constants/common-const';

export const routerArray = [
  {
    path: '/',
    name: '_home',
    redirect: { path: 'home' },
    component: MuiLayout,
    meta: {
      title: 'WebJob',
      menuType: MENU_TYPE_ENUM.CATALOG.value,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: MuiLayout,
    children: [
      {
        path: '',
        name: '404-child',
        component: NotFound,
      },
    ],
  },
  { path: '/403', name: '403', component: MuiLayout, children: [{ component: NoPrivilege, path: '', name: '403-child' }] },
];
