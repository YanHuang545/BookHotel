var OSS_BASE = 'https://mashangfei1112.oss-accelerate.aliyuncs.com/qichi-demo/photos/';

function ossUrl(name) {
  return OSS_BASE + name + '.jpg';
}

var WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

var DESTINATIONS = [
  { id: 'mogan', name: '莫干山' },
  { id: 'dali', name: '大理双廊' },
  { id: 'huangshan', name: '黄山汤口' },
  { id: 'qingcheng', name: '青城山' },
  { id: 'all', name: '全部目的地' }
];

var BRANDS = [
  { id: 'shanye', name: '栖岚 · 山野', tag: '野奢静修', desc: '隐入松竹万亩间', long: '以松竹与晨雾为幕，把山居节奏放慢到一杯手冲的时间。适于静修、写作与短途隐逸。', cover: 'brand-shanye', tone: 'primary' },
  { id: 'sitang', name: '栖岚奢 · 私汤', tag: '私汤旗舰', desc: '岩石暖泉独院私享', long: '天然温汤引入独院，夜灯与松影同浴。旗舰礼遇含管家预热与延迟退房。', cover: 'brand-sitang', tone: 'secondary' },
  { id: 'yuanluo', name: '栖岚漫 · 院落', tag: '人文雅集', desc: '青瓦回廊茶香满庭', long: '青瓦、回廊与茶席相连，把古镇的慢步行进院落日常。适合雅集与小团围炉。', cover: 'brand-yuanluo', tone: 'surface' },
  { id: 'meixue', name: '栖岚境 · 美学', tag: '先锋先锋', desc: '光影与现代几何叙事', long: '混凝土、螺旋楼梯与落地玻璃，用当代几何重新讲述山海光线。', cover: 'brand-meixue', tone: 'fixed' }
];

