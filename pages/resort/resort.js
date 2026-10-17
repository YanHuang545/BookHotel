var store = require('../../utils/store.js');
var format = require('../../utils/format.js');
var dataMod = require('../../utils/data.js');

function dateDaysView() {
  var pick = getApp().globalData.ui.datePick || {};
  var inKey = pick.inKey || '';
  var outKey = pick.outKey || '';
  return store.buildDateDays().map(function (d) {
    var on = d.key === inKey || d.key === outKey;
    var mid = !!(inKey && outKey && d.key > inKey && d.key < outKey);
    return {
      key: d.key,
      date: d.date,
      week: d.week,
      month: d.month,
      on: on,
      mid: mid
    };
  });
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    showFlash: false,
    flash: { h: '00', m: '00', s: '00' },
    flashMuted: false,
    flashRemain: '',
    heroIndex: 0,
    gallery: [],
    favOn: false,
    resort: {},
    search: {},
    dateMeta: '',
    rooms: [],
    nights: 2,
    dockTotal: '¥0',
    soldOut: false,
    sheet: '',
    previewSrc: '',
    previewCap: '',
    amenityText: '',
    dateHint: '',
    dateDays: [],
    priceSheet: {}
  },

  onLoad: function (query) {
    this.setData(store.navChrome());
    this._query = query || {};
    this.bootResort(query || {});
  },

  onShow: function () {
    this.paint();
    this.startFlashTick();
  },

  onHide: function () {
    this.stopFlashTick();
  },

  onUnload: function () {
    this.stopFlashTick();
  },

  bootResort: function (query) {
    var d = store.appData();
    var id = query.id || d.selectedResortId;
    var r = store.findResort(id);
    d.selectedResortId = r.id;
    var hasRoom = r.rooms.filter(function (x) { return x.id === d.selectedRoomId; }).length;
    if (!hasRoom) d.selectedRoomId = r.rooms[0].id;
    var fromFlash = !!(query.flash || query.flash === '') || store.consumeFromFlash();
    if (query.flash || query.flash === '') fromFlash = true;
    if (d.selectedResortId !== id) getApp().globalData.ui.slide = 0;
    store.save();
    this._resortId = r.id;
    this._showFlash = fromFlash;
    this.setData({
      showFlash: fromFlash,
      heroIndex: 0
    });
    this.paint();
  },

  paint: function () {
    var d = store.appData();
    var r = store.findResort(this._resortId || d.selectedResortId);
    d.selectedResortId = r.id;
    var hasRoom = r.rooms.filter(function (x) { return x.id === d.selectedRoomId; }).length;
    if (!hasRoom) d.selectedRoomId = r.rooms[0].id;
    var room = store.findRoom(d.selectedRoomId).room;
    var s = d.search;
    var nights = s.nights;
    var gallery = r.gallery.map(function (g, i) {
      return {
        src: dataMod.ossUrl(g),
        cap: r.name + ' ' + (i + 1) + '/' + r.gallery.length
      };
    });
    var rooms = r.rooms.map(function (rm) {
      var spec = format.splitSpec(rm.spec);
      return {
        id: rm.id,
        name: rm.name,
        cover: dataMod.ossUrl(rm.cover),
        remainOne: rm.remain === 1,
        amenity: rm.amenity,
        photos: (rm.gallery && rm.gallery.length) ? rm.gallery.length : (rm.photos || 0),
        specMain: spec.main,
        specTail: spec.tail,
        tags: rm.tags || [],
        priceText: format.moneyPlain(rm.price),
        nightsTotal: format.money(store.roomTotal(rm)),
        selected: rm.id === d.selectedRoomId
      };
    });
    this.setData({
      showFlash: !!this._showFlash,
      flash: format.formatFlash(d.flashLeft),
      flashMuted: !!(r.soldOut || !r.remain),
      flashRemain: (r.soldOut || !r.remain) ? '档期已满' : ('仅剩' + r.remain + '间'),
      gallery: gallery,
      favOn: store.isFav(r.id),
      resort: {
        id: r.id,
        name: r.name,
        en: r.en,
        diamond: r.diamond,
        series: r.series,
        score: r.score,
        reviews: r.reviews,
        quote: r.quote,
        addr: r.addr,
        roomCount: r.rooms.length
      },
      search: store.searchView(s),
      dateMeta: '共' + s.nights + '晚 · ' + s.guests + '成人',
      rooms: rooms,
      nights: nights,
      dockTotal: format.money(store.roomTotal(room)),
      soldOut: !!r.soldOut
    });
  },

  startFlashTick: function () {
    this.stopFlashTick();
    var self = this;
    this._flashTimer = setInterval(function () {
      var d = store.appData();
      if (d.flashLeft > 0) d.flashLeft--;
      self.setData({ flash: format.formatFlash(d.flashLeft) });
    }, 1000);
  },

  stopFlashTick: function () {
    if (this._flashTimer) {
      clearInterval(this._flashTimer);
      this._flashTimer = 0;
    }
  },

  onHeroChange: function (e) {
    this.setData({ heroIndex: e.detail.current });
    getApp().globalData.ui.slide = e.detail.current;
  },

  onHeroDot: function (e) {
    var i = Number(e.currentTarget.dataset.i);
    this.setData({ heroIndex: i });
  },

  onPreview: function (e) {
    this.setData({
      sheet: 'preview',
      previewSrc: e.currentTarget.dataset.src,
      previewCap: e.currentTarget.dataset.cap || ''
    });
  },

  onFavorite: function () {
    var id = this.data.resort.id;
    var on = store.toggleFav(id);
    this.setData({ favOn: on });
    store.toast(on ? '已收入心愿清单' : '已取消收藏');
  },

  onShare: function () {
    store.toast('已复制隐世度假房型链接，可发给同行的人');
  },

  goGallery: function () {
    wx.navigateTo({ url: '/pages/gallery/gallery?id=' + this.data.resort.id });
  },

  goRoomGallery: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/gallery/gallery?id=' + this.data.resort.id + '&room=' + id });
  },

  goReviews: function () {
    wx.navigateTo({ url: '/pages/reviews/reviews?id=' + this.data.resort.id });
  },

  onMap: function () {
    store.toast('导航：' + this.data.resort.addr);
  },

  onRoomInfo: function (e) {
    this.setData({
      sheet: 'amenity',
      amenityText: '房型设施：' + (e.currentTarget.dataset.text || '')
    });
  },

  onSelectRoom: function (e) {
    var id = e.currentTarget.dataset.id;
    var d = store.appData();
    d.selectedRoomId = id;
    store.save();
    this.paint();
  },

  openDates: function () {
    var d = store.appData();
    getApp().globalData.ui.datePick = {
      inKey: d.search.inKey,
      outKey: d.search.outKey,
      inWeek: d.search.inWeek,
      outWeek: d.search.outWeek
    };
    this.setData({
      sheet: 'dates',
      dateHint: '入住 ' + d.search.inLabel + ' · 离店 ' + d.search.outLabel,
      dateDays: dateDaysView()
    });
  },

  onPickDate: function (e) {
    var ds = e.currentTarget.dataset;
    var res = store.applyDateKey(ds.key, ds.week, ds.month, ds.date);
    if (res.done) {
      this.setData({ sheet: '' });
      this.paint();
      store.toast('已更新为 ' + res.nights + ' 晚');
    } else {
      this.setData({ dateDays: dateDaysView() });
    }
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

  goButler: function () {
    wx.navigateTo({ url: '/pages/butler/butler' });
  },

  goCheckout: function () {
    var r = store.findResort(this.data.resort.id);
    if (r.soldOut) {
      store.toast('本周末档期已满，可订阅空房通知');
      return;
    }
    wx.navigateTo({ url: '/pages/checkout/checkout' });
  },

  closeSheet: function () {
    this.setData({ sheet: '' });
  }
});
