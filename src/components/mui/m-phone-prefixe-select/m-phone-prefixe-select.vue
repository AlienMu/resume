<script setup>
  import { allCountries } from './countries';
  import MSelect from '/@/components/mui/m-select/m-select.vue';
</script>

<template>
  <m-select v-bind="$attrs" show-search>
    <a-select-option :value="item[2]" v-for="item in allCountries" :key="item.iso2">
      {{ '+' + item[2] }}
    </a-select-option>
  </m-select>
</template>

<style scoped lang="less"></style>
