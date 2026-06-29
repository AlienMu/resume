import { userCenter } from './user-center';
import { enterpriseCenter } from './enterprise-center';
import { talent } from './talent';
import { inviteCenter } from './invite-center';
import { common } from './common.lang';

const work = {
  title: 'The Most Professional Recruitment Platform',
  search: {
    selectPlaceholder: 'Job',
    button: 'Search',
    registerButton: 'Sign Up in 30 Seconds to Find a Job',
    hotJob: 'Popular Jobs:',
  },
  choice: {
    title: 'Featured',
    more: 'More Jobs',
  },
  panels: {
    web3: {
      title: 'Web3 Special',
      subTitle: 'Unlock cutting-edge Web3 opportunities worldwide. Choose remote or overseas roles, with high pay and trending fields combined!',
    },
    internet: {
      title: 'Internet Special',
      subTitle:
        'All internet roles in one place. Choose overseas positions in product, tech, operations, marketing, functions and more, with high-paying opportunities just one click away!',
    },
    finance: {
      title: 'Finance Special',
      subTitle:
        'New premium finance roles available. Overseas positions in investment, strategy, business analysis and more are open, with high pay and stability guaranteed!',
    },
    other: {
      title: 'Other Specials',
      subTitle:
        'A diverse mix of opportunities across all industries. Remote, overseas and high-paying roles are all here. There is always one for you!',
    },
  },
};

const layout = {
  message: 'Messages',
  userCenter: 'Personal Center',
  logout: 'Log Out',
  announcement: {
    label: 'System Announcements',
    empty: 'No announcements yet',
  },
};

const workMore = {
  detail: {
    report: 'Report',
    apply: 'Apply',
    applied: 'Applied',
    applyLoading: 'Applying...',
    hrContact: 'Contact Now',
    hrName: 'Recruiter',
    salaryRange: '{min}-{max} USD',
    step: {
      0: 'Job Details',
      1: 'Company Overview',
      2: 'About the Company',
      3: 'Meals & Accommodation',
      4: 'Company Culture',
    },
    tipsTitle: 'Disclaimer & Fraud Prevention Reminder',
    tips: {
      0: '1. This platform is semi-nonprofit in nature. Overseas recruitment information is varied and some of it cannot be effectively verified. Job content and related information are published by users themselves; the platform is not responsible for verifying authenticity, and users must judge and verify on their own.',
      1: '2. Before remote work interviews and onboarding, please try to conduct a reverse background check on the company to avoid issues such as work theft or unpaid wages.',
      2: '3. Before an on-site interview, please inform friends or family of the interview location, and ideally have someone accompany you. Do not ride in strangers’ vehicles. Always choose interview locations in densely populated areas or proper office buildings, and never go to private premises alone. If you must ride in an unfamiliar vehicle, photograph the license plate and inform friends or family before getting in, and turn on real-time location sharing.',
      3: '4. Legitimate companies will never ask job seekers for any fees. If you discover fraud such as fake companies or information that does not match promises, please contact the platform officials. Once verified, the platform will immediately ban the account and expose it across the network.',
    },
    recruitCount: 'Hiring {count}',
    company: {
      name: 'Company Name',
      website: 'Website',
      industry: 'Industry',
      size: 'Company Size',
    },
    loginModal: {
      title: 'Please Log In First',
      content: 'You need to log in before applying with your resume',
      reportContent: 'You need to log in before reporting a job',
      okText: 'Go to Log In',
    },
    messages: {
      applySuccess: 'Application submitted successfully',
      applyFailed: 'Failed to submit application, please try again later',
      checkStatusFailed: 'Failed to get application status',
    },
    resumeModal: {
      title: 'Select a Resume to Submit',
      instruction: 'Please select the resume to use for this application',
      okText: 'Confirm Application',
      cancelText: 'Not Now',
      validation: 'Please select a resume before submitting',
      fetchFailed: 'Failed to get resume list, please try again later',
      empty: 'No resumes available',
      emptyTip: 'No resumes available. Please go to the Personal Center to create a resume first',
      unnamed: 'Untitled Resume',
      updatedAt: 'Updated on {time}',
    },
    contactModal: {
      title: 'HR Contact Information',
      okText: 'Got It',
    },
  },
};

const list = {
  search: {
    keywordPlaceholder: 'Enter a keyword (e.g. job, company name, skills...)',
    options: {
      jobCategory: {
        all: 'All Types',
      },
      city: {
        all: 'All Cities',
      },
      jobType: {
        all: 'Any',
        fullTime: 'Full-time',
        partTime: 'Part-time',
        internship: 'Internship',
      },
    },
  },
  list: {
    empty: 'No jobs match your criteria',
    loadingMore: 'Loading jobs...',
    fetchError: 'Failed to load job list, please try again later',
  },
  detail: {
    fetchError: 'Failed to load job details, please try again later',
  },
};

