/* System common enum definitions */

export const BOOL_ENUM = {
  TRUE: {
    value: 1,
    desc: 'Yes',
  },
  FALSE: {
    value: 0,
    desc: 'No',
  },
};

/* System common enum definitions */

export const ABROAD_WILLINGNESS = {
  TRUE: {
    value: 1,
    desc: 'Willing',
  },
  FALSE: {
    value: 0,
    desc: 'Not Willing',
  },
};

// Additional account type enum
export const ACCOUNT_TYPE_ENUM = {
  WECHAT: { value: 'Wechat', desc: 'WeChat' },
  LINKEDIN: { value: 'Linkedin', desc: 'LinkedIn' },
  WHATSAPP: { value: 'WhatsApp', desc: 'WhatsApp' },
  LINE: { value: 'Line', desc: 'Line' },
  FACEBOOK: { value: 'Facebook', desc: 'Facebook' },
  X_TWITTER: { value: 'X/Twitter', desc: 'X/Twitter' },
  DISCORD: { value: 'Discord', desc: 'Discord' },
  OTHER: { value: 'other', desc: 'Other' },
};

/**
 * Common status enum
 */
export const COMMON_STATUS_ENUM = {
  CLOSED: { value: 0, desc: 'Closed' },
  OPEN: { value: 1, desc: 'Open' },
  PAUSED: { value: 2, desc: 'Paused' },
};

export const JOB_TYPE_ENUM = {
  FULL_TIME: {
    value: 'fulltime',
    desc: 'Full-time',
  },
  PART_TIME: {
    value: 'parttime',
    desc: 'Part-time',
  },
  REMOTE: {
    value: 'remote',
    desc: 'Internship',
  },
  FLEXIBLE: {
    value: 'flexible',
    desc: 'Flexible',
  },
};

export const MESSAGE_TYPE_ENUM = {
  SYSTEM: {
    value: 1,
    desc: 'System Notification',
  },
  APPLICATION: {
    value: 2,
    desc: 'Application Notification',
  },
  RECOMMEND: {
    value: 3,
    desc: 'Job Recommendation',
  },
};

export const READ_STATUS_ENUM = {
  UNREAD: {
    value: 0,
    desc: 'Unread',
  },
  READ: {
    value: 1,
    desc: 'Read',
  },
};

export const JOB_STATUS_ENUM = {
  CLOSED: {
    value: 0,
    desc: 'Closed',
  },
  OPEN: {
    value: 1,
    desc: 'Hiring',
  },
  PAUSED: {
    value: 2,
    desc: 'Hiring Paused',
  },
  DRAFT: {
    value: 4,
    desc: 'Draft',
  },
};

export const USER_TYPE_ENUM = {
  PERSON: {
    value: 1,
    desc: 'Job Seeker',
  },
  COMPANY: {
    value: 2,
    desc: 'Recruiter',
  },
  INVITED: {
    value: 3,
    desc: 'Inviter',
  },
};

/* Related type enum definitions */
export const RELATED_TYPE_ENUM = {
  JOB: {
    value: 'job',
    desc: 'Job Related',
  },
  APPLICATION: {
    value: 'application',
    desc: 'Application Related',
  },
  SYSTEM: {
    value: 'system',
    desc: 'System Related',
  },
};

// Gender enum
export const GENDER_ENUM = {
  FEMALE: { value: 0, desc: 'Female' },
  MALE: { value: 1, desc: 'Male' },
};

// Proficiency enum
export const PROFICIENCY_ENUM = {
  BASIC: { value: 1, desc: 'Basic' },
  INTERMEDIATE: { value: 2, desc: 'Familiar' },
  EXPERT: { value: 3, desc: 'Proficient' },
};

// Public status enum
export const PUBLIC_STATUS_ENUM = {
  PRIVATE: { value: 0, desc: 'Hidden' },
  PUBLIC: { value: 1, desc: 'Public' },
};

// Account settings - email verification status
export const EMAIL_VERIFIED_STATUS_ENUM = {
  UNVERIFIED: { value: 0, desc: 'Unverified' },
  VERIFIED: { value: 1, desc: 'Verified' },
};

/**
 * Finance transaction type enum (corresponds to the type parameter of the B-side finance detail API)
 */
export const FINANCE_TRANSACTION_TYPE_ENUM = {
  RECHARGE: { value: 1, desc: 'Recharge' },
  CONSUME: { value: 2, desc: 'Consumption' },
  REWARD: { value: 3, desc: 'Invitation Reward' },
  WITHDRAW: { value: 4, desc: 'Withdrawal' },
};

/**
 * Package type enum
 */
export const PACKAGE_TYPE_ENUM = {
  RESUME: { value: 1, desc: 'Resume Viewing Package' },
  JOB_REFRESH: { value: 2, desc: 'Job Refresh Package' },
  COMBO: { value: 3, desc: 'Combo Package' },
};

/**
 * Payment method enum
 */
export const PAYMENT_METHOD_ENUM = {
  ALIPAY: { value: 'alipay', desc: 'Alipay' },
  WECHAT: { value: 'wechat', desc: 'WeChat Pay' },
};

/**
 * Recharge order status enum
 */
export const ORDER_STATUS_ENUM = {
  PENDING: { value: 0, desc: 'Pending Payment' },
  PAID: { value: 1, desc: 'Paid' },
  CANCELED: { value: 2, desc: 'Canceled' },
  REFUNDED: { value: 3, desc: 'Refunded' },
};

// Application status enum
export const APPLICATION_STATUS_ENUM = {
  PENDING_REVIEW: { value: 1, desc: 'Pending Review' },
  REVIEWED: { value: 2, desc: 'Reviewed' },
  COMMUNICATED: { value: 3, desc: 'Contacted' },
  REJECTED: { value: 4, desc: 'Not a Fit' },
  CANCELED: { value: 5, desc: 'Canceled' },
};

// Resume status enum
export const RESUME_STATUS_ENUM = {
  DISABLED: { value: 0, desc: 'Disabled' },
  NORMAL: { value: 1, desc: 'Normal' },
  PENDING_REVIEW: { value: 2, desc: 'Pending Review' },
  FROZEN: { value: 3, desc: 'Frozen' },
  DRAFT: { value: 4, desc: 'Draft' },
};

// High-value resume status
export const RESUME_HIGH_VALUE_ENUM = {
  NORMAL: { value: 0, desc: 'Regular Resume' },
  HIGH: { value: 1, desc: 'High-value Resume' },
};

// High-value application status
export const RESUME_HIGH_VALUE_APPLY_STATUS_ENUM = {
  NONE: { value: 0, desc: 'Regular Resume' },
  PENDING: { value: 1, desc: 'Applying' },
  APPROVED: { value: 2, desc: 'Application Approved' },
};
