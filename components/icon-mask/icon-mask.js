var icons = require('../../utils/icons.js');

Component({
  options: { virtualHost: true },
  properties: {
    name: { type: String, value: 'star' },
    size: { type: Number, value: 20 },
    color: { type: String, value: 'currentColor' }
  },
  data: { src: '' },
  observers: {
    name: function (name) {
      this.setData({ src: icons.icon(name) });
    }
  },
  lifetimes: {
    attached: function () {
      this.setData({ src: icons.icon(this.data.name) });
    }
  }
});
