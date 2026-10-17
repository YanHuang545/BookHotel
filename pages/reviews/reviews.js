var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    score: '',
    reviews: 0,
    quote: '',
    list: []
  },

  onLoad: function (query) {
    this.setData(store.navChrome());
    var d = store.appData();
    var id = (query && query.id) || d.selectedResortId;
    var r = store.findResort(id);
    this.setData({
      score: r.score,
      reviews: r.reviews,
      quote: r.quote,
      list: dataMod.REVIEWS[r.id] || []
    });
  }
});
