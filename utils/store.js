var dataMod = require('./data.js');
var format = require('./format.js');

var STORE_KEY = 'qichi-client-v1';

function hydrate() {
  var raw = dataMod.seedData();
  try {
    var saved = wx.getStorageSync(STORE_KEY);
    if (saved && typeof saved === 'object') {
      raw = Object.assign(raw, saved);
      if (!Array.isArray(raw.favorites)) raw.favorites = [];
      if (!Array.isArray(raw.bookings)) raw.bookings = [];
      if (!Array.isArray(raw.guests) || !raw.guests.length) raw.guests = dataMod.seedData().guests;
      if (!Array.isArray(raw.coupons)) raw.coupons = dataMod.seedData().coupons;
      if (!Array.isArray(raw.messages) || !raw.messages.length) raw.messages = dataMod.seedData().messages;
      if (!raw.notify || typeof raw.notify !== 'object') raw.notify = dataMod.seedData().notify;
      if (raw.lang !== 'en') raw.lang = 'zh';
      if (typeof raw.butlerDraft !== 'string') raw.butlerDraft = '';
    }
  } catch (e) {}
  raw.fromFlash = false;
  return raw;
}

function persist(state) {
  try {
    var copy = Object.assign({}, state, { fromFlash: false });
    wx.setStorageSync(STORE_KEY, copy);
  } catch (e) {}
}

function setFromFlash(on) {
  var app = getApp();
  app.globalData.ui.fromFlash = !!on;
  appData().fromFlash = !!on;
}

function consumeFromFlash() {
  var app = getApp();
  var on = !!(app.globalData.ui.fromFlash || appData().fromFlash);
  app.globalData.ui.fromFlash = false;
  appData().fromFlash = false;
  return on;
}

function appData() {
  var app = getApp();
  if (!app.globalData.data) app.globalData.data = hydrate();
  return app.globalData.data;
}

function save() {
  persist(appData());
}

function findResort(id) {
  var list = dataMod.RESORTS;
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return list[0];
}

function findRoom(rid) {
  var list = dataMod.RESORTS;
  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < list[i].rooms.length; j++) {
      if (list[i].rooms[j].id === rid) return { resort: list[i], room: list[i].rooms[j] };
    }
  }
  return { resort: list[0], room: list[0].rooms[0] };
}

function isFav(id) {
  return appData().favorites.indexOf(id) >= 0;
}

function toggleFav(id) {
  var fav = appData().favorites;
  var i = fav.indexOf(id);
  if (i >= 0) fav.splice(i, 1);
  else fav.push(id);
  save();
  return isFav(id);
}

function roomTotal(room) {
  return room.price * appData().search.nights;
}

function couponOff(total) {
  var d = appData();
  var c = null;
  for (var i = 0; i < d.coupons.length; i++) if (d.coupons[i].id === d.selectedCouponId) c = d.coupons[i];
  if (!c || !c.usable) return 0;
  if (c.rate) return Math.min(200, Math.round(total * c.rate));
  if (total >= (c.min || 0)) return c.amount || 0;
  return 0;
}

function payable() {
  var pair = findRoom(appData().selectedRoomId);
  var total = roomTotal(pair.room);
  return Math.max(0, total - couponOff(total));
}

function filteredResorts() {
  var d = appData();
  var f = d.filter;
  var s = d.search;
  var lockDest = !!(getApp().globalData.ui && getApp().globalData.ui.lockDest);
  return dataMod.RESORTS.filter(function (r) {
    if (s.dest !== 'all' && lockDest && r.dest !== s.dest) return false;
    if (f.brand && r.brand !== f.brand) return false;
    if (f.area && f.area !== 'all' && r.dest !== f.area) return false;
    if (f.price === 'lt1000' && r.price >= 1000) return false;
    if (f.price === 'gte1000' && r.price < 1000) return false;
    if (f.amenity === 'sitang' && r.tags.concat(r.extras).join('').indexOf('汤') < 0 && r.brand !== 'sitang') return false;
    if (f.amenity === 'breakfast' && r.tags.join('').indexOf('早') < 0 && r.tags.join('').indexOf('茶') < 0) return false;
    if (f.amenity === 'cancel' && r.soldOut) return false;
    if (f.tag === '江浙沪周边' && ['mogan'].indexOf(r.dest) < 0) return false;
    if (f.tag === '私汤温泉' && r.brand !== 'sitang' && r.id !== 'R001' && r.id !== 'R003') return false;
    if (f.tag === '临湖观景' && r.id !== 'R002') return false;
    if (f.tag === '亲子度假' && r.id === 'R004') return false;
    return true;
  }).sort(function (a, b) {
    if (f.sort === 'price') return a.price - b.price;
    if (f.sort === 'score') return b.score - a.score;
    return (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0);
  });
}

