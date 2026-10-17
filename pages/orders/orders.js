var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');
var format = require('../../utils/format.js');

var TABS = [
  { key: 'all', label: '全部' },
  { key: 'hold', label: '待入住' },
  { key: 'done', label: '已完成' },
  { key: 'cancel', label: '已取消' }
];

var STATUS = {
  hold: { label: '待入住', cls: 'od-st-hold' },
  done: { label: '已完成', cls: 'od-st-done' },
  cancel: { label: '已取消', cls: 'od-st-cancel' }
};

function mapOrder(o) {
  var st = STATUS[o.status] || STATUS.hold;
  return {
    id: o.id,
    resortId: o.resortId,
    resortName: o.resortName,
    roomName: o.roomName,
    cover: dataMod.ossUrl(o.cover),
    dates: o.inLabel + ' — ' + o.outLabel + ' · ' + o.nights + '晚',
    pay: format.money(o.pay),
    status: o.status,
    isHold: o.status === 'hold',
    stLabel: st.label,
    stCls: st.cls
  };
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    tabs: [],
    countAll: 0,
    countHold: 0,
    list: [],
    empty: true
  },

  onLoad: function () {
    this.setData(store.navChrome());
  },

  onShow: function () {
    store.setTabBar(this, 2);
    this.refresh();
  },

  refresh: function () {
    var tab = getApp().globalData.ui.orderTab || 'all';
    var all = store.appData().bookings.slice().sort(function (a, b) {
      return b.created - a.created;
    });
    var list = all.filter(function (o) {
      return tab === 'all' || o.status === tab;
    }).map(mapOrder);
    this.setData({
      tabs: TABS.map(function (t) {
        return { key: t.key, label: t.label, on: tab === t.key };
      }),
      countAll: all.length,
      countHold: all.filter(function (o) { return o.status === 'hold'; }).length,
      list: list,
      empty: !list.length
    });
  },

  onTab: function (e) {
    getApp().globalData.ui.orderTab = e.currentTarget.dataset.key;
    this.refresh();
  },

  cancelOrder: function (e) {
    var id = e.currentTarget.dataset.id;
    var bookings = store.appData().bookings;
    for (var i = 0; i < bookings.length; i++) {
      if (bookings[i].id === id && bookings[i].status === 'hold') {
        bookings[i].status = 'cancel';
      }
    }
    store.save();
    this.refresh();
    store.toast('行程已取消，房费将按规则原路退回');
  },

  rebook: function (e) {
    var id = e.currentTarget.dataset.id;
    store.setFromFlash(false);
    wx.navigateTo({ url: '/pages/resort/resort?id=' + id });
  },

  goResorts: function () {
    wx.switchTab({ url: '/pages/resorts/resorts' });
  }
});
