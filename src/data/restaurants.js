export const mockRestaurants = [
  {
    id: 1,
    name: '堕子王烧烤',
    coordinates: [112.932, 28.175],
    rating: 4.6,
    priceLevel: 2,
    avgPrice: 35,
    distance: 280,
    location: '堕落街中段，湖大北校区步行3分钟',
    tags: ['烧烤', '堕落街老店', '夜宵必选', '学生最爱'],
    category: '晚饭',
    likes: 1248,
    isFavorite: true,
    visitCount: 5,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '羊肉串', price: 3 },
      { name: '烤茄子', price: 8 },
      { name: '烤韭菜', price: 6 },
      { name: '烤鸡翅', price: 12 }
    ],
    recentReviews: [
      {
        author: '张学长',
        rating: 5,
        comment: '这家烧烤真的绝了！羊肉串超大，老板人也很好，每次来都要排队'
      },
      {
        author: '李学姐',
        rating: 4,
        comment: '堕落街最有名的烧烤店，味道确实不错，就是人太多了要等很久'
      }
    ]
  },
  {
    id: 2,
    name: '湖大后街糖油粑粑',
    coordinates: [112.928, 28.172],
    rating: 4.3,
    priceLevel: 1,
    avgPrice: 8,
    distance: 150,
    location: '湖大后街小巷，靠近岳麓书院后门',
    tags: ['长沙小吃', '糖油粑粑', '老字号', '便宜好吃'],
    category: '长沙特色',
    likes: 856,
    isFavorite: false,
    visitCount: 3,
    busyStatus: 'green',
    hotDishes: [
      { name: '糖油粑粑', price: 8 },
      { name: '臭豆腐', price: 6 },
      { name: '葱油粑粑', price: 5 },
      { name: '糖饺', price: 7 }
    ],
    recentReviews: [
      {
        author: '王同学',
        rating: 5,
        comment: '正宗长沙味道！3块钱一串，性价比超高，外酥内软超好吃'
      },
      {
        author: '陈学姐',
        rating: 4,
        comment: '湖学生必打卡，老奶奶做的很用心，就是排队要等很久'
      }
    ]
  },
  {
    id: 3,
    name: '中南大学鱼粉王',
    coordinates: [112.935, 28.178],
    rating: 4.7,
    priceLevel: 2,
    avgPrice: 25,
    distance: 420,
    location: '中南大学升华公寓附近，步行5分钟',
    tags: ['鱼粉', '中南大学', '升华公寓', '早餐首选'],
    category: '午饭',
    likes: 1567,
    isFavorite: true,
    visitCount: 8,
    busyStatus: 'red',
    hotDishes: [
      { name: '招牌鱼粉', price: 15 },
      { name: '鱼头粉', price: 22 },
      { name: '酸辣鱼粉', price: 18 },
      { name: '原味鱼粉', price: 12 }
    ],
    recentReviews: [
      {
        author: '刘学长',
        rating: 5,
        comment: '鱼肉超多！汤特别鲜，早上来一碗整个人都暖了，强烈推荐'
      },
      {
        author: '周同学',
        rating: 5,
        comment: '中南最好吃的鱼粉，没有之一！老板给的料特别足'
      }
    ]
  },
  {
    id: 4,
    name: '师大天马食堂',
    coordinates: [112.925, 28.170],
    rating: 4.2,
    priceLevel: 1,
    avgPrice: 15,
    distance: 380,
    location: '湖南师范大学天马学生公寓，2楼风味窗口',
    tags: ['学生食堂', '师大天马', '价格实惠', '适合赶课'],
    category: '快餐',
    likes: 923,
    isFavorite: false,
    visitCount: 12,
    busyStatus: 'green',
    hotDishes: [
      { name: '红烧肉', price: 12 },
      { name: '麻婆豆腐', price: 8 },
      { name: '青椒肉丝', price: 10 },
      { name: '西红柿鸡蛋', price: 9 }
    ],
    recentReviews: [
      {
        author: '吴学姐',
        rating: 4,
        comment: '食堂里最好吃的窗口，阿姨手不抖，菜量很足，适合学生党'
      },
      {
        author: '郑同学',
        rating: 4,
        comment: '赶课的时候必选，出餐快，味道也不错，性价比很高'
      }
    ]
  },
  {
    id: 5,
    name: '麓山南路臭豆腐',
    coordinates: [112.930, 28.173],
    rating: 4.4,
    priceLevel: 1,
    avgPrice: 12,
    distance: 200,
    location: '麓山南路公交站旁，湖大地铁站A出口',
    tags: ['臭豆腐', '长沙特色', '路边小吃', '网红打卡'],
    category: '长沙特色',
    likes: 1134,
    isFavorite: true,
    visitCount: 2,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '长沙臭豆腐', price: 12 },
      { name: '糖油粑粑', price: 8 },
      { name: '葱油粑粑', price: 6 },
      { name: '麻辣香干', price: 10 }
    ],
    recentReviews: [
      {
        author: '孙学长',
        rating: 5,
        comment: '闻着臭吃着香！外酥里嫩，配上特制辣椒酱绝了'
      },
      {
        author: '马同学',
        rating: 4,
        comment: '长沙最正宗的臭豆腐，每次路过都要买一份，老板人也很好'
      }
    ]
  },
  {
    id: 6,
    name: '茶颜悦色岳麓店',
    coordinates: [112.933, 28.174],
    rating: 4.5,
    priceLevel: 2,
    avgPrice: 28,
    distance: 320,
    location: '岳麓山脚下，湖南大学东方红广场附近',
    tags: ['奶茶', '茶颜悦色', '网红奶茶', '拍照打卡'],
    category: '奶茶',
    likes: 2341,
    isFavorite: false,
    visitCount: 6,
    busyStatus: 'red',
    hotDishes: [
      { name: '幽兰拿铁', price: 22 },
      { name: '声声乌龙', price: 20 },
      { name: '桂花弄', price: 18 },
      { name: '芊芊马卡龙', price: 25 }
    ],
    recentReviews: [
      {
        author: '赵学姐',
        rating: 5,
        comment: '幽兰拿铁yyds！茶香浓郁，奶泡丰富，每次来都要排队'
      },
      {
        author: '钱同学',
        rating: 4,
        comment: '长沙必喝奶茶，味道确实不错，就是人太多了要等很久'
      }
    ]
  },
  {
    id: 7,
    name: '堕落街麻辣烫',
    coordinates: [112.931, 28.176],
    rating: 4.1,
    priceLevel: 2,
    avgPrice: 32,
    distance: 260,
    location: '堕落街南段，靠近湖大北校区宿舍',
    tags: ['麻辣烫', '堕落街', '自选菜品', '夜宵'],
    category: '快餐',
    likes: 789,
    isFavorite: false,
    visitCount: 4,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '麻辣烫套餐', price: 25 },
      { name: '牛肉丸', price: 3 },
      { name: '豆腐泡', price: 2 },
      { name: '青菜', price: 4 }
    ],
    recentReviews: [
      {
        author: '冯学长',
        rating: 4,
        comment: '菜品很新鲜，汤底味道不错，价格实惠，适合学生聚餐'
      },
      {
        author: '韩同学',
        rating: 4,
        comment: '堕落街性价比最高的麻辣烫，老板给的料很足'
    }
    ]
  },
  {
    id: 8,
    name: '岳麓山脚剁椒鱼头',
    coordinates: [112.927, 28.171],
    rating: 4.8,
    priceLevel: 3,
    avgPrice: 68,
    distance: 450,
    location: '岳麓山脚下，湖南大学岳麓书院旁',
    tags: ['剁椒鱼头', '湘菜', '岳麓山', '聚餐首选'],
    category: '晚饭',
    likes: 1876,
    isFavorite: true,
    visitCount: 1,
    busyStatus: 'red',
    hotDishes: [
      { name: '剁椒鱼头', price: 68 },
      { name: '湘味小炒肉', price: 38 },
      { name: '糖醋里脊', price: 32 },
      { name: '麻婆豆腐', price: 22 }
    ],
    recentReviews: [
      {
        author: '杨学长',
        rating: 5,
        comment: '鱼头超大！剁椒很香，配菜也很丰富，聚餐必选'
      },
      {
        author: '朱学姐',
        rating: 5,
        comment: '岳麓山脚下最好吃的湘菜馆，环境也很好，推荐剁椒鱼头'
      }
    ]
  },
  {
    id: 9,
    name: '一点点奶茶',
    coordinates: [112.934, 28.177],
    rating: 4.3,
    priceLevel: 2,
    avgPrice: 18,
    distance: 380,
    location: '中南大学校门口，升华公寓对面',
    tags: ['一点点', '奶茶', '波霸奶茶', '性价比高'],
    category: '奶茶',
    likes: 1456,
    isFavorite: false,
    visitCount: 7,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '波霸奶茶', price: 15 },
      { name: '四季春茶', price: 12 },
      { name: '阿萨姆红茶', price: 10 },
      { name: '抹茶拿铁', price: 18 }
    ],
    recentReviews: [
      {
        author: '林同学',
        rating: 4,
        comment: '一点点还是那个味道，波霸很有嚼劲，价格实惠'
      },
      {
        author: '黄学姐',
        rating: 4,
        comment: '中南学生最爱，每次下课都要来一杯'
      }
    ]
  },
  {
    id: 10,
    name: '师大小吃街煎饼果子',
    coordinates: [112.924, 28.169],
    rating: 4.0,
    priceLevel: 1,
    avgPrice: 10,
    distance: 420,
    location: '师大天马学生公寓后门小吃街',
    tags: ['煎饼果子', '早餐', '师大天马', '快手早餐'],
    category: '快餐',
    likes: 678,
    isFavorite: false,
    visitCount: 15,
    busyStatus: 'green',
    hotDishes: [
      { name: '煎饼果子', price: 8 },
      { name: '鸡蛋灌饼', price: 7 },
      { name: '手抓饼', price: 9 },
      { name: '烤冷面', price: 10 }
    ],
    recentReviews: [
      {
        author: '徐同学',
        rating: 4,
        comment: '早餐必选，出餐快，分量足，价格实惠'
      },
      {
        author: '何学长',
        rating: 4,
        comment: '师大最好吃的煎饼果子，阿姨手很稳'
      }
    ]
  },
  {
    id: 11,
    name: '湖大食堂三楼',
    coordinates: [112.929, 28.174],
    rating: 4.1,
    priceLevel: 1,
    avgPrice: 12,
    distance: 180,
    location: '湖南大学学生食堂三楼风味餐厅',
    tags: ['湖大食堂', '学生餐厅', '价格实惠', '菜品种类多'],
    category: '午饭',
    likes: 892,
    isFavorite: false,
    visitCount: 20,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '宫保鸡丁', price: 10 },
      { name: '鱼香肉丝', price: 9 },
      { name: '回锅肉', price: 11 },
      { name: '蒜蓉西兰花', price: 8 }
    ],
    recentReviews: [
      {
        author: '高同学',
        rating: 4,
        comment: '湖大最好吃的食堂，菜品种类多，价格实惠'
      },
      {
        author: '谢学姐',
        rating: 4,
        comment: '三楼风味餐厅比一二楼好吃多了，推荐'
      }
    ]
  },
  {
    id: 12,
    name: '天马牛肉粉',
    coordinates: [112.926, 28.171],
    rating: 4.5,
    priceLevel: 2,
    avgPrice: 20,
    distance: 350,
    location: '天马学生公寓门口，师大南门对面',
    tags: ['牛肉粉', '天马', '湖南米粉', '早餐首选'],
    category: '午饭',
    likes: 1234,
    isFavorite: true,
    visitCount: 6,
    busyStatus: 'red',
    hotDishes: [
      { name: '招牌牛肉粉', price: 18 },
      { name: '牛腩粉', price: 22 },
      { name: '牛肚粉', price: 20 },
      { name: '酸辣牛肉粉', price: 19 }
    ],
    recentReviews: [
      {
        author: '邓学长',
        rating: 5,
        comment: '天马最好吃的牛肉粉，牛肉超大块，汤很鲜'
      },
      {
        author: '曾同学',
        rating: 4,
        comment: '每次来天马都要吃这家，味道正宗'
      }
    ]
  },
  {
    id: 13,
    name: '茶百道',
    coordinates: [112.936, 28.179],
    rating: 4.2,
    priceLevel: 2,
    avgPrice: 20,
    distance: 450,
    location: '中南大学南校区门口',
    tags: ['茶百道', '奶茶', '果茶', '学生最爱'],
    category: '奶茶',
    likes: 1567,
    isFavorite: false,
    visitCount: 8,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '杨枝甘露', price: 18 },
      { name: '豆乳玉麒麟', price: 16 },
      { name: '茉莉奶绿', price: 14 },
      { name: '西瓜啵啵', price: 15 }
    ],
    recentReviews: [
      {
        author: '彭同学',
        rating: 4,
        comment: '茶百道的果茶很好喝，杨枝甘露yyds'
      },
      {
        author: '蔡学姐',
        rating: 4,
        comment: '中南学生最爱，每次下课都要排队'
      }
    ]
  },
  {
    id: 14,
    name: '堕落街螺蛳粉',
    coordinates: [112.930, 28.175],
    rating: 4.3,
    priceLevel: 1,
    avgPrice: 15,
    distance: 240,
    location: '堕落街北段，湖大北校区后门',
    tags: ['螺蛳粉', '堕落街', '广西特色', '重口味'],
    category: '快餐',
    likes: 987,
    isFavorite: false,
    visitCount: 3,
    busyStatus: 'green',
    hotDishes: [
      { name: '原味螺蛳粉', price: 12 },
      { name: '加蛋螺蛳粉', price: 15 },
      { name: '加肉螺蛳粉', price: 18 },
      { name: '酸笋', price: 3 }
    ],
    recentReviews: [
      {
        author: '谭同学',
        rating: 5,
        comment: '堕落街最好吃的螺蛳粉，味道很正宗'
      },
      {
        author: '廖学长',
        rating: 4,
        comment: '喜欢吃螺蛳粉的必选，酸笋很脆'
      }
    ]
  },
  {
    id: 15,
    name: '岳麓山脚湘菜馆',
    coordinates: [112.926, 28.170],
    rating: 4.6,
    priceLevel: 3,
    avgPrice: 55,
    distance: 400,
    location: '岳麓山脚下，湖大岳麓书院旁',
    tags: ['湘菜', '岳麓山', '聚餐', '环境好'],
    category: '晚饭',
    likes: 1789,
    isFavorite: true,
    visitCount: 2,
    busyStatus: 'red',
    hotDishes: [
      { name: '剁椒鱼头', price: 68 },
      { name: '口味虾', price: 58 },
      { name: '毛氏红烧肉', price: 48 },
      { name: '东安子鸡', price: 42 }
    ],
    recentReviews: [
      {
        author: '尹学长',
        rating: 5,
        comment: '岳麓山脚下最好的湘菜馆，环境很棒，菜品正宗'
      },
      {
        author: '余学姐',
        rating: 5,
        comment: '聚餐首选，每道菜都很好吃，强烈推荐'
      }
    ]
  },
  {
    id: 16,
    name: '古茗奶茶',
    coordinates: [112.937, 28.180],
    rating: 4.4,
    priceLevel: 2,
    avgPrice: 19,
    distance: 480,
    location: '中南大学新校区门口',
    tags: ['古茗', '奶茶', '芝士茶', '新校区'],
    category: '奶茶',
    likes: 1345,
    isFavorite: false,
    visitCount: 5,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '芝士莓莓', price: 20 },
      { name: '古茗奶茶', price: 15 },
      { name: '芝士桃桃', price: 20 },
      { name: '杨枝甘露', price: 18 }
    ],
    recentReviews: [
      {
        author: '袁同学',
        rating: 4,
        comment: '古茗的芝士茶很好喝，奶盖很厚'
      },
      {
        author: '邓学姐',
        rating: 4,
        comment: '新校区学生最爱，每次都要排队'
      }
    ]
  },
  {
    id: 17,
    name: '师大后街麻辣香锅',
    coordinates: [112.923, 28.168],
    rating: 4.2,
    priceLevel: 2,
    avgPrice: 28,
    distance: 450,
    location: '师大后街，天马学生公寓后门',
    tags: ['麻辣香锅', '师大后街', '自选菜品', '聚餐'],
    category: '晚饭',
    likes: 1123,
    isFavorite: false,
    visitCount: 4,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '麻辣香锅', price: 25 },
      { name: '牛肉', price: 8 },
      { name: '土豆片', price: 4 },
      { name: '豆腐皮', price: 5 }
    ],
    recentReviews: [
      {
        author: '蒋同学',
        rating: 4,
        comment: '师大后街最好吃的麻辣香锅，菜品新鲜'
      },
      {
        author: '段学长',
        rating: 4,
        comment: '聚餐必选，价格实惠，味道不错'
      }
    ]
  },
  {
    id: 18,
    name: '湖大北校区煎饼摊',
    coordinates: [112.931, 28.177],
    rating: 4.0,
    priceLevel: 1,
    avgPrice: 8,
    distance: 200,
    location: '湖大北校区门口，堕落街口',
    tags: ['煎饼', '湖大北校', '早餐', '快手'],
    category: '快餐',
    likes: 756,
    isFavorite: false,
    visitCount: 18,
    busyStatus: 'green',
    hotDishes: [
      { name: '煎饼果子', price: 7 },
      { name: '鸡蛋灌饼', price: 6 },
      { name: '手抓饼', price: 8 },
      { name: '烤冷面', price: 9 }
    ],
    recentReviews: [
      {
        author: '龚同学',
        rating: 4,
        comment: '湖大北校最好吃的煎饼，阿姨手很稳'
      },
      {
        author: '龙学姐',
        rating: 4,
        comment: '早餐必选，出餐快，价格实惠'
      }
    ]
  },
  {
    id: 19,
    name: '天马学生公寓奶茶店',
    coordinates: [112.925, 28.170],
    rating: 4.1,
    priceLevel: 2,
    avgPrice: 16,
    distance: 380,
    location: '天马学生公寓内，师大南门',
    tags: ['奶茶', '天马', '学生公寓', '性价比高'],
    category: '奶茶',
    likes: 834,
    isFavorite: false,
    visitCount: 10,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '珍珠奶茶', price: 12 },
      { name: '椰果奶茶', price: 13 },
      { name: '红豆奶茶', price: 14 },
      { name: '布丁奶茶', price: 15 }
    ],
    recentReviews: [
      {
        author: '熊同学',
        rating: 4,
        comment: '天马学生最爱，价格实惠，味道不错'
      },
      {
        author: '孟学姐',
        rating: 4,
        comment: '公寓内很方便，不用出校门就能喝到奶茶'
      }
    ]
  },
  {
    id: 20,
    name: '堕落街重庆小面',
    coordinates: [112.929, 28.176],
    rating: 4.3,
    priceLevel: 1,
    avgPrice: 14,
    distance: 260,
    location: '堕落街中段，湖大北校区后门',
    tags: ['重庆小面', '堕落街', '川味', '面食'],
    category: '午饭',
    likes: 1067,
    isFavorite: true,
    visitCount: 7,
    busyStatus: 'yellow',
    hotDishes: [
      { name: '重庆小面', price: 12 },
      { name: '豌杂面', price: 15 },
      { name: '牛肉面', price: 18 },
      { name: '肥肠面', price: 16 }
    ],
    recentReviews: [
      {
        author: '苏学长',
        rating: 5,
        comment: '堕落街最好吃的重庆小面，味道很正宗'
      },
      {
        author: '范同学',
        rating: 4,
        comment: '喜欢吃辣的必选，面条很有嚼劲'
      }
    ]
  }
];
