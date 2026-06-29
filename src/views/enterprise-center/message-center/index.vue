<template>
  <content-head />
  <a-flex vertical gap="30" style="padding-bottom: 20px">
    <a-flex justify="space-between" style="padding: 0 40px" align="center">
      <a-tabs class="message-tabs" @change="getTableList()" v-model:activeKey="activeTab" size="large">
        <a-tab-pane key="all" :tab="getI18nLabel('tabs', 0)" />
        <a-tab-pane key="0" :tab="getI18nLabel('tabs', 1)" />
        <a-tab-pane key="1" :tab="getI18nLabel('tabs', 2)" />
      </a-tabs>
      <a-flex gap="30" align="center">
        <a-button
          :disabled="rowSelection.selectedRowKeys.length <= 0"
          :loading="isReadLoading"
          @click="handleRead()"
          type="link"
          size="small"
          class="big-text"
        >
          {{ getI18nLabel('buttons.0') }}
        </a-button>
        <ConfirmButton
          :disabled="rowSelection.selectedRowKeys.length <= 0"
          :content="getI18nLabel('confirmDel', { num: rowSelection.selectedRowKeys.length })"
          :loading="isDelLoading"
          @click="handleDelete()"
          type="link"
          size="small"
          class="big-text"
        >
          {{ getI18nLabel('buttons.1') }}
        </ConfirmButton>
        <a-button :loading="isReadLoading" @click="handleRead(true)" type="link" size="small" class="big-text">{{
          getI18nLabel('buttons.2')
        }}</a-button>
        <ConfirmButton
          :content="getI18nLabel('confirmDel', 2)"
          :loading="isDelLoading"
          @click="handleDelete(true)"
          type="link"
          size="small"
          class="big-text"
        >
          {{ getI18nLabel('buttons.3') }}
        </ConfirmButton>
      </a-flex>
    </a-flex>
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :dataSource="tableData"
      :loading="tableLoading"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
      rowKey="id"
    />
    <m-pagination :pagination="pagination" @change="onChangeTablePage" />
  </a-flex>

  <set-auto-refresh ref="autoRefreshRef" />
</template>

<script setup>
  import ContentHead from '../components/content-head.vue';
  import { columns } from './columns';
  import { onMounted, ref } from 'vue';
  import i18n from '/@/i18n';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import { RELATED_TYPE_ENUM } from '/@/constants/api-const';
  import { batchDeleteMessages, batchMarkAsRead, deleteAllMessages, listMessages, markAllAsRead } from '/@/api/message';
  import { message } from 'ant-design-vue';
  import ConfirmButton from '/@/components/framework/confirm-button/confirm-button.vue';
  import { useUserStore } from '/@/store/modules/system/user';

  const getI18nLabel = (name, ...arg) => i18n.global.t(`userCenter.content.messageCenter.${name}`, ...arg);

  const autoRefreshRef = ref();
  const userStore = useUserStore();

  const activeTab = ref('all');

  const rowSelection = ref({
    selectedRowKeys: [],
    onChange: (keys) => {
      rowSelection.value.selectedRowKeys = keys;
    },
  });
  // ------------------------ table表格数据和查询方法 ------------------------
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 500,
  });

  const tableLoading = ref(false);

  const isDelLoading = ref(false);

  const isReadLoading = ref(false);

  const tableData = ref([]);

  const handleDelete = async (isAll) => {
    if (!isAll && rowSelection.value.selectedRowKeys.length === 0) return;
    try {
      isDelLoading.value = true;
      if (isAll) {
        await deleteAllMessages();
        message.success(getI18nLabel('successDeleteAll'));
      } else {
        await batchDeleteMessages({ ids: rowSelection.value.selectedRowKeys.join(',') });
        message.success(getI18nLabel('successDelete', { num: rowSelection.value.selectedRowKeys.length }));
      }
      rowSelection.value.selectedRowKeys = [];
      await getTableList(true);
    } catch (error) {
      message.error(error?.message || getI18nLabel('actionFailed'));
    } finally {
      isDelLoading.value = false;
    }
  };

  const handleRead = async (isAll) => {
    if (!isAll && rowSelection.value.selectedRowKeys.length === 0) return;
    try {
      isReadLoading.value = true;
      if (isAll) {
        await markAllAsRead();
        message.success(getI18nLabel('successReadAll'));
      } else {
        await batchMarkAsRead({ ids: rowSelection.value.selectedRowKeys.join(',') });
        message.success(getI18nLabel('successRead', { num: rowSelection.value.selectedRowKeys.length }));
      }
      rowSelection.value.selectedRowKeys = [];
      await getTableList();
      userStore.queryUnreadMessageCount().catch(() => {});
    } catch (error) {
      message.error(error?.message || getI18nLabel('actionFailed'));
    } finally {
      isReadLoading.value = false;
    }
  };

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
    }
    try {
      tableLoading.value = true;
      const isRead = activeTab.value !== 'all' ? activeTab.value : undefined;
      const data = await listMessages({
        current: pagination.value.current,
        size: pagination.value.pageSize,
        isRead,
      });
      tableData.value = data?.records ?? [];
      pagination.value.total = data?.total ?? 0;
      pagination.value.current = data?.current ?? pagination.value.current;
    } finally {
      tableLoading.value = false;
    }
  };

  const onChangeTablePage = (pag) => {
    pagination.value.current = pag;
    getTableList();
  };

  onMounted(getTableList);
</script>

<style scoped lang="less">
  .big-text {
    font-size: 16px;
  }
  .message-tabs {
    :deep(.ant-tabs-tab) {
      font-size: 16px;
    }
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
      &:before {
        border-bottom: none;
      }
    }
    :deep(.ant-tabs-ink-bar) {
      background: transparent !important;
      height: 2px;
      display: flex;
      justify-content: center;
      &:before {
        content: '';
        display: block;
        width: 25px;
        border-radius: 12px;
        background-color: @primary-color !important;
      }
    }
  }
</style>
<route>
{
auth: 'messageCenter',
parentId: 'enterprise-center',
sort: 5
}
</route>
