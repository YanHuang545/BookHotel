var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');
var format = require('../../utils/format.js');

function findHold() {
  var list = store.appData().bookings || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].status === 'hold') return list[i];
  }
  return null;
}

function viewMessages() {
  return (store.appData().messages || []).map(function (m) {
    return {
      id: m.id,
      mine: m.role === 'me',
      name: m.name || (m.role === 'me' ? '我' : '阿岚'),
      time: format.formatMsgTime(m.at),
      text: m.text
    };
  });
}

function appendButler(role, text) {
  var d = store.appData();
  d.messages.push({
    id: 'M' + Date.now().toString(36) + (role === 'me' ? 'a' : 'b'),
    role: role,
    name: role === 'me' ? d.user.name : '阿岚',
    text: text,
    at: Date.now()
  });
  store.save();
}

function replyButler(userText) {
  var topic = null;
  var topics = dataMod.BUTLER_TOPICS;
  for (var i = 0; i < topics.length; i++) {
    if (topics[i].q === userText) topic = topics[i];
  }
  var hold = findHold();
  var reply = topic ? topic.a : '已收到。阿岚会在今日值班时段（08:00–22:00）跟进，紧急接驳可拨 400-800-9188。';
  if (!topic && hold) reply += ' 你有一笔待入住：' + hold.resortName + '，' + hold.inLabel + ' 入住。';
  appendButler('butler', reply);
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    heroUrl: '',
    hold: null,
    topics: [],
    messages: [],
    draft: ''
  },
  onLoad: function () {
    this.setData(store.navChrome());
    this.setData({
      heroUrl: dataMod.ossUrl('brand-sitang'),
      topics: dataMod.BUTLER_TOPICS
    });
  },
  onShow: function () {
    this.refresh();
    this.scrollEnd();
  },
  refresh: function () {
    var hold = findHold();
    this.setData({
      hold: hold ? {
        resortName: hold.resortName,
        inLabel: hold.inLabel,
        outLabel: hold.outLabel
      } : null,
      messages: viewMessages(),
      draft: store.appData().butlerDraft || ''
    });
  },
  scrollEnd: function () {
    setTimeout(function () {
      wx.pageScrollTo({ scrollTop: 99999, duration: 200 });
    }, 80);
  },
  onCopyWx: function () {
    wx.setClipboardData({ data: 'QILAN_MOGAN_VIP' });
  },
  onCall: function () {
    wx.makePhoneCall({ phoneNumber: '4008009188' });
  },
  onHold: function () {
    wx.switchTab({ url: '/pages/orders/orders' });
  },
  onGoResorts: function () {
    wx.switchTab({ url: '/pages/resorts/resorts' });
  },
  onTopic: function (e) {
    var key = e.currentTarget.dataset.key;
    var topic = null;
    var topics = dataMod.BUTLER_TOPICS;
    for (var i = 0; i < topics.length; i++) {
      if (topics[i].key === key) topic = topics[i];
    }
    if (!topic) return;
    appendButler('me', topic.q);
    replyButler(topic.q);
    this.refresh();
    this.scrollEnd();
  },
  onDraft: function (e) {
    var val = e.detail.value;
    store.appData().butlerDraft = val;
    store.save();
    this.setData({ draft: val });
  },
  onSend: function () {
    var text = (this.data.draft || store.appData().butlerDraft || '').trim();
    if (!text) {
      store.toast('先写一句给阿岚');
      return;
    }
    store.appData().butlerDraft = '';
    this.setData({ draft: '' });
    appendButler('me', text);
    replyButler(text);
    this.refresh();
    this.scrollEnd();
  }
});
