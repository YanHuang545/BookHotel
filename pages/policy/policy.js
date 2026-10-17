var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');

function viewDoc(id) {
  var src = dataMod.POLICY_DOCS[id] || dataMod.POLICY_DOCS.booking;
  return {
    kicker: src.kicker,
    title: src.title,
    lead: src.lead,
    blocks: src.blocks.map(function (b, i) {
      return {
        n: ('0' + (i + 1)).slice(-2),
        title: b[0],
        body: b[1]
      };
    })
  };
}

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    doc: { kicker: '', title: '', lead: '', blocks: [] }
  },
  onLoad: function (opts) {
    this.setData(store.navChrome());
    this.setData({ doc: viewDoc(opts && opts.id) });
  },
  onBack: function () {
    var pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack({ delta: 1 });
    else wx.navigateTo({ url: '/pages/settings/settings' });
  },
  onButler: function () {
    wx.navigateTo({ url: '/pages/butler/butler' });
  }
});
