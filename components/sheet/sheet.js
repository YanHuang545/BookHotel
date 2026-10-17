Component({
  options: { multipleSlots: true },
  properties: {
    open: { type: Boolean, value: false },
    mode: { type: String, value: 'sheet' }
  },
  methods: {
    onMask: function () {
      this.triggerEvent('close');
    },
    noop: function () {}
  }
});
