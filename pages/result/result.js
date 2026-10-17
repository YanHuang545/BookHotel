var store = require('../../utils/store.js');
var format = require('../../utils/format.js');
var dataMod = require('../../utils/data.js');

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    hasOrder: false,
    order: {}
  },

  onLoad: function (query) {
    this.setData(store.navChrome());
    var d = store.appData();
    var id = (query && query.id) || '';
    var o = null;
    for (var i = 0; i < d.bookings.length; i++) {
      if (d.bookings[i].id === id) o = d.bookings[i];
    }
    if (!o) o = d.bookings[0] || null;
    if (!o) {
      this.setData({ hasOrder: false });
      return;
    }
    this.setData({
      hasOrder: true,
      order: {
        id: o.id,
        cover: dataMod.ossUrl(o.cover),
        resortName: o.resortName,
        roomName: o.roomName,
        inLabel: o.inLabel,
        outLabel: o.outLabel,
        nights: o.nights,
        pay: format.money(o.pay)
      }
    });
  },

  goOrders: function () {
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  goHome: function () {
    wx.switchTab({ url: '/pages/home/home' });
  }
});
