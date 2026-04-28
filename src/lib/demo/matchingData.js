export const MATCH_TIME_OPTIONS = [
  "今天午饭",
  "今天晚饭",
  "今晚夜宵",
  "明天中午",
];

export const MATCH_BUDGET_OPTIONS = [
  "20-30",
  "30-50",
  "50-80",
  "80+",
];

export const MATCH_PARTY_SIZE_OPTIONS = [2, 3, 4];

export const MATCH_PREFERENCE_OPTIONS = [
  "都可以",
  "想聊天",
  "安静吃饭",
  "AA 优先",
  "冲辣搭子",
];

const PARTICIPANTS = {
  aqing: { id: "p-aqing", name: "阿青", school: "湖南大学", avatarUrl: "", avatarTone: "bg-emerald-100 text-emerald-700" },
  xiaoman: { id: "p-xiaoman", name: "小满", school: "中南大学", avatarUrl: "", avatarTone: "bg-amber-100 text-amber-700" },
  mumu: { id: "p-mumu", name: "木木", school: "湖南师范大学", avatarUrl: "", avatarTone: "bg-sky-100 text-sky-700" },
  nana: { id: "p-nana", name: "娜娜", school: "湖南大学", avatarUrl: "", avatarTone: "bg-rose-100 text-rose-700" },
  hao: { id: "p-hao", name: "浩哥", school: "中南大学", avatarUrl: "", avatarTone: "bg-violet-100 text-violet-700" },
  qiqi: { id: "p-qiqi", name: "七七", school: "湖南师范大学", avatarUrl: "", avatarTone: "bg-orange-100 text-orange-700" },
};

export const MATCH_STATUS_META = {
  pending: {
    label: "待响应",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    cardClass: "border-brand-paperDeep",
  },
  almost: {
    label: "快成团",
    badgeClass: "bg-violet-50 text-violet-700 border border-violet-200",
    cardClass: "border-violet-200",
  },
  soon: {
    label: "即将出发",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    cardClass: "border-emerald-200",
  },
};