var RESORTS = [
  {
    id: 'R001', name: '栖岚 · 莫干山竹露', en: 'QILAN Moganshan Forest & Hot Spring Retreat', dest: 'mogan', destLabel: '莫干山', brand: 'shanye',
    cover: 'home-mogan', listCover: 'list-mogan', thumb: 'checkout-mogan',
    gallery: ['hero-mogan-1', 'hero-mogan-2', 'hero-mogan-3', 'hero-mogan-4', 'hero-mogan-5'],
    price: 880, score: 4.9, reviews: 128, badge: '米其林指南入围', listBadge: '栖岚旗舰', type: '独栋竹院',
    loc: '德清莫干山筏头乡 · 距庾村文化市集15分钟车程', addr: '浙江省德清县莫干山筏头乡瓦屋村12号',
    tags: ['含山野茶点', '私享竹林景', '管家一对一', '免费停车'], promo: '连住立减100',
    soldOut: false, remain: 2, amenity: '山野茶宴', scoreWord: '超赞满意', listReviews: 89,
    quote: '“隐世避暑绝佳”、“私汤竹林治愈”', diamond: '5钻奢华度假', series: '花筑奢 · 臻选黑标系列',
    extras: ['含山野茶点', '私享竹林景', '管家一对一'],
    rooms: [
      { id: 'RM01', name: '竹露大床房', spec: '1张1.8米大床 · 32㎡ · 可住2人 · 2-3层 · 私享竹林景', price: 880, cover: 'room-zhulu', rec: true, photos: 5, gallery: ['room-zhulu', 'room-zhulu-2', 'room-zhulu-3', 'room-zhulu-4', 'room-zhulu-5'], amenity: '私汤泡池、全景落地窗、Marshall音响、Appelles备品', tags: ['含双早', '限时可退', '私汤泡池'], cancel: true },
      { id: 'RM02', name: '听雨双床房', spec: '2张1.35米床 · 38㎡ · 可住2人 · 独立景观露台', price: 980, cover: 'room-tingyu', rec: false, photos: 4, gallery: ['room-tingyu', 'room-tingyu-2', 'room-tingyu-3', 'room-tingyu-4'], amenity: '带景观阳台、全屋地暖、卫洗丽智能马桶', tags: ['含双早', '不可取消', '全屋地暖'], cancel: false },
      { id: 'RM03', name: '栖山套房 · 私汤地暖', spec: '1张2.0米床 · 58㎡ · 可住2-3人 · 独院露天私汤', price: 1480, cover: 'room-qishan', rec: false, photos: 8, gallery: ['room-qishan', 'room-qishan-2', 'room-qishan-3', 'room-qishan-4', 'room-qishan-5', 'room-qishan-6', 'room-qishan-7', 'room-qishan-8'], amenity: '独门独院、天然硫磺私汤、戴森吹风机全套、免费迎宾水果与依云水', tags: ['含双早', '限时可退', '独门独院'], cancel: true, remain: 1 }
    ]
  },
  {
    id: 'R002', name: '栖岚 · 大理双廊', en: 'QILAN Dali Shuanglang Waterfront Retreat', dest: 'dali', destLabel: '大理双廊', brand: 'sitang',
    cover: 'home-dali', listCover: 'list-dali', thumb: 'package-dali',
    gallery: ['package-dali', 'list-dali', 'home-dali', 'hero-mogan-5', 'brand-sitang'],
    price: 1280, score: 4.9, reviews: 126, badge: '黑珍珠甄选推荐', listBadge: '仅剩1间', type: '海景套房',
    loc: '大理双廊古镇环海东路 · 近南诏风情岛', addr: '云南省大理市双廊镇环海东路栖岚院',
    tags: ['洱海一线', '临水露台', '落日观测点', '近艺术馆'], promo: '尊享游艇接驳',
    soldOut: false, remain: 1, amenity: '海景套房', scoreWord: '极佳美景', listReviews: 126,
    quote: '“落日把洱海铺成金箔”、“庭院下午茶值得专程”', diamond: '5钻临水度假', series: '栖岚奢 · 海景臻选',
    extras: ['洱海一线', '临水露台', '落日特饮'],
    rooms: [
      { id: 'RD01', name: '临水大床房', spec: '1张1.8米大床 · 40㎡ · 可住2人 · 一线洱海景', price: 1280, cover: 'room-linshui-1', rec: true, photos: 6, gallery: ['room-linshui-1', 'room-linshui-2', 'room-linshui-3', 'room-linshui-4', 'room-linshui-5', 'room-linshui-6'], amenity: '临水露台、落日观景位、白族庭院下午茶', tags: ['含双早', '18:00前可退', '含下午茶'], cancel: true },
      { id: 'RD02', name: '环海套房', spec: '1张2.0米床 · 62㎡ · 可住2-3人 · 独立观海阳台', price: 1660, cover: 'room-huanhai-1', rec: false, photos: 7, gallery: ['room-huanhai-1', 'room-huanhai-2', 'room-huanhai-3', 'room-huanhai-4', 'room-huanhai-5', 'room-huanhai-6', 'room-huanhai-7'], amenity: '游艇接驳、私人阳台、环海骑行体验', tags: ['度假礼包', '含下午茶', '游艇接驳'], cancel: true, remain: 1 }
    ]
  },
  {
    id: 'R003', name: '栖岚 · 黄山汤口', en: 'QILAN Huangshan Tangkou Onsen Lodge', dest: 'huangshan', destLabel: '黄山汤口', brand: 'sitang',
    cover: 'home-huangshan', listCover: 'list-huangshan', thumb: 'list-huangshan',
    gallery: ['home-huangshan', 'list-huangshan', 'hero-mogan-2', 'brand-sitang', 'hero-mogan-5'],
    price: 960, score: 4.8, reviews: 64, badge: '天然真温泉认证', listBadge: '私汤名宿', type: '私汤泡池',
    loc: '黄山汤口镇翡翠谷景区旁 · 缆车专线接送', addr: '安徽省黄山市汤口镇温泉风景区栖岚馆',
    tags: ['天然温泉', '云海视野', '私厨徽菜', '迎客松线'], promo: '赠双人登山礼包',
    soldOut: false, remain: 4, amenity: '私汤名宿', scoreWord: '温泉胜境', listReviews: 64,
    quote: '“晨起便是云海”、“汤泉洗去登高一日尘”', diamond: '4钻温泉度假', series: '栖岚奢 · 汤泉山居',
    extras: ['天然汤泉', '云海视野', '迎客松线'],
    rooms: [
      { id: 'RH01', name: '云海私汤房', spec: '1张1.8米大床 · 36㎡ · 可住2人 · 半露天天然汤池', price: 960, cover: 'room-yunhai-1', rec: true, photos: 5, gallery: ['room-yunhai-1', 'room-yunhai-2', 'room-yunhai-3', 'room-yunhai-4', 'room-yunhai-5'], amenity: '天然温泉、地暖、登山礼包', tags: ['含双早', '限时可退', '登山礼包'], cancel: true },
      { id: 'RH02', name: '迎客松套房', spec: '1张2.0米床 · 52㎡ · 可住2人 · 山景露天汤池', price: 1380, cover: 'room-yingke-1', rec: false, photos: 6, gallery: ['room-yingke-1', 'room-yingke-2', 'room-yingke-3', 'room-yingke-4', 'room-yingke-5', 'room-yingke-6'], amenity: '私厨徽菜、缆车接驳、露天汤', tags: ['含登山礼包', '限时可退', '私厨徽菜'], cancel: true }
    ]
  },
  {
    id: 'R004', name: '栖岚 · 青城山前', en: 'QILAN Qingcheng Daoist Courtyard', dest: 'qingcheng', destLabel: '青城山', brand: 'yuanluo',
    cover: 'home-qingcheng', listCover: 'list-qingcheng', thumb: 'list-qingcheng',
    gallery: ['home-qingcheng', 'list-qingcheng', 'brand-yuanluo', 'brand-shanye', 'hero-mogan-4'],
    price: 1050, score: 4.9, reviews: 51, badge: '清幽隐林', listBadge: '满房待候补', type: '山林别院',
    loc: '都江堰青城山镇宿仙社区 · 清幽隐林', addr: '四川省都江堰市青城山镇青城前山道源路',
    tags: ['道家素食', '山林别院', '静修禅院'], promo: '可预约下周末空房',
    soldOut: true, remain: 0, amenity: '山林别院', scoreWord: '清幽', listReviews: 51,
    quote: '“一夜只听见雨落竹叶”、“素斋清淡却难忘”', diamond: '4钻人文院落', series: '栖岚漫 · 山门别院',
    extras: ['道家素食', '山林别院'],
    rooms: [
      { id: 'RQ01', name: '道源院大床房', spec: '1张1.8米大床 · 34㎡ · 可住2人 · 庭院竹影静音', price: 1050, cover: 'room-daoyuan-1', rec: true, photos: 4, gallery: ['room-daoyuan-1', 'room-daoyuan-2', 'room-daoyuan-3', 'room-daoyuan-4'], amenity: '素斋、地暖、静音庭院', tags: ['含素早', '限时可退', '静音庭院'], cancel: true }
    ]
  }
];

