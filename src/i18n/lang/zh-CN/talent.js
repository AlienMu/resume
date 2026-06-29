export const talent = {
  search: {
    hotJob: '热门职位：',
    selectPlaceholder: '行业 | 职位 | 工作模式',
    button: '搜索',
    registerButton: '30秒快速注册找人才',
  },
  tips: '简历更新7天内，若联系方式虚假无法联系可举报，经核实后予以退费处理。',
  mask: {
    title: '成为企业会员，高效挑选人才 | 为保护隐私，个人用户无法查看',
    more: '登录或注册后可以查看更多简历信息',
    register: '注册会员 | 找工作',
    login: '登录账号 | 退出登录',
  },
  list: {
    button: '查看简历',
    salary: '期望薪资 {num} USD',
    workYears: '{num}年及以上',
  },
  detail: {
    nationality: '国籍：{text}',
    currentLocation: '目前所在地：{text}',
    jobStatus: '求职状态',
    report: '举报',
    sendContact: '立即联系',
    viewContact: '查看联系方式',
    steps: [
      '联系方式 | （※含电话、电子邮箱、Telegram、其他联系方式） | *简历更新7天内，若联系方式全部虚假无法联系，可举报简历并上传证明资料，平台查证后将予以退费处理',
      '求职意向',
      '擅长&经历',
      '附件简历',
    ],
    wechat: '微信',
    contactMethods: {
      phone: '电话',
      email: '电子邮箱',
      telegram: 'Telegram',
      other: '其他联系方式',
    },
    contactNotePrefix: '※含',
    intention: ['意向职位：', '目前月薪：', '期望月薪：', '是否接受海外：', '工作性质：', '目前所在地：', '期望国家：', '意向行业：'],
    tips:
      '免责及防骗提醒：| ' +
      '1、各类求职信息繁杂难以辨别，骗子常以测试购买服务器、垫付费用、要求购买机票等名义索要钱财，请勿相信。平台已尽到告知义务，若有损失由用户自行承担。 | ' +
      '2、正规企业绝不会向求职者索取任何费用，若发现假冒公司、信息与承诺不符、收费招聘等违规行为被举报，平台核实后将第一时间封禁账号，并进行全网曝光处理。',
  },
  modal: {
    recharge: {
      title: '成为付费企业会员，即可高效挑选人才',
      content: '企业会员账户余额充足，即可高效挑选人才。您目前账户余额（{num} USDT）不足，为保护求职者隐私，无法浏览完整简历内容',
      cancelButton: '返回找人才 {num}s',
      okButton: '充值',
    },
    viewResume: {
      title: '查看简历',
      highValueLabel: '高价值简历',
      success: '支付成功',
      content: [
        '<span class="mui-desc-text ">确定付费<span class="mui-error-text">{num}</span>（<span style="text-decoration: line-through;">原价{originalPrice}</span>）USDT查看该简历？</span>',
        '<span class="mui-desc-text ">此简历为高价值简历，确定付费 <span class="mui-error-text">{num}</span>（<span style="text-decoration: line-through;">原价 {originalPrice}</span>）USDT 查看？</span>',
      ],
      cancelButton: '取消',
      okButton: '确定',
      tips: '<span class="mui-desc-text "><span class="mui-error-text">*</span>简历更新<span class="mui-error-text">7</span>天内，若联系方式虚假无法联系，<br/>可举报简历并上传证明资料，平台查证后将予以退费处理</span>',
    },
    reportResume: {
      title: '举报简历',
      titleMap: {
        resume: '举报简历',
        job: '举报职位',
      },
      submit: '提交举报',
      cancel: '取消',
      tips: '*简历更新7天内，若联系方式全部无效无法联系，可举报简历并上传证明资料，平台查证后将予以退费处理',
      form: ['举报原因', '举报详情', '截图上传'],
      reasonOptions: {
        fakeContact: '联系方式虚假或无法联系',
        infoMismatch: '内容与事实不符',
        fraud: '涉嫌诈骗或收费',
        other: '其他违规问题',
      },
    },
    reportSuccess: {
      title: '举报简历',
      titleMap: {
        resume: '举报简历',
        job: '举报职位',
      },
      tips: '<p class="mui-font-size-16">举报已提交</p><span class="mui-desc-text ">工作人员会尽快核实，并通过「消息中心」通知你审核结果。<br/>感谢你的支持。</span>',
      button: '{num}秒后关闭',
    },
  },
};