const account = {
  valid: {
    min: `Password must contain letters and numbers and be at least {num} characters`,
    password: 'Please enter your password',
    phoneExists: 'This phone number is already registered',
    emailExists: 'This email is already registered',
    telegramExists: 'This Telegram account is already in use',
    emailFormat: 'Invalid email format',
    passwordNotMatch: 'The two passwords do not match',
  },
  placeholder: [
    'Please enter your phone number',
    'Please enter the verification code',
    'Please enter your login password',
    'Please set your login password',
    'Please enter your email',
    'Please enter your registered email',
    'Please enter the verification code received by email',
    'Please enter your new login password',
    'Please enter your new login password again',
    "Please enter your Telegram account, the full ID including {'@'}",
    'Please enter the invitation code from your friend',
  ],
  tips: [
    'Friendly reminder:',
    '1. Registration method: All users register with an email, which cannot be changed after registration for now.',
    '2. HR and job seekers can communicate directly via Telegram. Please enter your Telegram account and make sure the information is accurate.',
    '3. Login identity: The system will automatically take you to the corresponding Job Seeker / Employer account based on the identity you chose at registration.',
    '4. After registration, please go to the Member Center to complete your personal resume or company profile.',
  ],
  login: {
    title: 'Log In',
    selectCountry: 'Select Country/Region',
    help: 'Don’t have an account yet? | Sign Up Now',
    submit: 'Log In',
  },
  register: {
    tab: 'Job Seeker Sign Up | Employer Sign Up',
    help: 'Already have an account? | Log In Now',
    submit: 'Sign Up',
    registerTelegram: 'Go Register',
  },
  invite: {
    title: 'WebResume: Everyone Can Earn',
    inviteCode: 'My Invitation Code',
    tips: [
      '1. Registration method: WebResume uses an "existing-user invitation system" — new members must enter an exclusive invitation code to complete registration. ⚠ Please make sure your email and Telegram account are entered correctly.',
      '2. How you earn:',
      '① Paid-view earnings: Every time a company pays to download a resume, you earn a 75% share. Example: A resume is priced at 20 USDT, with a 20% platform discount → 16 USDT received, and you get 12 USDT. The same resume can be downloaded by multiple companies an unlimited number of times, so earnings snowball!',
      '② Invitation share earnings: Once you have uploaded a total of 5 resumes, the system instantly unlocks the "Invitation feature". For every download of a resume from the HR/headhunters you invite, you earn an additional 25% share. Your invitees can also invite their own downline, with no limit on levels, number of people, or time, so you truly earn passively!',
    ],
  },
  sendMessage: 'Send Code',
  forgetPassword: 'Forgot password?',
  resetPassword: 'Reset Password',
  messages: {
    captchaLoadFailed: 'Failed to load verification code, please try again later',
    registerSuccess: 'Registration successful, please log in with your email',
    inviteRegisterSuccess: 'Invitation registration successful, logging in automatically...',
    inviteRegisterSuccessLogin: 'Invitation registration successful, please log in',
    passwordResetSuccess: 'Password reset successful, please log in again',
    emailCodeSent: 'Verification code sent, please check your email',
    getUserInfoFailed: 'Login successful, but failed to get user information. Please refresh the page',
  },
};

const footer = {
  subTitle: 'The Most Professional Job Recruitment Platform for Chinese Talent',
  serviceType: {
    title: 'Service Types',
    job: 'Job Seeking Service',
    ad: 'Advertising Service',
    recruit: 'Recruitment Service',
    varied: 'WebResume',
  },
  contact: {
    title: 'Partnership Contact',
    telegram: 'Telegram: XXXXXXXXX',
    email: `Email: caddie{'@'}ujob.com`,
    telegramLabel: 'Telegram: ',
    emailLabel: 'Email: ',
  },
  link: {
    title: 'Friendly Links',
    fenjianli: 'WebResume',
  },
  copyright: {
    0: 'Copyright © 2025 WebJob',
    1: 'Jing ICP Filing No. 14013441-5',
    2: 'Jing ICP Certificate No. 150923',
    3: 'Jing Public Network Security No. 11010502032801',
  },
};

const header = {
  nav: {
    home: 'Home',
    list: 'Find Jobs',
    talent: 'Find Talent',
    community: 'Community',
  },
  login: 'Log In / Sign Up',
};

export default {
  header,
  footer,
  work,
  layout,
  talent,
  account,
  workMore,
  list,
  userCenter,
  inviteCenter,
  enterpriseCenter,
  common,
};
