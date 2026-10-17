var store = require('../../utils/store.js');
var format = require('../../utils/format.js');
var dataMod = require('../../utils/data.js');

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    holdText: '14:59',
    resortName: '',
    roomName: '',
    thumb: '',
    search: {},
    guestName: '',
    guestPhone: '',
    eta: '',
    prefs: [],
    remark: '',
    level: '',
    nights: 2,
    total: '',
    off: '',
    pay: '',
    payPlain: '0',
    couponUsable: 0,
    sheet: '',
    etaList: [],
    formName: '',
    formPhone: '',
    priceSheet: {}
  },

  onLoad: function () {
    this.setData(store.navChrome());
  },

  onShow: function () {
    this.paint();
    this.startHoldTick();
  },

  onHide: function () {
    this.stopHoldTick();
    this.setData({ sheet: '' });
  },

  onUnload: function () {
    this.stopHoldTick();
  },

  paint: function () {
    var d = store.appData();
    var pair = store.findRoom(d.selectedRoomId);
    var r = pair.resort;
    var room = pair.room;
    var s = d.search;
    var total = store.roomTotal(room);
    var off = store.couponOff(total);
    var pay = Math.max(0, total - off);
    var guest = null;
    for (var i = 0; i < d.guests.length; i++) {
      if (d.guests[i].id === d.selectedGuestIds[0]) guest = d.guests[i];
    }
    if (!guest) guest = d.guests[0] || { name: '请选择入住人', phone: '' };
    var prefs = dataMod.PREFS.map(function (p) {
      return { key: p, on: d.preferences.indexOf(p) >= 0 };
    });
    var usable = 0;
    for (var c = 0; c < d.coupons.length; c++) if (d.coupons[c].usable) usable++;
    this.setData({
      holdText: format.formatHold(d.holdLeft),
      resortName: r.name,
      roomName: room.name,
      thumb: dataMod.ossUrl(r.thumb),
      search: store.searchView(s),
      guestName: guest.name,
      guestPhone: format.maskPhone(guest.phone),
      eta: d.eta,
      prefs: prefs,
      remark: d.remark || '',
      level: d.user.level,
      nights: s.nights,
      total: format.money(total),
      off: format.money(off),
      pay: format.money(pay),
      payPlain: format.moneyPlain(pay),
      couponUsable: usable
    });
  },

  startHoldTick: function () {
    this.stopHoldTick();
    var self = this;
    this._holdTimer = setInterval(function () {
      var d = store.appData();
      if (d.holdLeft > 0) d.holdLeft--;
      self.setData({ holdText: format.formatHold(d.holdLeft) });
    }, 1000);
  },

  stopHoldTick: function () {
    if (this._holdTimer) {
      clearInterval(this._holdTimer);
      this._holdTimer = 0;
    }
  },

  goGuests: function () {
    wx.navigateTo({ url: '/pages/guests/guests' });
  },

  goCoupons: function () {
    wx.navigateTo({ url: '/pages/coupons/coupons' });
  },

  openGuestForm: function () {
    this.setData({ sheet: 'guest-form', formName: '', formPhone: '' });
  },

  onFormName: function (e) {
    this.setData({ formName: e.detail.value });
  },

  onFormPhone: function (e) {
    this.setData({ formPhone: e.detail.value });
  },

  saveGuest: function () {
    var name = (this.data.formName || '').trim();
    var phone = (this.data.formPhone || '').trim();
    if (name.length < 2) {
      store.toast('请填写与证件一致的姓名');
      return;
    }
    if (!/^1\d{10}$/.test(phone)) {
      store.toast('请填写 11 位手机号');
      return;
    }
    var d = store.appData();
    d.guests.push({
      id: 'G' + Date.now().toString().slice(-6),
      name: name,
      phone: phone,
      default: false
    });
    store.save();
    this.setData({ sheet: '' });
    store.toast('同住人已保存');
    this.paint();
  },

  openEta: function () {
    var cur = store.appData().eta;
    this.setData({
      sheet: 'eta',
      etaList: dataMod.ETA_TIMES.map(function (t) {
        return { t: t, on: t === cur };
      })
    });
  },

  setEta: function (e) {
    var key = e.currentTarget.dataset.key;
    var d = store.appData();
    d.eta = key;
    store.save();
    this.setData({ sheet: '' });
    this.paint();
  },

  togglePref: function (e) {
    var key = e.currentTarget.dataset.key;
    var d = store.appData();
    var i = d.preferences.indexOf(key);
    if (i >= 0) d.preferences.splice(i, 1);
    else d.preferences.push(key);
    store.save();
    this.paint();
  },

  onRemark: function (e) {
    var d = store.appData();
    d.remark = e.detail.value;
    store.save();
  },

  openPrice: function () {
    var d = store.appData();
    var pair = store.findRoom(d.selectedRoomId);
    var room = pair.room;
    var s = d.search;
    var total = store.roomTotal(room);
    var off = store.couponOff(total);
    this.setData({
      sheet: 'price',
      priceSheet: {
        roomName: room.name,
        nights: s.nights,
        total: format.money(total),
        inLabel: s.inLabel,
        inWeek: s.inWeek,
        nightPrice: format.money(room.price),
        extraVisible: s.nights > 1,
        extraNights: s.nights - 1,
        extraPrice: format.money(room.price * (s.nights - 1)),
        off: format.money(off),
        pay: format.money(Math.max(0, total - off))
      }
    });
  },

  onPay: function () {
    var res = store.doPay();
    if (!res.ok) {
      store.toast('请先选择入住人');
      wx.navigateTo({ url: '/pages/guests/guests' });
      return;
    }
    store.toast('预订成功 · 席位已锁定');
    wx.redirectTo({ url: '/pages/result/result?id=' + res.order.id });
  },

  closeSheet: function () {
    this.setData({ sheet: '' });
  }
});
