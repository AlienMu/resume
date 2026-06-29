import { userCenter } from './user-center';
import { enterpriseCenter } from './enterprise-center';
import { talent } from './talent';
import { inviteCenter } from './invite-center';
import { common } from './common.lang';

const work = {
  title: '最专业的华人求职招聘平台',
  search: {
    selectPlaceholder: '职位',
    button: '搜索',
    registerButton: '30秒快速注册找工作',
    hotJob: '热门职位：',
  },
  choice: {
    title: '热门推广',
    more: '更多职位',
  },
  panels: {
    web3: {
      title: 'Web3 专场',
      subTitle: '解锁全球 Web3 前沿机会，远程/海外岗任选，高薪+风口双重加持！',
    },
    internet: {
      title: '互联网专场',
      subTitle: '互联网全岗位集结，产品/技术/运营/推广/职能等海外岗任选，高薪机会一键直达！',
    },
    finance: {
      title: '金融专场',
      subTitle: '金融优质岗位上新，投资/战略/商业分析等海外岗同步开放，高薪+稳定双重保障！',
    },
    other: {
      title: '其他专场',
      subTitle: '全行业多元机会集合，远程/海外/高薪岗应有尽有，总有一款适合你！',
    },
  },
};

const layout = {
  message: '消息',
  userCenter: '个人中心',
  logout: '退出登录',
  announcement: {
    label: '系统公告',
    empty: '暂无公告内容',
  },
};

const workMore = {
  detail: {
    report: '举报',
    apply: '申请',
    applied: '已投递',
    applyLoading: '投递中...',
    hrContact: '立即沟通',
    hrName: '招聘专员',
    salaryRange: '{min}-{max} USD',
    step: {
      0: '岗位详情',
      1: '公司概况',
      2: '公司介绍',
      3: '食宿福利',
      4: '公司风采',
    },
    tipsTitle: '免责及防骗提醒',
    tips: {
      0: '1、本平台为半公益性质，海外招聘信息繁杂且部分无法有效验证。职位内容及相关信息为用户自行发布，平台不负责信息真伪核验，需用户自行判断与核实。',
      1: '2、远程工作面试和入职前，请尽量反向背调企业，避免出现骗稿、拖欠薪资等情况。',
      2: '3、现场面试前请告知亲友面试地点，最好有人陪同前往；勿乘坐陌生人车辆，面试地点务必选择在人员密集区域或正规写字楼办公室，请勿私自前往私人场所；如需乘坐陌生车辆，请上车前拍摄车牌并告知亲友，同时打开实时定位。',
      3: '4、正规企业绝不会向求职者索取任何费用。若发现假冒公司、信息与承诺不符等被骗情况，请与平台官方联系，平台核实后将第一时间封禁账号并进行全网曝光处理。',
    },
    recruitCount: '招{count}人',
    company: {
      name: '企业名称',
      website: '网址',
      industry: '所属行业',
      size: '公司规模',
    },
    loginModal: {
      title: '请先登录',
      content: '您需要登录后才能投递简历',
      reportContent: '您需要登录后才能举报职位',
      okText: '去登录',
    },
    messages: {
      applySuccess: '简历投递成功',
      applyFailed: '简历投递失败，请稍后重试',
      checkStatusFailed: '获取投递状态失败',
    },
    resumeModal: {
      title: '选择投递的简历',
      instruction: '请选择本次投递所使用的简历',
      okText: '确认投递',
      cancelText: '暂不投递',
      validation: '请选择一份简历后再提交',
      fetchFailed: '获取简历列表失败，请稍后再试',
      empty: '暂无可用简历',
      emptyTip: '暂无可用简历，请先前往个人中心创建简历',
      unnamed: '未命名简历',
      updatedAt: '更新于 {time}',
    },
    contactModal: {
      title: 'HR联系方式',
      okText: '知道了',
    },
  },
};

const list = {
  search: {
    keywordPlaceholder: '请输入关键词（例：职位、公司名、技能专长...）',
    options: {
      jobCategory: {
        all: '全部类型',
      },
      city: {
        all: '全部城市',
      },
      jobType: {
        all: '不限',
        fullTime: '全职',
        partTime: '兼职',
        internship: '实习',
      },
    },
  },
  list: {
    empty: '暂无符合条件的职位',
    loadingMore: '正在加载职位...',
    fetchError: '职位列表加载失败，请稍后重试',
  },
  detail: {
    fetchError: '职位详情加载失败，请稍后重试',
  },
};

