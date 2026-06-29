export const common = {
  // 自动保存状态
  autoSave: {
    saved: '已自动保存',
    saving: '自动保存中...',
    failed: '自动保存失败，请稍后重试',
  },
  notData: '暂无相关数据，您可以尝试调整关键词或扩大搜索范围。',

  autoLoading: '已自动保存 | 自动保存中...',

  // 更新时间显示
  updateAgo: ['刚刚更新', '{num}小时前更新', '{num}天前更新', '{num}个月前更新', '{num}年前更新'],

  // 编辑状态
  edit: '修改 | 保存 | 取消',

  // 隐藏/公开状态
  hideStatus: '隐藏 | 公开',

  // 通用验证消息
  validation: {
    required: {
      generic: '请输入{field}',
      select: '请选择{field}',
      upload: '请上传{field}',
    },
    length: {
      min: '{field}至少需要{length}个字符',
    },
  },

  // 通用模态框
  modal: {
    buttons: {
      ok: '确定',
      cancel: '取消',
    },
    ok: '确定',
    cancel: '取消',
  },

  // 通用表单
  form: {
    placeholders: {
      input: '请输入{name}',
      select: '请选择{name}',
      search: '请输入关键字搜索',
      searchKeywords: '请输入关键字（例：职位、公司名、技能专长...）',
      upload: '点击或拖拽文件到此处上传',
      general: '请输入{name} | 请选择{name}',
    },
    // 通用字段名称
    fieldNames: {
      industry: '行业',
      jobCategory: '职位',
      jobType: '工作模式',
    },
  },

  // 通用上传
  upload: {
    uploadText: '上传附件',
    fileType: '支持{type}格式',
    fileSize: '文件大小不超过{size}MB',
    cropper: '图片裁剪',
  },

  // 通用提示
  tips: {
    noData: '暂无数据',
    loading: '加载中...',
    networkError: '网络错误，请检查网络连接',
    serverError: '服务器错误，请稍后重试',
    permissionDenied: '权限不足',
    notMore: '没有更多了',
  },

  // 操作相关
  operate: '操作',
  back: '返回',
  download: '下载',
  loadMore: '加载更多',

  // 通用消息模式
  messages: {
    success: {
      save: '保存成功',
      update: '更新成功',
      submit: '提交成功',
      refresh: '刷新成功',
    },
    failed: {
      save: '保存失败，请稍后重试',
      update: '更新失败，请稍后重试',
    },
    loading: {
      generic: '正在加载{content}...',
    },
  },

  // 错误页面
  errorPages: {
    404: {
      title: '很抱歉，页面无法访问',
      desc: [
        '可先尝试以下方式排查：',
        '1、若您正在使用VPN/代理，请完全关闭后重新刷新页面。',
        '2、若仍无法进入，请切换手机热点或其他网络环境后再试。',
        '3、以上方法均无效时，请点击「联系客服」反馈问题。',
      ],
      button: '联系客服 | 返回首页',
    },
    403: {
      title: '账号违规，无法登录个人中心',
      desc: '经用户举报，您因多次发布虚假内容、无效联系方式简历等违规行为，现已被限制登录',
    },
  },

  // 客服悬浮文案
  customerService: {
    title: '客服',
    serviceHoursTitle: '服务时间',
    timezone: '台北&北京',
    workingDays: '周一至周五',
    hoursMorning: '10-12 AM',
    hoursAfternoon: '14-18 PM',
  },
};
