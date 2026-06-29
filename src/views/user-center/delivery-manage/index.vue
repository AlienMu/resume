<template>
  <content-head>
    <a-input-search :placeholder="getI18nLabel('searchPlaceholder')" type="primary" style="width: 300px" size="large">
      <template #enterButton>
        <a-button type="primary" size="large" style="padding: 7px 10px">
          <svg-icon name="glass" style="font-size: 18px; line-height: 18px" />
        </a-button>
      </template>
    </a-input-search>
  </content-head>
  <a-flex vertical gap="30">
    <a-table :columns="columns" :dataSource="tableData" :loading="tableLoading" :pagination="false" :scroll="{ x: 'max-content' }" rowKey="id" />
    <m-pagination :pagination="pagination" @change="onChangeTablePage" />
  </a-flex>

  <set-auto-refresh ref="autoRefreshRef" />
</template>

<script setup>
  import ContentHead from '/@/views/user-center/components/content-head.vue';
  import { columns } from './columns';
  import { onMounted, ref } from 'vue';
  import SetAutoRefresh from '/@/views/user-center/components/set-auto-refresh.vue';
  import SvgIcon from '/@/components/support/svg-icon/svg-icon.vue';
  import i18n from '/@/i18n';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import { getMyApplicationList } from '/@/api/resume/delivery';

  const getI18nLabel = (name) => i18n.global.t(`userCenter.content.delivery.${name}`);

  const autoRefreshRef = ref();
  // ------------------------ table表格数据和查询方法 ------------------------
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const tableLoading = ref(false);

  const tableData = ref([]);

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
    }
    try {
      tableLoading.value = true;
      const data = await getMyApplicationList({
        current: pagination.value.current,
        size: pagination.value.pageSize,
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

<style scoped lang="less"></style>
<route>
{
auth: 'delivery',
parentId: 'user-center',
sort: 1
}
</route>
