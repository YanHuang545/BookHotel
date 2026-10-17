var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');
var format = require('../../utils/format.js');

var FILTER_TITLES = {
  brand: '品牌系列',
  area: '位置区域',
  price: '价格星级',
  amenity: '配套筛选'
};

function filterOptions(key) {
  if (key === 'brand') {
    return [{ id: '', name: '不限品牌' }].concat(dataMod.BRANDS.map(function (b) {
      return { id: b.id, name: b.name };
    }));
  }
  if (key === 'area') {
    return [{ id: '', name: '不限区域' }].concat(dataMod.DESTINATIONS);
  }
  if (key === 'price') {
    return [
      { id: '', name: '不限价格' },
      { id: 'lt1000', name: '¥1000 以下' },
      { id: 'gte1000', name: '¥1000 及以上' }
    ];
  }
  return [
    { id: '', name: '不限配套' },
    { id: 'sitang', name: '私汤温泉' },
    { id: 'breakfast', name: '含早/茶点' },
    { id: 'cancel', name: '免费取消' }
  ];
}

function mapListItem(r) {
  return {
    id: r.id,
    name: r.name,
    loc: r.loc,
    cover: dataMod.ossUrl(r.listCover),
    listBadge: r.listBadge,
    type: r.type,
    extras: r.extras || [],
    soldOut: !!r.soldOut,
    fav: store.isFav(r.id),
    score: r.score,
    scoreWord: r.scoreWord,
    listReviews: r.listReviews,
    price: format.moneyPlain(r.price)
  };
}

function decorateDays() {
  var pick = getApp().globalData.ui.datePick || {};
  var search = store.appData().search;
  var inKey = pick.inKey;
  var outKey = pick.outKey;
  if (!inKey && !outKey) {
    inKey = search.inKey;
    outKey = search.outKey;
  }
  return store.buildDateDays().map(function (d) {
    return {
      key: d.key,
      date: d.date,
      week: d.week,
      month: d.month,
      on: d.key === inKey || d.key === outKey,
      mid: !!(inKey && outKey && d.key > inKey && d.key < outKey)
    };
  });
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    destName: '',
    dateRange: '',
    nightsShort: '',
    dateHint: '',
    dateHintSheet: '',
    pills: [],
    summary: '',
    sortLabel: '推荐排序',
    list: [],
    empty: false,
    sheet: '',
    dests: [],
    days: [],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    filterTitle: '筛选',
    filterOpts: []
  },

  onLoad: function () {
    this.setData(store.navChrome());
  },

  onShow: function () {
    store.setTabBar(this, 1);
    this.refresh();
  },

  refresh: function () {
    var d = store.appData();
    var f = d.filter;
    var list = store.filteredResorts().map(mapListItem);
    var sv = store.searchView();
    this.setData({
      destName: sv.destName,
      dateRange: sv.dateRange,
      nightsShort: sv.nightsShort,
      dateHint: sv.dateHint,
      dateHintSheet: '入住 ' + d.search.inLabel + ' · 离店 ' + d.search.outLabel,
      pills: [
        { key: 'brand', label: '品牌系列', on: !!f.brand, amenity: false },
        { key: 'area', label: '位置区域', on: !!f.area, amenity: false },
        { key: 'price', label: '价格星级', on: !!f.price, amenity: false },
        { key: 'amenity', label: '私汤/含早/免费取消', on: !!f.amenity, amenity: true }
      ],
      summary: '共 ' + list.length + ' 处院落 · ' + format.dateRangeDash(d.search) + ' 档期',
      sortLabel: f.sort === 'price' ? '低价优先' : f.sort === 'score' ? '评分优先' : '推荐排序',
      list: list,
      empty: !list.length
    });
  },

  onSheetClose: function () {
    this.setData({ sheet: '' });
  },

  openDest: function () {
    var dest = store.appData().search.dest;
    this.setData({
      sheet: 'dest',
      dests: dataMod.DESTINATIONS.map(function (x) {
        return { id: x.id, name: x.name, on: x.id === dest };
      })
    });
  },

  setDest: function (e) {
    var id = e.currentTarget.dataset.id;
    var dest = null;
    var list = dataMod.DESTINATIONS;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) dest = list[i];
    if (!dest) return;
    var d = store.appData();
    d.search.dest = dest.id;
    d.search.destName = dest.name;
    getApp().globalData.ui.lockDest = dest.id !== 'all';
    store.save();
    this.setData({ sheet: '' });
    this.refresh();
  },

  openDates: function () {
    var ui = getApp().globalData.ui;
    var s = store.appData().search;
    if (!ui.datePick || !ui.datePick.inKey) {
      ui.datePick = { inKey: s.inKey, outKey: s.outKey };
    }
    this.setData({
      sheet: 'dates',
      days: decorateDays(),
      dateHintSheet: '入住 ' + s.inLabel + ' · 离店 ' + s.outLabel
    });
  },

  pickDate: function (e) {
    var ds = e.currentTarget.dataset;
    var res = store.applyDateKey(ds.key, ds.week, ds.month, ds.date);
    if (res.done) {
      store.toast('已更新为 ' + res.nights + ' 晚');
      this.setData({ sheet: '' });
      this.refresh();
      return;
    }
    this.setData({ days: decorateDays() });
  },

  applySearch: function () {
    var d = store.appData();
    getApp().globalData.ui.lockDest = d.search.dest !== 'all';
    store.save();
    this.refresh();
    store.toast('已按 ' + d.search.destName + ' · ' + d.search.nights + '晚 刷新空房');
  },

  openFilter: function (e) {
    var key = e.currentTarget.dataset.key;
    getApp().globalData.ui.filterKey = key;
    var cur = store.appData().filter[key] || '';
    this.setData({
      sheet: 'filter',
      filterTitle: FILTER_TITLES[key] || '筛选',
      filterOpts: filterOptions(key).map(function (o) {
        return { id: o.id || 'none', name: o.name, on: o.id === cur };
      })
    });
  },

  setFilter: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id === 'none' || id == null) id = '';
    var key = getApp().globalData.ui.filterKey;
    if (!key) return;
    store.appData().filter[key] = id;
    store.save();
    this.setData({ sheet: '' });
    this.refresh();
  },

  clearFilter: function () {
    var d = store.appData();
    d.filter = { brand: '', area: '', price: '', amenity: '', sort: d.filter.sort, tag: '' };
    getApp().globalData.ui.lockDest = false;
    d.search.dest = 'all';
    d.search.destName = '全部目的地';
    store.save();
    this.refresh();
  },

  toggleSort: function () {
    var order = ['recommend', 'price', 'score'];
    var d = store.appData();
    var i = order.indexOf(d.filter.sort);
    d.filter.sort = order[(i + 1) % order.length];
    store.save();
    this.refresh();
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
  },

  goResort: function (e) {
    var id = e.currentTarget.dataset.id;
    store.setFromFlash(false);
    wx.navigateTo({ url: '/pages/resort/resort?id=' + id });
  },

  goButler: function () {
    wx.navigateTo({ url: '/pages/butler/butler' });
  }
});
