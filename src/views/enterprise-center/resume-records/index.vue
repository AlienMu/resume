<template>
  <a-flex vertical gap="20">
    <a-flex gap="20" align="center" class="resume-records-head" justify="space-between">
      <a-tabs class="message-tabs" @change="getTableList()" v-model:activeKey="activeTab" size="large">
        <a-tab-pane key="all" :tab="getI18nLabel('tabs.0')" />
        <a-tab-pane key="0" :tab="getI18nLabel('tabs.1')" />
        <a-tab-pane key="1" :tab="getI18nLabel('tabs.2')" />
      </a-tabs>
      <a-flex gap="20">
        <m-form-item no-style>
          <a-input
            v-model:value.trim="keyword"
            :placeholder="getI18nLabel('placeholder')"
            type="primary"
            style="width: 183px"
            size="large"
            @pressEnter="getTableList(true)"
          />
          <a-button type="link" class="search-button" @click="getTableList(true)">
            <svg-icon name="glass" class="search-icon" />
          </a-button>
        </m-form-item>
        <a-button @click="router.push({ name: 'list' })" type="primary">{{ getI18nLabel('more') }}</a-button>
      </a-flex>
    </a-flex>
    <a-flex vertical gap="30" style="margin-bottom: 20px">
      <a-table
        :columns="currentColumns"
        :dataSource="tableData"
        :loading="tableLoading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operate'">
            <a-button
              type="link"
              size="small"
              :href="router.resolve({ name: 'talent-detail', params: { id: record.resumeId ?? record.resume_id } }).href"
              target="_blank"
              rel="noopener"
            >
              {{ getI18nLabel('operate.0') }}
            </a-button>
            <template v-if="activeTab !== '1'">
              <a-button :disabled="!record.telegram" type="link" size="small" @click="handleTelegram(record)">
                {{ getI18nLabel('operate.1') }}
              </a-button>
              <confirm-button type="link" danger size="small" @confirm="handleDelete(record)">{{ getI18nLabel('operate.2') }}</confirm-button>
            </template>
          </template>
        </template>
      </a-table>
      <m-pagination :pagination="pagination" @change="onChangeTablePage" />
    </a-flex>
  </a-flex>
</template>

<script setup>
  import { receivedColumns, downloadedColumns, browseHistoryColumns } from './columns';
  import { onMounted, ref, computed } from 'vue';
  import i18n from '/@/i18n';
  import { message } from 'ant-design-vue';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import MFormItem from '/@/components/mui/m-form-item/m-form-item.vue';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import ConfirmButton from '/@/components/framework/confirm-button/confirm-button.vue';
  import {
    getReceivedResumeList,
    getDownloadedResumeList,
    getResumeBrowseHistory,
    deleteReceivedResume,
    deleteDownloadedResume,
  } from '/@/api/company';
  import { useRouter } from 'vue-router';

  const getI18nLabel = (name, ...arg) => i18n.global.t(`enterpriseCenter.resumeList.${name}`, ...arg);

  const activeTab = ref('all');

  const currentColumns = computed(() => {
    if (activeTab.value === 'all') {
      return receivedColumns.value;
    } else if (activeTab.value === '0') {
      return downloadedColumns.value;
    } else {
      return browseHistoryColumns.value;
    }
  });

  const router = useRouter();

  // View resume: opens the talent detail in a new window via the button href (no longer marked as viewed here)

  // Online chat
  const handleTelegram = async (record) => {
    const telegramAccount = record.telegram;
    if (!telegramAccount) return;
    // Strip the @ symbol and redirect to Telegram
    const username = telegramAccount.startsWith('@') ? telegramAccount.substring(1) : telegramAccount;
    window.open(`https://t.me/${username}`, '_blank', 'noopener');
  };

  // Delete
  const handleDelete = async (record) => {
    try {
      isDelLoading.value = true;
      if (activeTab.value === 'all') {
        await deleteReceivedResume(record.id);
      } else if (activeTab.value === '0') {
        await deleteDownloadedResume(record.id);
      } else {
        return;
      }
      message.success('Deleted successfully');
      getTableList();
    } catch (error) {
      message.error(error?.message || 'Delete failed');
    } finally {
      isDelLoading.value = false;
    }
  };

  const rowSelection = ref({
    selectedRowKeys: [],
    onChange: (keys) => {
      rowSelection.value.selectedRowKeys = keys;
    },
  });
  // ------------------------ table data and query methods ------------------------
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 500,
  });

  const tableLoading = ref(false);

  const isDelLoading = ref(false);

  const isReadLoading = ref(false);

  const tableData = ref([]);

  const keyword = ref('');

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
    }
    // Clear data first when switching tabs
    tableData.value = [];
    try {
      tableLoading.value = true;
      const params = {
        current: pagination.value.current,
        size: pagination.value.pageSize,
        keyword: keyword.value || undefined,
      };
      let response;

      if (activeTab.value === 'all') {
        // List of received resumes
        response = await getReceivedResumeList(params);
        tableData.value = response?.records ?? [];
      } else if (activeTab.value === '0') {
        // List of downloaded resumes
        response = await getDownloadedResumeList(params);
        tableData.value = response?.records ?? [];
      } else if (activeTab.value === '1') {
        // Browse history
        response = await getResumeBrowseHistory(params);
        tableData.value = response?.records ?? [];
      }

      pagination.value.total = response?.total ?? 0;
      pagination.value.current = response?.current ?? pagination.value.current;
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
  .resume-records-head {
    padding: 17px 40px;
  }
  .search-button {
    padding: 4px 12px;
    line-height: 35px;
  }
  .search-icon {
    font-size: 18px;
    color: @primary-color;
  }
  .message-tabs {
    :deep(.ant-tabs-tab) {
      font-size: 16px;
      padding: 5px 12px;
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
auth: 'resumeList',
parentId: 'enterprise-center',
sort: 2
}
</route>