var REVIEWS = {
  R001: [
    { name: '何清和', date: '2026.09.12', score: 5.0, text: '隐世避暑绝佳，晨雾从竹林漫到窗台，管家把私汤提前温好，像被山接住。' },
    { name: '苏晚白', date: '2026.08.30', score: 4.9, text: '私汤竹林治愈，Marshall 放一张慢爵士刚刚好。早餐的手作晨食值得早起。' },
    { name: '林予安', date: '2026.08.02', score: 4.8, text: '连住两晚被升到向林静音房，夜里只听见雨打竹叶。' }
  ],
  R002: [
    { name: '赵汀兰', date: '2026.09.20', score: 5.0, text: '落日把洱海铺成金箔，庭院下午茶的乳扇和鲜花饼都新鲜。' },
    { name: '马行舟', date: '2026.07.18', score: 4.8, text: '一线海景名不虚传，游艇接驳省去古镇拥堵，适合想避世的两人。' }
  ],
  R003: [
    { name: '陈见山', date: '2026.10.01', score: 4.9, text: '晨起便是云海，汤泉洗去登高一日尘。徽菜私厨的臭鳜鱼克制且鲜。' },
    { name: '吴青桐', date: '2026.06.22', score: 4.7, text: '缆车接驳准时，房间有松香。若遇雨，泡池上的雾更美。' }
  ],
  R004: [
    { name: '叶栖迟', date: '2026.05.16', score: 5.0, text: '一夜只听见雨落竹叶。素斋清淡却难忘，适合把手机交给山门。' }
  ]
};

