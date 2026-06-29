<template>
  <a-flex style="height: 100%; overflow: hidden; padding-bottom: 16px" vertical justify="space-between">
    <div>
      <content-head :tips="$t('userCenter.content.resume.subTitle')">
        <a-button :disabled="tableData.length >= 3" type="primary" @click="router.push({ name: 'resume-edit' })">{{
          $t('userCenter.content.resume.createButton')
        }}</a-button>
      </content-head>
      <a-table
        :columns="columns"
        :dataSource="tableData"
        :loading="tableLoading"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
        rowKey="id"
        size="small"
        @change="onChangeTablePage"
      >
        <template #bodyCell="{ record, column, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'jobTitle'">
            <name-editor :data="record" @rename="handleRename(record, $event)" />
          </template>
          <template v-if="column.dataIndex === 'status'">
            <span>{{ getStatusText(record.status) }}</span>
          </template>
          <template v-if="column.dataIndex === 'isPublic'">
            <a-switch
              :checked="record.isPublic === 1"
              :checked-children="$t('userCenter.content.resume.switch', 1)"
              :un-checked-children="$t('userCenter.content.resume.switch', 2)"
              :loading="isSwitchLoading(record.id)"
              @change="(checked) => handleTogglePublic(record, checked)"
            />
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <a-space>
              <a-button type="link" size="small" @click="handleEditResume(record)">{{ $t('common.edit', 0) }}</a-button>
              <template v-if="!isDraftStatus(record.status)">
                <a-button type="link" size="small" :loading="isRefreshLoading(record.id)" @click="handleRefresh(record)">
                  {{ getResumeLabel('refreshButton') }}
                </a-button>
                <a-button type="link" @click="autoRefreshRef.handleOpen(record)" size="small">{{
                  $t('userCenter.content.resume.autoRefresh.title')
                }}</a-button>
              </template>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
    <a-flex vertical gap="24" class="mui-tips" style="margin-top: 16px">
      <a-flex gap="8" vertical>
        <div class="mui-tips-title">{{ $t('userCenter.content.resume.tips.title', 0) }}</div>
        <div class="mui-tips-desc">{{ $t('userCenter.content.resume.tips.notice', 1) }}</div>
        <div class="mui-tips-desc">{{ $t('userCenter.content.resume.tips.notice', 2) }}</div>
      </a-flex>
      <a-flex gap="8" vertical>
        <div class="mui-tips-title">{{ $t('userCenter.content.resume.tips.title', 1) }}</div>
        <div class="mui-tips-desc">{{ $t('userCenter.content.resume.tips.statement') }}</div>
      </a-flex>
      <a-flex gap="8" vertical>
        <div class="mui-tips-title">{{ $t('userCenter.content.resume.tips.title', 2) }}</div>
        <div class="mui-tips-desc">{{ $t('userCenter.content.resume.tips.classroom', 0) }}</div>
        <div class="mui-tips-desc">{{ $t('userCenter.content.resume.tips.classroom', 1) }}</div>
        <div class="mui-tips-desc">{{ $t('userCenter.content.resume.tips.classroom', 2) }}</div>
      </a-flex>
    </a-flex>
  </a-flex>

  <set-auto-refresh ref="autoRefreshRef" />
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import ContentHead from '/@/views/user-center/components/content-head.vue';
  import { columns } from './columns';
  import NameEditor from '/@/views/user-center/components/name-editor.vue';
  import SetAutoRefresh from '/@/views/user-center/components/set-auto-refresh.vue';
  import { getMyResumes } from '/@/api/user-center';
  import { refreshResume, setResumePublic } from '/@/api/resume';
  import i18n from '/@/i18n';
  import { RESUME_STATUS_ENUM } from '/@/constants/api-const';

  const getResumeLabel = (name, ...args) => i18n.global.t(`userCenter.content.resume.${name}`, ...args);

  const resumeStatusStrategies = {
    [RESUME_STATUS_ENUM.DISABLED.value]: () => RESUME_STATUS_ENUM.DISABLED.desc,
    [RESUME_STATUS_ENUM.NORMAL.value]: () => RESUME_STATUS_ENUM.NORMAL.desc,
    [RESUME_STATUS_ENUM.PENDING_REVIEW.value]: () => RESUME_STATUS_ENUM.PENDING_REVIEW.desc,
    [RESUME_STATUS_ENUM.FROZEN.value]: () => RESUME_STATUS_ENUM.FROZEN.desc,
    [RESUME_STATUS_ENUM.DRAFT.value]: () => RESUME_STATUS_ENUM.DRAFT.desc,
  };

  const getStatusText = (status) => {
    if (status === null || status === undefined) return '--';
    const strategy = resumeStatusStrategies[status];
    return typeof strategy === 'function' ? strategy() : '--';
  };

  const isDraftStatus = (status) => status === RESUME_STATUS_ENUM.DRAFT.value;

  const router = useRouter();

  const autoRefreshRef = ref();
  // ------------------------ table data and query methods ------------------------
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `${total} in total`,
  });

  const tableLoading = ref(false);

  const tableData = ref([]);

  const switchLoading = reactive({});
  const refreshLoading = reactive({});

  const setLoadingState = (stateMap, id, value) => {
    stateMap[id] = value;
  };

  const isSwitchLoading = (id) => Boolean(switchLoading[id]);
  const isRefreshLoading = (id) => Boolean(refreshLoading[id]);

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
    }
    try {
      tableLoading.value = true;
      const data = await getMyResumes({
        current: pagination.value.current,
        size: pagination.value.pageSize,
      });
      const records = Array.isArray(data?.records) ? data.records : [];
      tableData.value = records.map((item, index) => ({
        id: item.id,
        index: item.sequence ?? index + 1 + (pagination.value.current - 1) * pagination.value.pageSize,
        date: item.createdAt ?? '',
        updatedAt: item.updatedAt ?? '',
        jobTitle: item.resumeName ?? '',
        resumeName: item.resumeName ?? '',
        count: item.applicationCount ?? 0,
        isPublic: typeof item.isPublic === 'number' ? item.isPublic : 0,
        status: typeof item.status === 'number' ? item.status : null,
      }));
      pagination.value.total = data?.total ?? 0;
      pagination.value.current = data?.current ?? pagination.value.current;
    }  finally {
      tableLoading.value = false;
    }
  };

  const onChangeTablePage = (pag) => {
    pagination.value.current = pag;
    getTableList();
  };

  const handleTogglePublic = async (record, checked) => {
    const targetValue = checked ? 1 : 0;
    if (targetValue === record.isPublic) return;
    setLoadingState(switchLoading, record.id, true);
    try {
      await setResumePublic(record.id, { isPublic: targetValue });
      record.isPublic = targetValue;
      message.success(i18n.global.t('common.messages.success.update'));
    } finally {
      setLoadingState(switchLoading, record.id, false);
    }
  };

  const handleRefresh = async (record) => {
    setLoadingState(refreshLoading, record.id, true);
    try {
      await refreshResume(record.id);
      message.success(i18n.global.t('common.messages.success.refresh'));
      await getTableList();
    } finally {
      setLoadingState(refreshLoading, record.id, false);
    }
  };

  const handleRename = async (record, nextName) => {
    record.jobTitle = nextName ?? record.jobTitle;
    record.resumeName = nextName ?? record.resumeName;
    await getTableList();
  };

  const handleEditResume = (record) => {
    router.push({ name: 'resume-edit', query: { id: record.id } });
  };

  onMounted(getTableList);
</script>

<style scoped lang="less"></style>
<route>
{
auth: 'resume',
parentId: 'user-center',
sort: 0
}
</route>
