import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { getCompanyInfo, saveOrUpdateCompanyInfo } from '/@/api/company';

export const useCompanyStore = defineStore('company', () => {
  // Company info
  const companyInfo = ref(null);
  // Whether company info has been fetched
  const hasFetchedCompanyInfo = ref(false);
  // Loading state
  const loading = ref(false);
  // Updating state
  const updating = ref(false);

  // Whether company info exists
  const hasCompanyInfo = computed(() => Boolean(companyInfo.value));

  // Whether the company profile is complete (only requires a company name)
  const isCompanyInfoComplete = computed(() => {
    if (!companyInfo.value) return false;

    // Only need to check whether the company name has a value
    return Boolean(companyInfo.value.companyName && companyInfo.value.companyName.trim());
  });

  /**
   * Fetch company info
   */
  const fetchCompanyInfo = async () => {
    try {
      loading.value = true;
      const data = await getCompanyInfo();
      companyInfo.value = data || null;
      hasFetchedCompanyInfo.value = true;
      return data;
    } catch (error) {
      console.error('Failed to fetch company info:', error);
      companyInfo.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update company info
   * @param {Object} payload - Company info data
   */
  const updateCompanyInfo = async (payload) => {
    try {
      updating.value = true;
      const data = await saveOrUpdateCompanyInfo(payload);
      // Re-fetch company info after a successful update
      await fetchCompanyInfo();
      message.success('Company info updated successfully');
      return data;
    } catch (error) {
      console.error('Failed to update company info:', error);
      throw error;
    } finally {
      updating.value = false;
    }
  };

  /**
   * Check whether the company profile is complete
   * @param {boolean} showMessage - Whether to show a prompt message
   * @returns {boolean} Whether the profile is complete
   */
  const checkCompanyInfoComplete = (showMessage = true) => {
    if (!hasFetchedCompanyInfo.value) {
      // If company info hasn't been fetched yet, fetch it first
      fetchCompanyInfo().catch(() => {
        // Handle fetch failure
      });
      return false;
    }

    if (!isCompanyInfoComplete.value) {
      if (showMessage) {
        message.warning('Please enter the company name first');
      }
      return false;
    }

    return true;
  };

  /**
   * Get the list of missing fields
   * @returns {string[]} Array of missing field names
   */
  const getMissingFields = () => {
    if (!companyInfo.value) return ['Company info'];

    // Only need to check the company name
    if (!companyInfo.value.companyName || !companyInfo.value.companyName.trim()) {
      return ['Company name'];
    }

    return [];
  };

  /**
   * Clear company info (used on logout)
   */
  const clearCompanyInfo = () => {
    companyInfo.value = null;
    hasFetchedCompanyInfo.value = false;
    loading.value = false;
    updating.value = false;
  };

  return {
    // State
    companyInfo,
    hasFetchedCompanyInfo,
    loading,
    updating,

    // Computed properties
    hasCompanyInfo,
    isCompanyInfoComplete,

    // Methods
    fetchCompanyInfo,
    updateCompanyInfo,
    checkCompanyInfoComplete,
    getMissingFields,
    clearCompanyInfo,
  };
});
