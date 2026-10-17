var icons = require('../utils/icons.js');

Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/home/home', text: '首页', icon: 'cottage' },
      { pagePath: '/pages/resorts/resorts', text: '住店', icon: 'apartment' },
      { pagePath: '/pages/orders/orders', text: '订单', icon: 'calendar' },
      { pagePath: '/pages/me/me', text: '我的', icon: 'spa' }
    ],
    uris: {
      cottage: icons.icon('cottage'),
      apartment: icons.icon('apartment'),
      calendar: icons.icon('calendar'),
      spa: icons.icon('spa')
    }
  },
  methods: {
    onTap: function (e) {
      var index = e.currentTarget.dataset.index;
      var item = this.data.list[index];
      wx.switchTab({ url: item.pagePath });
    }
  }
});
