var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');
var format = require('../../utils/format.js');

function viewPerks() {
  return dataMod.PERKS.map(function (p) {
    return { icon: p[0], title: p[1], desc: p[2] };
  });
}

function viewPacks() {
  return dataMod.PACKS.map(function (p) {
    return {
      coverUrl: dataMod.ossUrl(p.cover),
      title: p.title,
      sub: p.sub,
      priceText: format.money(p.price),
      resortId: p.resortId,
      roomId: p.roomId,
      hot: !!p.hot,
      remain: p.remain || 0
    };
  });
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    heroUrl: '',
    perks: [],
    packs: [],
    flash: { h: '00', m: '00', s: '00' }
  },
  onLoad: function () {
    this.setData(store.navChrome());
    this.setData({
      heroUrl: dataMod.ossUrl('flash-zhulu'),
      perks: viewPerks(),
      packs: viewPacks()
    });
  },
  onShow: function () {
    this.paintFlash();
    this.startTick();
  },
  onHide: function () {
    this.stopTick();
  },
  onUnload: function () {
    this.stopTick();
  },
  paintFlash: function () {
    this.setData({ flash: format.formatFlash(store.appData().flashLeft) });
  },
  startTick: function () {
    var that = this;
    this.stopTick();
    this._tick = setInterval(function () {
      var d = store.appData();
      if (d.flashLeft > 0) d.flashLeft--;
      that.paintFlash();
    }, 1000);
  },
  stopTick: function () {
    if (this._tick) {
      clearInterval(this._tick);
      this._tick = null;
    }
  },
  onPickPack: function (e) {
    var id = e.currentTarget.dataset.id;
    var room = e.currentTarget.dataset.room || '';
    var d = store.appData();
    d.selectedResortId = id;
    d.selectedRoomId = room;
    store.setFromFlash(true);
    store.save();
    wx.navigateTo({ url: '/pages/resort/resort?id=' + id });
  },
  onGoResorts: function () {
    wx.switchTab({ url: '/pages/resorts/resorts' });
  },
  onGoButler: function () {
    wx.navigateTo({ url: '/pages/butler/butler' });
  }
});
