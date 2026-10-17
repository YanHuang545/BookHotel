var store = require('../../utils/store.js');
var format = require('../../utils/format.js');

function viewGuests() {
  var d = store.appData();
  return (d.guests || []).map(function (g) {
    return {
      id: g.id,
      name: g.name,
      phoneMasked: format.maskPhone(g.phone),
      default: !!g.default,
      on: d.selectedGuestIds.indexOf(g.id) >= 0
    };
  });
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    guests: [],
    empty: false,
    formOpen: false,
    formName: '',
    formPhone: ''
  },
  onLoad: function () {
    this.setData(store.navChrome());
  },
  onShow: function () {
    this.refresh();
  },
  refresh: function () {
    var list = viewGuests();
    this.setData({ guests: list, empty: !list.length });
  },
  onOpenForm: function () {
    this.setData({ formOpen: true, formName: '', formPhone: '' });
  },
  onCloseForm: function () {
    this.setData({ formOpen: false });
  },
  onName: function (e) {
    this.setData({ formName: e.detail.value });
  },
  onPhone: function (e) {
    this.setData({ formPhone: e.detail.value });
  },
  onSave: function () {
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
    this.setData({ formOpen: false, formName: '', formPhone: '' });
    store.toast('同住人已保存');
    this.refresh();
  },
  onPick: function (e) {
    var id = e.currentTarget.dataset.id;
    store.appData().selectedGuestIds = [id];
    store.save();
    this.refresh();
    store.toast('已设为本次主住客');
  },
  onDefault: function (e) {
    var id = e.currentTarget.dataset.id;
    var d = store.appData();
    d.guests.forEach(function (g) { g.default = g.id === id; });
    d.selectedGuestIds = [id];
    store.save();
    this.refresh();
  }
});
