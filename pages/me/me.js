var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');

var MENU = [
  { icon: 'calendar', label: '我的订单', go: 'orders' },
  { icon: 'group', label: '常用入住人', go: 'guests' },
  { icon: 'coupon', label: '优惠券包', go: 'coupons' },
  { icon: 'awesome', label: '品牌矩阵', go: 'brands' },
  { icon: 'forum', label: '咨询管家', go: 'butler' },
  { icon: 'settings', label: '设置与协议', go: 'settings' }
];

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    user: { name: '', level: '', member: '' },
    avatar: '',
    favCount: 0,
    couponCount: 0,
    guestCount: 0,
    last: null,
    hasLast: false,
    menu: MENU
  },

  onLoad: function () {
    this.setData(store.navChrome());
  },

  onShow: function () {
    store.setTabBar(this, 3);
    this.refresh();
  },

  refresh: function () {
    var d = store.appData();
    var last = d.bookings && d.bookings[0] ? d.bookings[0] : null;
    this.setData({
      user: d.user,
      avatar: dataMod.ossUrl('avatar-guest'),
      favCount: (d.favorites || []).length,
      couponCount: (d.coupons || []).filter(function (c) { return c.usable; }).length,
      guestCount: (d.guests || []).length,
      hasLast: !!last,
      last: last ? {
        cover: dataMod.ossUrl(last.cover),
        resortName: last.resortName,
        line: last.inLabel + ' · ' + last.nights + '晚'
      } : null
    });
  },

  goResorts: function () {
    wx.switchTab({ url: '/pages/resorts/resorts' });
  },

  goCoupons: function () {
    wx.navigateTo({ url: '/pages/coupons/coupons' });
  },

  goGuests: function () {
    wx.navigateTo({ url: '/pages/guests/guests' });
  },

  goOrders: function () {
    wx.switchTab({ url: '/pages/orders/orders' });
  },

  onMenu: function (e) {
    var go = e.currentTarget.dataset.go;
    if (go === 'orders') {
      wx.switchTab({ url: '/pages/orders/orders' });
      return;
    }
    var map = {
      guests: '/pages/guests/guests',
      coupons: '/pages/coupons/coupons',
      brands: '/pages/brands/brands',
      butler: '/pages/butler/butler',
      settings: '/pages/settings/settings'
    };
    if (map[go]) wx.navigateTo({ url: map[go] });
  }
});
