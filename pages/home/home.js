var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');
var format = require('../../utils/format.js');

function mapResort(r) {
  return {
    id: r.id,
    name: r.name,
    loc: r.loc,
    cover: dataMod.ossUrl(r.cover),
    badge: r.badge,
    badgeSec: r.id === 'R002',
    remainOne: r.remain === 1,
    soldOut: !!r.soldOut,
    fav: store.isFav(r.id),
    score: r.score,
    tags: (r.tags || []).slice(0, 3),
    promo: r.promo,
    price: format.money(r.price)
  };
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    brands: [],
    resorts: [],
    flashCover: '',
    packCover: ''
  },

  onLoad: function () {
    this.setData(store.navChrome());
  },

  onShow: function () {
    store.setTabBar(this, 0);
    this.refresh();
  },

  refresh: function () {
    this.setData({
      brands: dataMod.BRANDS.map(function (b) {
        return {
          id: b.id,
          name: b.name,
          desc: b.desc,
          cover: dataMod.ossUrl(b.cover)
        };
      }),
      resorts: dataMod.RESORTS.map(mapResort),
      flashCover: dataMod.ossUrl('flash-zhulu'),
      packCover: dataMod.ossUrl('package-dali')
    });
  },

  goBrands: function () {
    wx.navigateTo({ url: '/pages/brands/brands' });
  },

  goMe: function () {
    wx.switchTab({ url: '/pages/me/me' });
  },

  goPrivileges: function () {
    wx.navigateTo({ url: '/pages/privileges/privileges' });
  },

  goResorts: function () {
    wx.switchTab({ url: '/pages/resorts/resorts' });
  },

  onBrand: function (e) {
    var id = e.currentTarget.dataset.id;
    var d = store.appData();
    d.filter.brand = id;
    d.filter.tag = '';
    store.save();
    wx.switchTab({ url: '/pages/resorts/resorts' });
  },

  flashBuy: function () {
    var d = store.appData();
    d.selectedResortId = 'R001';
    d.selectedRoomId = 'RM01';
    store.setFromFlash(true);
    store.save();
    wx.navigateTo({ url: '/pages/resort/resort?id=R001' });
  },

  pickDali: function () {
    var d = store.appData();
    d.selectedResortId = 'R002';
    d.selectedRoomId = 'RD02';
    store.setFromFlash(true);
    store.save();
    wx.navigateTo({ url: '/pages/resort/resort?id=R002' });
  },

  onResort: function (e) {
    var id = e.currentTarget.dataset.id;
    store.setFromFlash(false);
    wx.navigateTo({ url: '/pages/resort/resort?id=' + id });
  },

  onFav: function (e) {
    var id = e.currentTarget.dataset.id;
    var on = store.toggleFav(id);
    store.toast(on ? '已收入心愿清单' : '已取消收藏');
    this.refresh();
  },

  onSubscribe: function (e) {
    var id = e.currentTarget.dataset.id;
    var d = store.appData();
    if (d.subscribe.indexOf(id) < 0) d.subscribe.push(id);
    store.save();
    store.toast('空房通知已订阅，档期释放时会提醒你');
  }
});
