Component({
  options: { virtualHost: true },
  properties: {
    title: { type: String, value: '' },
    pageLabel: { type: String, value: '' },
    showBack: { type: Boolean, value: false },
    showBrand: { type: Boolean, value: false }
  },
  data: {
    navBarHeight: 64,
    statusBarHeight: 20,
    capsulePad: 96
  },
  lifetimes: {
    attached: function () {
      var app = getApp();
      this.setData({
        navBarHeight: app.globalData.navBarHeight,
        statusBarHeight: app.globalData.statusBarHeight,
        capsulePad: app.globalData.capsulePad
      });
    }
  },
  methods: {
    onBack: function () {
      var pages = getCurrentPages();
      if (pages.length > 1) wx.navigateBack({ delta: 1 });
      else wx.switchTab({ url: '/pages/home/home' });
    }
  }
});
