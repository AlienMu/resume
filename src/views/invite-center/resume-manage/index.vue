<template>
  <a-flex vertical>
    <content-head>
      <a-flex gap="20">
        <a-button style="padding: 0" type="link" @click="handleUploadResume">{{ getLabel('headButton', 1) }}</a-button>
        <a-button style="padding: 0" type="link" @click="handleInviteFriends">{{ getLabel('headButton', 2) }}</a-button>
      </a-flex>
    </content-head>
    <a-flex vertical gap="30">
      <a-table :columns="columns" :dataSource="tableData" :loading="tableLoading" :pagination="false" :scroll="{ x: 'max-content' }" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operate'">
            <a-space>
              <a-button style="padding: 0" type="link" @click="handleEditResume(record)">{{ getLabel('operate.edit') }}</a-button>
              <a-button
                style="padding: 0"
                v-if="showApplyHighValue(record)"
                type="link"
                :loading="isApplyLoading(record.id)"
                @click="handleApplyHighValue(record)"
              >
                {{ getLabel('operate.applyHighValue') }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      <m-pagination :pagination="pagination" @change="onChangeTablePage" />
      <a-flex class="mui-tips high-value-tip" gap="8" vertical>
        <div class="mui-tips-desc">
          {{
            getLabel('tips.highValue', {
              discountPrice: userStore.siteConfig.highValueResumeDiscountPrice,
              originalPrice: userStore.siteConfig.highValueResumeOriginalPrice,
            })
          }}
        </div>
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script setup>
  import { columns } from './columns';
  import { onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import MPagination from '/@/components/mui/m-pagination/m-pagination.vue';
  import ContentHead from '/@/views/invite-center/components/content-head.vue';
  import { useI18nText } from '/@/hooks/use-i18n-text';
  import { getInviteUserUploadedResumes } from '/@/api/invite';
  import { applyHighValueResume } from '/@/api/resume';
  import { message } from 'ant-design-vue';
  import { RESUME_HIGH_VALUE_APPLY_STATUS_ENUM, RESUME_HIGH_VALUE_ENUM, RESUME_STATUS_ENUM } from '/@/constants/api-const';
  import { getModal } from '/@/utils/element-util';
  import { useUserStore } from '/@/store/modules/system/user';

  const { getLabel } = useI18nText({ local: 'inviteCenter.resumeManage' });
  const router = useRouter();

  const userStore = useUserStore();
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const tableLoading = ref(false);
  const tableData = ref([]);
  const applyLoadingMap = reactive({});

  const normalizeRecord = (item) => {
    if (!item) return {};
    const status = typeof item.status === 'number' ? item.status : item.resumeStatus;
    const highValueApplyStatus = item.highValueApplyStatus ?? item.hasPendingPriceAdjustment ?? RESUME_HIGH_VALUE_APPLY_STATUS_ENUM.NONE.value;
    return {
      id: item.id,
      createdAt: item.createdAt,
      name: item.name,
      jobCategoryShow: item.jobCategoryShow ?? item.jobCategory ?? '',
      downloadCount: item.downloadCount ?? 0,
      downloadPrice: item.downloadPrice ?? item.originalPrice ?? item.discountPrice ?? 0,
      discountPrice: item.discountPrice ?? item.highValuePrice ?? item.downloadPrice ?? 0,
      originalPrice: item.originalPrice ?? item.downloadPrice ?? 0,
      earnings: item.earnings ?? 0,
      statusShow: item.statusShow ?? item.statusDesc ?? '',
      status,
      resumeStatus: typeof item.resumeStatus === 'number' ? item.resumeStatus : undefined,
      isHighValue: typeof item.isHighValue === 'number' ? item.isHighValue : RESUME_HIGH_VALUE_ENUM.NORMAL.value,
      hasPendingPriceAdjustment: item.hasPendingPriceAdjustment ?? item.highValueApplyStatus ?? RESUME_HIGH_VALUE_APPLY_STATUS_ENUM.NONE.value,
      highValueApplyStatus,
      canApplyHighValue: Boolean(item.canApplyHighValue),
    };
  };

  const getTableList = async (resetPage = false) => {
    if (resetPage) {
      pagination.value.current = 1;
    }
    try {
      tableLoading.value = true;
      const data = await getInviteUserUploadedResumes({
        current: pagination.value.current,
        size: pagination.value.pageSize,
      });
      const records = Array.isArray(data?.records) ? data.records : [];
      tableData.value = records.map((item) => normalizeRecord(item));
      pagination.value.total = data?.total ?? 0;
      pagination.value.current = data?.current ?? pagination.value.current;
    } catch (error) {
      message.error(error?.message || getLabel('loadFailed'));
    } finally {
      tableLoading.value = false;
    }
  };

  const onChangeTablePage = (pag) => {
    pagination.value.current = pag;
    getTableList();
  };

  const handleUploadResume = () => {
    router.push({ name: 'invite-resume-edit' });
  };

  const handleInviteFriends = () => {
    router.push({ name: 'inviteFriends' });
  };

  const setApplyLoading = (id, value) => {
    if (!id) return;
    applyLoadingMap[id] = value;
  };

  const isApplyLoading = (id) => Boolean(applyLoadingMap[id]);

  const isDraftStatus = (record) => {
    const statusValue = typeof record?.status === 'number' ? record.status : record?.resumeStatus;
    return statusValue === RESUME_STATUS_ENUM.DRAFT.value;
  };

  const isNormalStatus = (record) => {
    const statusValue = typeof record?.status === 'number' ? record.status : record?.resumeStatus;
    return statusValue === RESUME_STATUS_ENUM.NORMAL.value;
  };

  const isApplyingHighValue = (record) => {
    const applyStatus = record?.highValueApplyStatus ?? record?.hasPendingPriceAdjustment;
    return applyStatus === RESUME_HIGH_VALUE_APPLY_STATUS_ENUM.PENDING.value;
  };

  const isHighValueResume = (record) => {
    const applyStatus = record?.highValueApplyStatus ?? record?.hasPendingPriceAdjustment;
    return record?.isHighValue === RESUME_HIGH_VALUE_ENUM.HIGH.value || applyStatus === RESUME_HIGH_VALUE_APPLY_STATUS_ENUM.APPROVED.value;
  };

  const showApplyHighValue = (record) =>
    record?.canApplyHighValue && isNormalStatus(record) && !isApplyingHighValue(record) && !isHighValueResume(record);

  const formatPrice = (price, fallback = '--') => {
    const num = Number(price);
    if (Number.isNaN(num)) return fallback;
    return num % 1 === 0 ? `${num}` : num.toFixed(2);
  };

  const handleEditResume = (record) => {
    const id = record?.id;
    if (!id) return;
    router.push({ name: 'invite-resume-edit', query: { id } });
  };

  const handleApplyHighValue = (record) => {
    const id = record?.id;
    if (!id) return;
    const content = getLabel('highValueModal.content', {
      discountPrice: userStore.siteConfig.highValueResumeDiscountPrice,
      originalPrice: userStore.siteConfig.highValueResumeOriginalPrice,
    });
    getModal('confirm', {
      title: getLabel('highValueModal.title'),
      content,
      okText: getLabel('highValueModal.okText'),
      onOk: async () => {
        setApplyLoading(id, true);
        try {
          await applyHighValueResume(id);
          message.success(getLabel('message.applySuccess'));
          await getTableList(true);
        }  finally {
          setApplyLoading(id, false);
        }
      },
    });
  };

  onMounted(getTableList);
</script>

<style scoped lang="less">
  .high-value-tip {
    margin-bottom: 16px;
    width: 100%;
  }
</style>
<route>
{
auth: 'resumeManage',
parentId: 'invite-center',
sort: 2
}
</route>
