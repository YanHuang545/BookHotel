var store = require('../../utils/store.js');
var format = require('../../utils/format.js');

function viewCoupons() {
  var d = store.appData();
  var usableCount = 0;
  var list = (d.coupons || []).map(function (c) {
    if (c.usable) usableCount++;
    return {
      id: c.id,
      title: c.title,
      note: c.note,
      expire: c.expire,
      usable: !!c.usable,
      on: d.selectedCouponId === c.id,
      amountText: c.amount ? format.money(c.amount) : '12%'
    };
  });
  return { list: list, usableCount: usableCount };
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    coupons: [],
    usableCount: 0
  },
  onLoad: function () {
    this.setData(store.navChrome());
  },
  onShow: function () {
    this.refresh();
  },
  refresh: function () {
    var v = viewCoupons();
    this.setData({ coupons: v.list, usableCount: v.usableCount });
  },
  onApply: function (e) {
    var id = e.currentTarget.dataset.id;
    var d = store.appData();
    var c = null;
    for (var i = 0; i < d.coupons.length; i++) {
      if (d.coupons[i].id === id) c = d.coupons[i];
    }
    if (!c || !c.usable) {
      store.toast('该券不可用');
      return;
    }
    d.selectedCouponId = id;
    store.save();
    this.refresh();
    store.toast('已选用 ' + c.title);
  }
});