function searchView(s) {
  s = s || appData().search;
  return {
    destName: s.destName,
    inLabel: s.inLabel,
    outLabel: s.outLabel,
    inWeek: s.inWeek,
    outWeek: s.outWeek,
    nights: s.nights,
    nightsText: '共' + s.nights + '晚',
    nightsShort: s.nights + '晚',
    guestsLabel: '房客 ' + s.guests + '人',
    dateRange: format.dateRangeShort(s),
    dateHint: s.inWeek + '入住 · ' + s.outWeek + '退房'
  };
}

function applyDateKey(key, week, month, date) {
  var app = getApp();
  var pick = app.globalData.ui.datePick || {};
  var d = appData();
  if (!pick.inKey || (pick.inKey && pick.outKey)) {
    app.globalData.ui.datePick = { inKey: key, outKey: '', inWeek: week, inMonth: month, inDate: date };
    return { done: false };
  }
  if (key <= pick.inKey) {
    app.globalData.ui.datePick = { inKey: key, outKey: '', inWeek: week, inMonth: month, inDate: date };
    return { done: false };
  }
  pick.outKey = key;
  pick.outWeek = week;
  pick.outMonth = month;
  pick.outDate = date;
  var a = new Date(pick.inKey);
  var b = new Date(pick.outKey);
  var nights = Math.max(1, Math.round((b - a) / 86400000));
  d.search.inKey = pick.inKey;
  d.search.outKey = pick.outKey;
  d.search.inLabel = pick.inMonth + '月' + pick.inDate + '日';
  d.search.outLabel = pick.outMonth + '月' + pick.outDate + '日';
  d.search.inWeek = pick.inWeek;
  d.search.outWeek = pick.outWeek;
  d.search.nights = nights;
  app.globalData.ui.datePick = pick;
  save();
  return { done: true, nights: nights };
}

function buildDateDays() {
  var days = [];
  var start = new Date(2026, 9, 12);
  for (var i = 0; i < 21; i++) {
    var d = new Date(start.getTime() + i * 86400000);
    var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    days.push({ key: key, date: d.getDate(), week: dataMod.WEEK[d.getDay()], month: d.getMonth() + 1 });
  }
  return days;
}

function doPay() {
  var d = appData();
  var pair = findRoom(d.selectedRoomId);
  var guest = null;
  for (var i = 0; i < d.guests.length; i++) if (d.guests[i].id === d.selectedGuestIds[0]) guest = d.guests[i];
  if (!guest) return { ok: false, reason: 'guest' };
  var total = roomTotal(pair.room);
  var order = {
    id: 'Q' + Date.now().toString().slice(-8),
    resortId: pair.resort.id,
    resortName: pair.resort.name,
    roomId: pair.room.id,
    roomName: pair.room.name,
    cover: pair.resort.thumb,
    inLabel: d.search.inLabel,
    outLabel: d.search.outLabel,
    nights: d.search.nights,
    pay: payable(),
    total: total,
    status: 'hold',
    created: Date.now(),
    guestName: guest.name,
    eta: d.eta,
    prefs: d.preferences.slice()
  };
  d.bookings.unshift(order);
  save();
  return { ok: true, order: order };
}

function toast(msg) {
  wx.showToast({ title: msg, icon: 'none', duration: 2200 });
}

function navChrome() {
  var app = getApp();
  return {
    navBarHeight: app.globalData.navBarHeight,
    capsulePad: app.globalData.capsulePad,
    statusBarHeight: app.globalData.statusBarHeight
  };
}

function setTabBar(page, index) {
  if (typeof page.getTabBar === 'function' && page.getTabBar()) {
    page.getTabBar().setData({ selected: index });
  }
}

module.exports = {
  hydrate: hydrate,
  persist: persist,
  save: save,
  setFromFlash: setFromFlash,
  consumeFromFlash: consumeFromFlash,
  appData: appData,
  findResort: findResort,
  findRoom: findRoom,
  isFav: isFav,
  toggleFav: toggleFav,
  roomTotal: roomTotal,
  couponOff: couponOff,
  payable: payable,
  filteredResorts: filteredResorts,
  searchView: searchView,
  applyDateKey: applyDateKey,
  buildDateDays: buildDateDays,
  doPay: doPay,
  toast: toast,
  navChrome: navChrome,
  setTabBar: setTabBar
};
