<template>
  <resume-edit-page context="invite" />
</template>

<script setup>
  import ResumeEditPage from '/@/components/business/resume-edit/resume-edit-page.vue';
</script>

<route>
{
auth: 'invite-resume-edit',
parentId: 'invite-center',
hideInMenu: true
}
</route>