const account = {
  valid: {
    min: `密码必须包含字母和数字且不少于{num}位`,
    password: '请输入密码',
    phoneExists: '该手机号已被注册',
    emailExists: '该邮箱已被注册',
    telegramExists: '该Telegram账号已被使用',
    emailFormat: '电子邮箱格式错误',
    passwordNotMatch: '两次输入的密码不一致',
  },
  placeholder: [
    '请输入你的手机号码',
    '请输入验证码',
    '请输入登录密码',
    '请设置登录密码',
    '请输入您的电子邮箱',
    '请输入您的注册电子邮箱',
    '请输入电子邮箱接收的验证码',
    '请输入新登录密码',
    '请再次输入新登录密码',
    "请输入Telegram账号，含 {'@'} 的完整ID",
    '请输入朋友给您的邀请码',
  ],
  tips: [
    '温馨提醒：',
    '1、注册方式：所有用户使用邮箱注册，注册后暂不支持修改。',
    '2、HR和求职者可Telegram直接沟通对话，请填写Telegram账号并确保信息准确。',
    '3、登录身份：系统将根据您注册时选择的身份，自动进入求职者 / 企业对应账号。',
    '4、注册完成后，请前往会员中心完善个人简历或企业资料。',
  ],
  login: {
    title: '登录',
    selectCountry: '选择国家/地区',
    help: '还没有账号吗？ | 立即注册',
    submit: '登录',
  },
  register: {
    tab: '求职注册 | 企业注册',
    help: '已有账号？ | 立即登录',
    submit: '注册',
    registerTelegram: '去注册',
  },
  invite: {
    title: '纷简历，人人都能赚收益',
    inviteCode: '我的邀请码',
    tips: [
      '1、注册方式：纷简历采用「老用户邀请制」——新会员必须输入专属邀请码才能完成注册。⚠ 请务必确保邮箱与Telegram账号填写正确。',
      '2、收益方式：',
      '① 付费查看收益  企业每付费下载一份简历，你即可获得75%分润。  举例：简历定价20 USDT，平台8折 → 实收16 USDT，你可得12 USDT，且同一份简历可被多家企业无限次下载，收益滚雪球！',
      '② 邀请享分润收益  只要累计上传5份简历，系统立刻解锁「邀请功能」。  你邀请的HR／猎头，其简历每被下载一次，你可再获得25%分润。  下级还能邀请下下级，层级、人数、时间均无上限，真正实现躺赚！',
    ],
  },
  sendMessage: '发送验证码',
  forgetPassword: '忘记密码？',
  resetPassword: '重置密码',
  messages: {
    captchaLoadFailed: '验证码加载失败，请稍后再试',
    registerSuccess: '注册成功，请使用邮箱登录',
    inviteRegisterSuccess: '邀请注册成功，正在自动登录...',
    inviteRegisterSuccessLogin: '邀请注册成功，请登录',
    passwordResetSuccess: '密码重置成功，请重新登录',
    emailCodeSent: '验证码已发送，请查收邮箱',
    getUserInfoFailed: '登录成功，但获取用户信息失败，请刷新页面',
  },
};

const footer = {
  subTitle: '最专业的华人职位招聘平台',
  serviceType: {
    title: '服务类型',
    job: '求职服务',
    ad: '广告服务',
    recruit: '招聘服务',
    varied: '纷简历',
  },
  contact: {
    title: '合作联系',
    telegram: 'Telegram：XXXXXXXXX',
    email: `邮箱：caddie{'@'}ujob.com`,
    telegramLabel: 'Telegram：',
    emailLabel: '邮箱：',
  },
  link: {
    title: '友情链接',
    fenjianli: '纷简历',
  },
  copyright: {
    0: 'Copyright © 2025 海外聘',
    1: '京ICP备14013441号-5',
    2: '京ICP证150923号',
    3: '京公网安备11010502032801',
  },
};

const header = {
  nav: {
    home: '首页',
    list: '找工作',
    talent: '找人才',
    community: '社群',
  },
  login: '登录/注册',
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
