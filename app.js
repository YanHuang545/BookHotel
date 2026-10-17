var store = require('./utils/store.js');

App({
  globalData: {
    statusBarHeight: 20,
    navBarHeight: 64,
    capsulePad: 96,
    data: null,
    ui: {
      orderTab: 'all',
      slide: 0,
      fromFlash: false,
      lockDest: false,
      datePick: null,
      filterKey: ''
    }
  },

  onLaunch: function () {
    this.computeNav();
    this.globalData.data = store.hydrate();
  },

  computeNav: function () {
    var sys = wx.getSystemInfoSync();
    var menu = wx.getMenuButtonBoundingClientRect();
    var statusBarHeight = sys.statusBarHeight || 20;
    var gap = Math.max(4, menu.top - statusBarHeight);
    this.globalData.statusBarHeight = statusBarHeight;
    this.globalData.navBarHeight = menu.bottom + gap;
    this.globalData.capsulePad = sys.windowWidth - menu.left + 8;
  },

  getStore: function () {
    if (!this.globalData.data) this.globalData.data = store.hydrate();
    return this.globalData.data;
  },

  persist: function () {
    store.persist(this.globalData.data);
  }
});
