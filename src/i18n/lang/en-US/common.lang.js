export const common = {
  // Auto-save status
  autoSave: {
    saved: 'Saved automatically',
    saving: 'Auto-saving...',
    failed: 'Auto-save failed, please try again later',
  },
  notData: 'No relevant data found. Try adjusting your keywords or broadening your search.',

  autoLoading: 'Saved automatically | Auto-saving...',

  // Update-time display
  updateAgo: ['Just updated', 'Updated {num} hours ago', 'Updated {num} days ago', 'Updated {num} months ago', 'Updated {num} years ago'],

  // Edit state
  edit: 'Edit | Save | Cancel',

  // Hidden / public status
  hideStatus: 'Hidden | Public',

  // Common validation messages
  validation: {
    required: {
      generic: 'Please enter {field}',
      select: 'Please select {field}',
      upload: 'Please upload {field}',
    },
    length: {
      min: '{field} requires at least {length} characters',
    },
  },

  // Common modal
  modal: {
    buttons: {
      ok: 'OK',
      cancel: 'Cancel',
    },
    ok: 'OK',
    cancel: 'Cancel',
  },

  // Common form
  form: {
    placeholders: {
      input: 'Please enter {name}',
      select: 'Please select {name}',
      search: 'Enter keywords to search',
      searchKeywords: 'Enter keywords (e.g. job title, company name, skills...)',
      upload: 'Click or drag a file here to upload',
      general: 'Please enter {name} | Please select {name}',
    },
    // Common field names
    fieldNames: {
      industry: 'Industry',
      jobCategory: 'Job',
      jobType: 'Work Mode',
    },
  },

  // Common upload
  upload: {
    uploadText: 'Upload Attachment',
    fileType: 'Supports {type} format',
    fileSize: 'File size must not exceed {size}MB',
    cropper: 'Crop Image',
  },

  // Common tips
  tips: {
    noData: 'No data',
    loading: 'Loading...',
    networkError: 'Network error, please check your connection',
    serverError: 'Server error, please try again later',
    permissionDenied: 'Insufficient permissions',
    notMore: 'No more results',
  },

  // Actions
  operate: 'Actions',
  back: 'Back',
  download: 'Download',
  loadMore: 'Load More',

  // Common message patterns
  messages: {
    success: {
      save: 'Saved successfully',
      update: 'Updated successfully',
      submit: 'Submitted successfully',
      refresh: 'Refreshed successfully',
    },
    failed: {
      save: 'Save failed, please try again later',
      update: 'Update failed, please try again later',
    },
    loading: {
      generic: 'Loading {content}...',
    },
  },

  // Error pages
  errorPages: {
    404: {
      title: 'Sorry, this page is unavailable',
      desc: [
        'You can try the following troubleshooting steps:',
        '1. If you are using a VPN/proxy, turn it off completely and refresh the page.',
        '2. If it still won\'t load, switch to a mobile hotspot or a different network and try again.',
        '3. If none of the above works, click "Contact Support" to report the issue.',
      ],
      button: 'Contact Support | Back to Home',
    },
    403: {
      title: 'Account violation, unable to access your personal center',
      desc: 'Following user reports, your account has been restricted from logging in due to repeated violations such as posting false content and resumes with invalid contact information.',
    },
  },

  // Customer-service widget text
  customerService: {
    title: 'Support',
    serviceHoursTitle: 'Service Hours',
    timezone: 'Taipei & Beijing',
    workingDays: 'Monday to Friday',
    hoursMorning: '10-12 AM',
    hoursAfternoon: '14-18 PM',
  },
};
