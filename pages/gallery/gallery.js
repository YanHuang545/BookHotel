var store = require('../../utils/store.js');
var dataMod = require('../../utils/data.js');

Page({
  data: {
    navBarHeight: 64,
    capsulePad: 96,
    title: '',
    count: 0,
    shots: [],
    sheet: '',
    previewSrc: '',
    previewCap: ''
  },

  onLoad: function (query) {
    this.setData(store.navChrome());
    var d = store.appData();
    var id = (query && query.id) || d.selectedResortId;
    var roomId = query && query.room;
    var r = store.findResort(id);
    var rm = null;
    if (roomId && r.rooms) {
      for (var i = 0; i < r.rooms.length; i++) {
        if (r.rooms[i].id === roomId) rm = r.rooms[i];
      }
    }
    var raw = (rm && rm.gallery && rm.gallery.length) ? rm.gallery : r.gallery;
    var title = rm ? rm.name : r.name;
    var shots = raw.map(function (g, i) {
      return {
        src: dataMod.ossUrl(g),
        cap: title + ' ' + (i + 1) + ' / ' + raw.length,
        wide: i === 0
      };
    });
    this.setData({
      title: title,
      count: shots.length,
      shots: shots
    });
  },

  onPreview: function (e) {
    this.setData({
      sheet: 'preview',
      previewSrc: e.currentTarget.dataset.src,
      previewCap: e.currentTarget.dataset.cap || ''
    });
  },

  closeSheet: function () {
    this.setData({ sheet: '' });
  }
});