export const MATCH_HISTORY_STATUS_META = {
  formed: {
    label: "已成局",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  completed: {
    label: "已完成",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  cancelled: {
    label: "已取消",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  connected: {
    label: "保持联系",
    badgeClass: "bg-sky-50 text-sky-700 border border-sky-200",
  },
};

export const MATCH_REQUESTS_DEMO = [
  {
    id: "request-1",
    restaurant: { id: "demo-bbq", name: "坠落街烧烤王", category: "烧烤", avgPrice: 38 },
    timeSlot: "今晚夜宵",
    partySize: 3,
    currentCount: 1,
    budgetRange: "30-50",
    preferenceTags: ["夜宵", "想聊天", "接受拼桌"],
    status: "pending",
    note: "想冲烤翅和蒜蓉生蚝，来个能吃辣的。",
    initiator: PARTICIPANTS.aqing,
    participants: [PARTICIPANTS.aqing],
  },
  {
    id: "request-2",
    restaurant: { id: "demo-claypot", name: "天马砂锅饭", category: "简餐", avgPrice: 18 },
    timeSlot: "今天晚饭",
    partySize: 2,
    currentCount: 1,
    budgetRange: "20-30",
    preferenceTags: ["赶课快吃", "安静吃饭"],
    status: "pending",
    note: "吃完还要回去自习，想找同样节奏快的。",
    initiator: PARTICIPANTS.xiaoman,
    participants: [PARTICIPANTS.xiaoman],
  },
  {
    id: "request-3",
    restaurant: { id: "demo-fishhead", name: "岳麓剁椒鱼头馆", category: "湘菜", avgPrice: 58 },
    timeSlot: "明天中午",
    partySize: 4,
    currentCount: 3,
    budgetRange: "50-80",
    preferenceTags: ["AA 优先", "冲辣搭子"],
    status: "almost",
    note: "还差一位，已经有人负责提前去占桌。",
    initiator: PARTICIPANTS.hao,
    participants: [PARTICIPANTS.hao, PARTICIPANTS.nana, PARTICIPANTS.mumu],
  },
  {
    id: "request-4",
    restaurant: { id: "demo-tea", name: "茶百道·大学城店", category: "奶茶", avgPrice: 15 },
    timeSlot: "今天午饭",
    partySize: 3,
    currentCount: 2,
    budgetRange: "20-30",
    preferenceTags: ["想聊天", "接受拼桌"],
    status: "soon",
    note: "饭后顺路买奶茶，主打一个不走回头路。",
    initiator: PARTICIPANTS.qiqi,
    participants: [PARTICIPANTS.qiqi, PARTICIPANTS.nana],
  },
  {
    id: "request-5",
    restaurant: { id: "demo-stinky", name: "麓山臭豆腐老店", category: "小吃", avgPrice: 12 },
    timeSlot: "今天晚饭",
    partySize: 2,
    currentCount: 1,
    budgetRange: "20-30",
    preferenceTags: ["想聊天", "长沙特色"],
    status: "pending",
    note: "排队的时候刚好一起聊聊大学城避雷店。",
    initiator: PARTICIPANTS.mumu,
    participants: [PARTICIPANTS.mumu],
  },
];

export const MATCH_HISTORY_DEMO = [
  {
    id: "history-1",
    restaurant: "坠落街烧烤王",
    timeLabel: "昨晚 21:40",
    status: "formed",
    participants: [PARTICIPANTS.aqing, PARTICIPANTS.xiaoman, PARTICIPANTS.nana],
    resultSummary: "3人已成局，夜宵局顺利收尾。",
  },
  {
    id: "history-2",
    restaurant: "天马砂锅饭",
    timeLabel: "周一 12:18",
    status: "completed",
    participants: [PARTICIPANTS.xiaoman, PARTICIPANTS.mumu],
    resultSummary: "2人完成赶课午饭，下次约了鸡杂盖码。",
  },
  {
    id: "history-3",
    restaurant: "茶百道·大学城店",
    timeLabel: "上周五 16:05",
    status: "connected",
    participants: [PARTICIPANTS.qiqi, PARTICIPANTS.nana, PARTICIPANTS.aqing, PARTICIPANTS.hao],
    resultSummary: "4人拼单成功，后续继续共享店铺清单。",
  },
  {
    id: "history-4",
    restaurant: "岳麓剁椒鱼头馆",
    timeLabel: "上周三 18:50",
    status: "cancelled",
    participants: [PARTICIPANTS.hao, PARTICIPANTS.mumu],
    resultSummary: "因临时加课取消，已互留联系方式改约。",
  },
];

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createDefaultMatchComposer(targetRestaurant) {
  return {
    restaurantId: targetRestaurant && targetRestaurant.id ? targetRestaurant.id : "",
    restaurantName: targetRestaurant && targetRestaurant.name ? targetRestaurant.name : "",
    timeSlot: "今天晚饭",
    partySize: 2,
    budgetRange: "30-50",
    preference: "都可以",
    acceptSplitTable: true,
    note: "",
  };
}

export function getMatchRestaurantOptions(restaurants) {
  if (Array.isArray(restaurants) && restaurants.length > 0) {
    const seen = new Set();
    return restaurants
      .slice()
      .sort(function (a, b) {
        return (b.rating || 0) - (a.rating || 0);
      })
      .filter(function (restaurant) {
        if (!restaurant || !restaurant.id || !restaurant.name || seen.has(restaurant.id)) {
          return false;
        }
        seen.add(restaurant.id);
        return true;
      })
      .slice(0, 8)
      .map(function (restaurant) {
        return {
          id: restaurant.id,
          name: restaurant.name,
          category: restaurant.category || "",
          avgPrice: restaurant.avgPrice || null,
        };
      });
  }

  const seen = new Set();
  return MATCH_REQUESTS_DEMO.filter(function (request) {
    const restaurantId = request.restaurant.id;
    if (seen.has(restaurantId)) {
      return false;
    }
    seen.add(restaurantId);
    return true;
  }).map(function (request) {
    return clonePlain(request.restaurant);
  });
}

export function createPublishedMatchRequest(args) {
  const composer = args.composer;
  const user = args.user || null;
  const restaurantOptions = args.restaurantOptions || [];
  const targetRestaurant = args.targetRestaurant || null;
  const fallbackRestaurant = restaurantOptions[0] || null;
  const restaurantId = composer.restaurantId || (targetRestaurant && targetRestaurant.id) || (fallbackRestaurant && fallbackRestaurant.id) || "nearby-hot";
  const restaurantName = composer.restaurantName || (targetRestaurant && targetRestaurant.name) || (fallbackRestaurant && fallbackRestaurant.name) || "周边热门餐厅";
  const participant = {
    id: user && user.id ? user.id : "local-demo-me",
    name: user && user.nickname ? user.nickname : "你",
    school: user && user.school ? user.school : "湖南大学",
    avatarUrl: user && user.avatarUrl ? user.avatarUrl : "",
    avatarTone: "bg-brand-primarySoft text-brand-primary",
  };
  const preferenceTags = [];
  if (composer.preference && composer.preference !== "都可以") {
    preferenceTags.push(composer.preference);
  }
  preferenceTags.push(composer.acceptSplitTable ? "接受拼桌" : "不拼桌");

  return {
    id: "request-" + Date.now(),
    restaurant: {
      id: restaurantId,
      name: restaurantName,
      category: targetRestaurant && targetRestaurant.category ? targetRestaurant.category : "",
      avgPrice: targetRestaurant && targetRestaurant.avgPrice ? targetRestaurant.avgPrice : null,
    },
    timeSlot: composer.timeSlot,
    partySize: composer.partySize,
    currentCount: 1,
    budgetRange: composer.budgetRange,
    preferenceTags: preferenceTags,
    status: "pending",
    note: composer.note || "已发布新的搭子需求，等人一起出发。",
    initiator: participant,
    participants: [participant],
    createdByCurrentUser: true,
  };
}

export function getMatchStatusMeta(status) {
  return MATCH_STATUS_META[status] || MATCH_STATUS_META.pending;
}

export function getMatchHistoryStatusMeta(status) {
  return MATCH_HISTORY_STATUS_META[status] || MATCH_HISTORY_STATUS_META.completed;
}
