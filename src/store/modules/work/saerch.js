import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearch = defineStore('workSearch', () => {
  const search = ref('');

  const industry = ref('');

  const job = ref('');

  const workType = ref('');

  const setSearch = (value) => {
    search.value = value;
  };

  const setIndustry = (value) => {
    industry.value = value;
  };

  const setWorkType = (value) => {
    workType.value = value;
  };

  const setJob = (value) => {
    job.value = value;
  };

  const setAggregation = (data) => {
    setSearch(data.search);
    setIndustry(data.industry);
    setWorkType(data.workType);
    setJob(data.job);
  };

  return {
    search,
    industry,
    job,
    workType,
    setSearch,
    setIndustry,
    setWorkType,
    setJob,
    setAggregation,
  };
});
