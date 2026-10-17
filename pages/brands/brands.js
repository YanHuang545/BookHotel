var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');

function viewBrands() {
  return dataMod.BRANDS.map(function (b) {
    return {
      id: b.id,
      name: b.name,
      tag: b.tag,
      long: b.long,
      coverUrl: dataMod.ossUrl(b.cover)
    };
  });
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    brands: []
  },
  onLoad: function () {
    this.setData(store.navChrome());
  },
  onShow: function () {
    this.setData({ brands: viewBrands() });
  },
  onOpenBrand: function (e) {
    var id = e.currentTarget.dataset.id;
    var d = store.appData();
    d.filter.brand = id;
    d.filter.tag = '';
    store.save();
    wx.switchTab({ url: '/pages/resorts/resorts' });
  }
});
