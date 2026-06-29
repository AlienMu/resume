/*
 * pinia 状态管理
 *

 */
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export const store = createPinia();
store.use(piniaPluginPersistedstate);
