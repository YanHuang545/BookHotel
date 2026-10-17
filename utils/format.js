function money(n) {
  return '¥' + Number(n).toLocaleString('zh-CN');
}

function moneyPlain(n) {
  return Number(n).toLocaleString('zh-CN');
}

function maskPhone(p) {
  return String(p).replace(/^(\d{3})\d{4}(\d{4})$/, '$1 **** $2');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatHold(sec) {
  var t = Math.max(0, sec || 0);
  return pad2(Math.floor(t / 60)) + ':' + pad2(t % 60);
}

function formatFlash(sec) {
  var t = Math.max(0, sec || 0);
  return {
    h: pad2(Math.floor(t / 3600)),
    m: pad2(Math.floor((t % 3600) / 60)),
    s: pad2(t % 60)
  };
}

function formatMsgTime(at) {
  if (!at) return '今日 09:12';
  var d = new Date(at);
  return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
}

function dateRangeShort(search) {
  return search.inLabel.replace('月', '.').replace('日', '') + ' - ' + search.outLabel.replace('月', '.').replace('日', '');
}

function dateRangeDash(search) {
  return search.inLabel.replace('月', '.').replace('日', '') + '–' + search.outLabel.replace('月', '.').replace('日', '');
}

function splitSpec(spec) {
  var raw = spec || '';
  var cut = raw.lastIndexOf(' · ');
  if (cut < 0) return { main: raw, tail: '' };
  return { main: raw.slice(0, cut), tail: raw.slice(cut + 3) };
}

module.exports = {
  money: money,
  moneyPlain: moneyPlain,
  maskPhone: maskPhone,
  pad2: pad2,
  formatHold: formatHold,
  formatFlash: formatFlash,
  formatMsgTime: formatMsgTime,
  dateRangeShort: dateRangeShort,
  dateRangeDash: dateRangeDash,
  splitSpec: splitSpec
};