var BUTLER_TOPICS = [
  { key: 'shuttle', label: '接驳安排', q: '周五抵达莫干山，需要高铁站接驳。', a: '接驳已记下。管家会在抵达前 24 小时再次确认车次与下山路口，请把车次号发我。' },
  { key: 'onsen', label: '私汤预热', q: '到店希望私汤已预热。', a: '私汤可提前 40 分钟预热，开放至每日 23:00。已按你的预计到店时间标记。' },
  { key: 'change', label: '改期咨询', q: '想了解改期与取消规则。', a: '入住日 18:00 前申请改期或取消，房费全额原路退回；逾期将扣除首晚。我可以帮你提交。' },
  { key: 'diet', label: '膳食忌口', q: '随行有人海鲜过敏，晨茗和晚餐需要忌口。', a: '已记下海鲜过敏。晨茗改为桂花玄米，晚餐会避开海鲜并单独出菜。' }
];

var POLICY_DOCS = {
  booking: {
    title: '预订须知',
    kicker: 'STAY GUIDE',
    lead: '把山岚写进日历之前，先把抵达、入住与院落节奏说清楚。',
    blocks: [
      ['确认与管家', '下单后席位保留 14 分 59 秒。支付成功即锁定房态，专属山林管家会在抵达前 24 小时再次确认接驳、车次与茶礼喜好。'],
      ['入住与离店', '常规入住 15:00 起，离店 12:00 前。栖岚会旅人可延迟退房至 14:00，并获赠双人手冲晨茗。'],
      ['山居节奏', '院落倡导生态隐逸。私汤泡池开放至每日 23:00；夜间请保持回廊轻步，把松风留给邻院。'],
      ['随行与停车', '每院限登记入住人与同住人。免费停车位按院落预留，驶入前请把车牌发给管家。']
    ]
  },
  cancel: {
    title: '取消与改期',
    kicker: 'FLEX POLICY',
    lead: '山居可以改主意，只要赶在院落为你预热之前。',
    blocks: [
      ['免费窗口', '入住日 18:00 前申请取消或改期，房费全额原路退回，优惠券退回券包。'],
      ['逾期规则', '超过免费窗口后的退改，将扣除首晚房费；其余晚数按未住原路退回。'],
      ['不可抗力', '因封山、道路中断或极端天气无法抵达，管家核实后可免费改期一次，有效期 12 个月。'],
      ['如何提交', '在行程册点「取消」，或在咨询管家页留下改期日期，阿岚会在值班时段回复。']
    ]
  },
  privacy: {
    title: '隐私与数据',
    kicker: 'PRIVACY',
    lead: '演示版数据只写在这台设备的本地存储里，不会上传账号体系。',
    blocks: [
      ['本地存储', '行程、入住人、优惠券与管家会话保存在本机 storage（qichi-client-v1），刷新后仍在。'],
      ['收集范围', '仅使用你在页面填写的姓名、手机号、到店时间和忌口备注，用于生成订单与管家回复。'],
      ['不会做什么', '本演示不发送短信、不发起真实支付、不对接微信登录，也不会把内容传到栖岚服务器。'],
      ['你可清除', '设置页可清空本地筛选与管家会话。清除小程序数据会同时去掉行程册。']
    ]
  },
  member: {
    title: '会员礼遇',
    kicker: 'QILAN CLUB',
    lead: '黑金礼遇与见山等级，把山居里多出来的那一点余闲还给你。',
    blocks: [
      ['见山 LV.2', '入住即赠双人手冲晨茗，延迟退房至 14:00，连住可叠加度假专享券。'],
      ['管家一对一', '每笔待入住行程绑定专属管家阿岚，微信号 QILAN_MOGAN_VIP，值班 08:00–22:00。'],
      ['山野茶点', '旗舰院落含山野茶点与私享竹林景；私汤旗舰含到店预热。'],
      ['升级说明', '演示账号固定为林晚宁 · 见山 LV.2，不设真实积分与付费会员。']
    ]
  }
};

