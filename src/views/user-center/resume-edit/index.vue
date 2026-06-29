<template>
  <resume-edit-page context="user" />
</template>

<script setup>
  import ResumeEditPage from '/@/components/business/resume-edit/resume-edit-page.vue';
</script>

<route>
{
auth: 'resume-edit',
parentId: 'user-center',
hideInMenu: true
}
</route>
