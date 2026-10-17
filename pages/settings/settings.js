var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');

var POLICY_ROWS = [
  ['booking', '预订须知', 'Stay guide'],
  ['cancel', '取消与改期', 'Cancel & change'],
  ['privacy', '隐私与数据', 'Privacy'],
  ['member', '会员礼遇', 'Member care']
];

function copyFor(en) {
  return {
    settingsTitle: en ? 'Settings & policies' : '设置与协议',
    settingsLead: en ? 'Preferences stay on this phone. No real account.' : '偏好只写在这台设备上，没有真实账号体系。',
    notifyLab: en ? 'NOTIFICATIONS' : '通知偏好',
    langLab: en ? 'LANGUAGE' : '显示语言',
    policyLab: en ? 'POLICIES' : '协议与须知',
    clearLab: en ? 'Clear local filters & chat' : '清除本地筛选与管家会话',
    foot: en ? 'Demo build · no SMS or live payment' : '演示版本 · 不发送短信、不发起真实支付'
  };
}

function notifyRows(d, en) {
  var n = d.notify || {};
  var rows = [
    ['order', en ? 'Stay updates' : '订单动态', en ? 'Hold, check-in and cancel notices' : '待入住、入住提醒与取消回执'],
    ['empty', en ? 'Room-open alert' : '空房提醒', en ? 'Ping when a sold-out weekend frees up' : '满房档期释放时通知你'],
    ['offer', en ? 'Member offers' : '优惠推送', en ? 'Coupons and flash lodges' : '专享券与闪住档期'],
    ['quiet', en ? 'Night quiet hours' : '夜间免打扰', en ? 'Mute 22:00–08:00 except shuttle' : '22:00–08:00 仅保留接驳电话']
  ];
  return rows.map(function (r) {
    return { key: r[0], title: r[1], desc: r[2], on: !!n[r[0]] };
  });
}

function policyRows(en) {
  return POLICY_ROWS.map(function (p) {
    return { id: p[0], title: en ? p[2] : p[1], sub: en ? p[1] : p[2] };
  });
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    en: false,
    copy: {},
    user: { name: '', level: '', phone: '' },
    avatarUrl: '',
    notifyRows: [],
    policies: []
  },
  onLoad: function () {
    this.setData(store.navChrome());
    this.setData({ avatarUrl: dataMod.ossUrl('avatar-guest') });
  },
  onShow: function () {
    this.refresh();
  },
  refresh: function () {
    var d = store.appData();
    var en = d.lang === 'en';
    this.setData({
      en: en,
      copy: copyFor(en),
      user: d.user,
      notifyRows: notifyRows(d, en),
      policies: policyRows(en)
    });
  },
  onToggleNotify: function (e) {
    var key = e.currentTarget.dataset.key;
    var d = store.appData();
    if (!d.notify || typeof d.notify !== 'object') d.notify = dataMod.seedData().notify;
    d.notify[key] = !d.notify[key];
    store.save();
    this.refresh();
  },
  onLang: function (e) {
    store.appData().lang = e.currentTarget.dataset.key === 'en' ? 'en' : 'zh';
    store.save();
    this.refresh();
  },
  onPolicy: function (e) {
    wx.navigateTo({ url: '/pages/policy/policy?id=' + e.currentTarget.dataset.id });
  },
  onClear: function () {
    var d = store.appData();
    var seed = dataMod.seedData();
    d.filter = { brand: '', area: '', price: '', amenity: '', sort: 'recommend', tag: '' };
    d.messages = seed.messages;
    d.butlerDraft = '';
    store.save();
    store.toast('本地筛选与管家会话已清空');
    this.refresh();
  }
});