var PREFS = ['无烟清居', '高楼层向林静音', '到店私汤预热', '加配羽绒枕', '连通房需求'];

var ETA_TIMES = ['14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00', '22:00 以后（需预约）'];

var PACKS = [
  { cover: 'flash-zhulu', title: '竹露大床房 · 伴山私汤', sub: '栖岚·莫干山 · 含次日双人手作晨食', price: 880, resortId: 'R001', roomId: 'RM01', hot: true, remain: 2 },
  { cover: 'package-dali', title: '双廊海景一夜 · 避世礼包', sub: '含双人有机早餐 + 白族庭院下午茶 + 环海骑行', price: 1660, resortId: 'R002', roomId: 'RD02' },
  { cover: 'list-huangshan', title: '云海私汤房 · 汤口温泉夜', sub: '栖岚·黄山汤口 · 含双早 · 赠登山礼包', price: 960, resortId: 'R003', roomId: 'RH01' }
];

var PERKS = [
  ['percent', '专享88折起', '见山等级入住即享房费折扣'],
  ['schedule', '14:00 延迟退房', '把上午的山雾多留两小时'],
  ['gifts', '赠山野伴手礼', '离店带走当季手作茶点'],
  ['room_service', '一对一管家', '接驳、私汤预热、忌口交给阿岚'],
  ['bakery', '双人手冲晨茗', '入住即赠，不必另付'],
  ['event', '18:00 前可退', '入住当日傍晚前免费取消']
];

function seedData() {
  return {
    search: { dest: 'mogan', destName: '莫干山', inKey: '2026-10-18', outKey: '2026-10-20', inLabel: '10月18日', outLabel: '10月20日', inWeek: '周五', outWeek: '周日', nights: 2, guests: 2 },
    favorites: [],
    bookings: [],
    guests: [
      { id: 'G001', name: '林晚宁', phone: '13800001111', default: true },
      { id: 'G002', name: '周予白', phone: '13900002222', default: false }
    ],
    selectedGuestIds: ['G001'],
    coupons: [
      { id: 'C001', title: '满1500减100专享券', amount: 100, min: 1500, expire: '2026-12-31', usable: true, note: '度假季满减' },
      { id: 'C002', title: '山野新客88折券', amount: 0, rate: 0.12, expire: '2026-11-30', usable: true, note: '房费 12% 折让，上限 200' },
      { id: 'C003', title: '私汤体验抵扣券', amount: 80, min: 800, expire: '2026-10-10', usable: false, note: '已过期' }
    ],
    selectedCouponId: 'C001',
    preferences: ['无烟清居', '高楼层向林静音', '到店私汤预热'],
    eta: '18:00 - 20:00',
    remark: '',
    subscribe: [],
    filter: { brand: '', area: '', price: '', amenity: '', sort: 'recommend', tag: '' },
    user: { name: '林晚宁', phone: '13800001111', level: 'LV.2 见山', member: '黑金礼遇' },
    messages: [
      { id: 'M001', role: 'butler', name: '阿岚', text: '林晚宁，我是你的专属山林管家阿岚。接驳、私汤预热、改期和忌口都可以直接发给我。也可以加微信号 QILAN_MOGAN_VIP。', at: 0 }
    ],
    butlerDraft: '',
    notify: { order: true, empty: true, offer: false, quiet: true },
    lang: 'zh',
    selectedRoomId: 'RM01',
    selectedResortId: 'R001',
    holdLeft: 14 * 60 + 59,
    flashLeft: 2 * 3600 + 14 * 60 + 8,
    fromFlash: false
  };
}

module.exports = {
  ossUrl: ossUrl,
  WEEK: WEEK,
  DESTINATIONS: DESTINATIONS,
  BRANDS: BRANDS,
  RESORTS: RESORTS,
  REVIEWS: REVIEWS,
  BUTLER_TOPICS: BUTLER_TOPICS,
  POLICY_DOCS: POLICY_DOCS,
  PREFS: PREFS,
  ETA_TIMES: ETA_TIMES,
  PACKS: PACKS,
  PERKS: PERKS,
  seedData: seedData
};
