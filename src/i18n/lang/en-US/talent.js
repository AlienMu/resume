export const talent = {
  search: {
    hotJob: 'Popular jobs:',
    selectPlaceholder: 'Industry | Position | Work mode',
    button: 'Search',
    registerButton: 'Register in 30s to find talent',
  },
  tips: 'Within 7 days of a resume update, if the contact info is fake and unreachable you may report it, and a refund will be issued after verification.',
  mask: {
    title: 'Become a corporate member to select talent efficiently | To protect privacy, individual users cannot view this',
    more: 'Log in or register to view more resume information',
    register: 'Register | Find a job',
    login: 'Log in | Log out',
  },
  list: {
    button: 'View resume',
    salary: 'Expected salary {num} USD',
    workYears: '{num} years and above',
  },
  detail: {
    nationality: 'Nationality: {text}',
    currentLocation: 'Current location: {text}',
    jobStatus: 'Job-seeking status',
    report: 'Report',
    sendContact: 'Contact now',
    viewContact: 'View contact info',
    steps: [
      'Contact info | (※ Includes phone, email, Telegram, and other contact methods) | *Within 7 days of a resume update, if all contact info is fake and unreachable, you may report the resume and upload supporting evidence; a refund will be issued after the platform verifies it',
      'Job intention',
      'Strengths & experience',
      'Resume attachment',
    ],
    wechat: 'WeChat',
    contactMethods: {
      phone: 'Phone',
      email: 'Email',
      telegram: 'Telegram',
      other: 'Other contact methods',
    },
    contactNotePrefix: '※ Includes',
    intention: ['Desired position:', 'Current monthly salary:', 'Expected monthly salary:', 'Open to overseas:', 'Work type:', 'Current location:', 'Desired country:', 'Desired industry:'],
    tips:
      'Disclaimer & anti-fraud reminder: | ' +
      '1. Job-seeking information varies widely and can be hard to verify. Scammers often demand money under the guise of test server purchases, advance payments, or buying plane tickets — do not trust them. The platform has fulfilled its duty to notify; any losses are borne by the user. | ' +
      '2. Legitimate companies never charge job seekers any fees. If violations such as fake companies, information inconsistent with promises, or paid recruitment are reported, the platform will ban the account immediately after verification and expose it across all channels.',
  },
  modal: {
    recharge: {
      title: 'Become a paid corporate member to select talent efficiently',
      content: 'With a sufficient corporate member account balance, you can select talent efficiently. Your current account balance ({num} USDT) is insufficient. To protect job seekers\' privacy, the full resume content cannot be viewed',
      cancelButton: 'Back to talent search {num}s',
      okButton: 'Recharge',
    },
    viewResume: {
      title: 'View resume',
      highValueLabel: 'High-value resume',
      success: 'Payment successful',
      content: [
        '<span class="mui-desc-text ">Confirm paying <span class="mui-error-text">{num}</span> (<span style="text-decoration: line-through;">original price {originalPrice}</span>) USDT to view this resume?</span>',
        '<span class="mui-desc-text ">This is a high-value resume. Confirm paying <span class="mui-error-text">{num}</span> (<span style="text-decoration: line-through;">original price {originalPrice}</span>) USDT to view it?</span>',
      ],
      cancelButton: 'Cancel',
      okButton: 'Confirm',
      tips: '<span class="mui-desc-text "><span class="mui-error-text">*</span>Within <span class="mui-error-text">7</span> days of a resume update, if the contact info is fake and unreachable,<br/>you may report the resume and upload supporting evidence; a refund will be issued after the platform verifies it</span>',
    },
    reportResume: {
      title: 'Report resume',
      titleMap: {
        resume: 'Report resume',
        job: 'Report job',
      },
      submit: 'Submit report',
      cancel: 'Cancel',
      tips: '*Within 7 days of a resume update, if all contact info is invalid and unreachable, you may report the resume and upload supporting evidence; a refund will be issued after the platform verifies it',
      form: ['Report reason', 'Report details', 'Upload screenshot'],
      reasonOptions: {
        fakeContact: 'Contact info is fake or unreachable',
        infoMismatch: 'Content does not match the facts',
        fraud: 'Suspected fraud or charging fees',
        other: 'Other violations',
      },
    },
    reportSuccess: {
      title: 'Report resume',
      titleMap: {
        resume: 'Report resume',
        job: 'Report job',
      },
      tips: '<p class="mui-font-size-16">Report submitted</p><span class="mui-desc-text ">Our team will verify it as soon as possible and notify you of the result via the "Message Center".<br/>Thank you for your support.</span>',
      button: 'Closing in {num}s',
    },
  },
};
