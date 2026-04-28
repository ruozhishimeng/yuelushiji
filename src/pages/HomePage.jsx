import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  ThumbsUp,
  Users,
  Utensils,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { getCommunityPosts } from '../lib/api/communityApi';
import { getReviewCount } from '../lib/restaurants/display';

const PAGE_SIZE = 6;
const ALL_SCHOOLS = '全部大学城';
const STATIC_CIRCLES = ['湖南大学', '中南大学', '湖南师范大学'];

const QUICK_FILTERS = [
  { id: 'nearby', label: '附近', icon: MapPin },
  { id: 'openNow', label: '正在营业', icon: Clock, disabled: true, note: '待接入实时营业数据' },
  { id: 'highVerify', label: '高验证', icon: ShieldCheck },
  { id: 'date', label: '适合约会', icon: Star },
  { id: 'group', label: '朋友聚餐', icon: Users },
  { id: 'budget', label: '人均友好', icon: Camera }
];

const FILTER_GROUPS = [
  {
    key: 'distance',
    label: '距离 / 商圈',
    options: [
      { value: 'all', label: '不限' },
      { value: '800', label: '800m 内' },
      { value: '1500', label: '1.5km 内' },
      { value: '3000', label: '3km 内' }
    ]
  },
  {
    key: 'price',
    label: '人均价格',
    options: [
      { value: 'all', label: '不限' },
      { value: 'under20', label: '20 以下' },
      { value: '20to50', label: '20-50' },
      { value: 'over50', label: '50 以上' }
    ]
  },
  {
    key: 'category',
    label: '菜系 / 类型',
    options: [
      { value: 'all', label: '不限' },
      { value: '午饭', label: '正餐' },
      { value: '快餐', label: '快餐小吃' },
      { value: '奶茶', label: '饮品甜点' },
      { value: '长沙特色', label: '长沙特色' }
    ]
  },
  {
    key: 'truth',
    label: '真实性 / 评分',
    options: [
      { value: 'all', label: '不限' },
      { value: 'verified90', label: '验证 90+' },
      { value: 'rating45', label: '评分 4.5+' },
      { value: 'review50', label: '评价 50+' }
    ]
  },
  {
    key: 'scene',
    label: '环境氛围',
    options: [
      { value: 'all', label: '不限' },
      { value: '赶课快吃', label: '赶课快吃' },
      { value: '适合约会', label: '适合约会' },
      { value: '朋友聚餐', label: '朋友聚餐' },
      { value: '一人食', label: '一人食' }
    ]
  },
  {
    key: 'sort',
    label: '排序方式',
    options: [
      { value: 'latest', label: '最新发布' },
      { value: 'distance', label: '距离最近' },
      { value: 'rating', label: '评分最高' },
      { value: 'validation', label: '验证优先' }
    ]
  }
];

const DEFAULT_FILTERS = {
  distance: 'all',
  price: 'all',
  category: 'all',
  truth: 'all',
  scene: 'all',
  sort: 'latest'
};

const getOptionLabel = (groupKey, value) => {
  const group = FILTER_GROUPS.find(item => item.key === groupKey);
  return group?.options.find(option => option.value === value)?.label || value;
};

const normalize = (value) => String(value || '').toLowerCase();

const getRestaurantText = (restaurant) => [
  restaurant?.name,
  restaurant?.location,
  restaurant?.category,
  ...(restaurant?.tags || [])
].filter(Boolean).join(' ');

const restaurantHasAny = (restaurant, keywords = []) => {
  const restaurantText = getRestaurantText(restaurant);
  return keywords.some(keyword => restaurantText.includes(keyword));
};

const resolveRestaurantForPost = (post, restaurants) => {
  if (!restaurants.length) return null;

  const binding = post.restaurantBinding || {};
  const preferredIndex = Number.isFinite(Number(binding.index)) ? Number(binding.index) : 0;
  const candidates = restaurants.map((restaurant, index) => {
    let score = 0;
    if (binding.category && (restaurant.category === binding.category || restaurantHasAny(restaurant, [binding.category]))) {
      score += 8;
    }
    if (restaurantHasAny(restaurant, binding.preferredTags || [])) {
      score += 5;
    }
    if (binding.priceLevel && restaurant.priceLevel === binding.priceLevel) {
      score += 2;
    }
    score -= Math.min(Math.abs(index - preferredIndex), 5) * 0.1;
    return { restaurant, score, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index);

  return candidates[0]?.score > 0
    ? candidates[0].restaurant
    : restaurants[preferredIndex % restaurants.length];
};

const matchesDistance = (restaurant, value) => {
  if (value === 'all') return true;
  if (!restaurant || !Number.isFinite(Number(restaurant.distance))) return false;
  return Number(restaurant.distance) <= Number(value);
};

const matchesPrice = (restaurant, value) => {
  if (value === 'all') return true;
  if (!restaurant) return false;
  const price = Number(restaurant.avgPrice);
  if (!Number.isFinite(price)) return false;
  if (value === 'under20') return price < 20;
  if (value === '20to50') return price >= 20 && price <= 50;
  if (value === 'over50') return price > 50;
  return true;
};

const matchesCategory = (restaurant, value) => {
  if (value === 'all') return true;
  if (!restaurant) return false;
  return restaurant.category === value || restaurantHasAny(restaurant, [value]);
};

const matchesTruth = (post, value) => {
  if (value === 'all') return true;
  if (value === 'verified90') return post.validationScore >= 90;
  if (value === 'rating45') return Number(post.restaurant?.rating || post.rating || 0) >= 4.5;
  if (value === 'review50') return getReviewCount(post.restaurant || {}) >= 50;
  return true;
};

const matchesScene = (post, value) => {
  if (value === 'all') return true;
  return (post.sceneTags || []).includes(value);
};

const matchesQuickFilters = (post, quickFilters) => {
  if (quickFilters.has('nearby') && !matchesDistance(post.restaurant, '1000')) return false;
  if (quickFilters.has('highVerify') && post.validationScore < 90) return false;
  if (quickFilters.has('date') && !matchesScene(post, '适合约会')) return false;
  if (quickFilters.has('group') && !matchesScene(post, '朋友聚餐')) return false;
  if (quickFilters.has('budget') && !matchesPrice(post.restaurant, 'under20') && !(post.restaurant?.avgPrice <= 35)) return false;
  return true;
};

const VerificationPostModal = ({ post, onClose, onRestaurantSelect }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = post.images?.length ? post.images : [post.cover];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const showPreviousImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % images.length);
  };

  const handleRestaurantClick = () => {
    if (!post.restaurant || !onRestaurantSelect) return;
    onClose();
    onRestaurantSelect(post.restaurant);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/55 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${post.id}-title`}
        className="grid max-h-[92dvh] w-full max-w-6xl overflow-hidden rounded-2xl bg-brand-paperSoft shadow-2xl lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]"
      >
        <div className="relative min-h-[320px] bg-gray-950 lg:min-h-[720px]">
          <img
            src={images[activeImageIndex]}
            alt={post.title}
            className="h-full max-h-[46dvh] w-full object-cover lg:max-h-none lg:min-h-[720px]"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="上一张图片"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="下一张图片"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={`${post.id}-image-${image}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`查看第 ${index + 1} 张图片`}
                className={`h-2.5 rounded-full transition-all ${
                  activeImageIndex === index ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col bg-brand-paperSoft">
          <div className="flex items-start justify-between gap-3 border-b border-brand-paperDeep px-5 py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-900">{post.author}</span>
                <span>{post.school}</span>
                <span>{post.timeAgo}</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                  {post.isDemo ? '演示验证' : `验证 ${post.validationScore}`}
                </span>
              </div>
              <h2 id={`${post.id}-title`} className="mt-2 text-xl font-bold leading-snug text-gray-950 sm:text-2xl">
                {post.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭图文详情"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-brand-paper hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              {(post.tags || []).map(tag => (
                <span key={`${post.id}-${tag}`} className="rounded-full bg-brand-paper px-2.5 py-1 text-xs font-medium text-brand-primary">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <Star className="h-4 w-4 fill-current" />
                {post.rating}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-brand-primary" />
                验证 {post.validationScore}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-gray-400" />
                {post.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-gray-400" />
                {post.commentCount}
              </span>
            </div>

            <div className="mt-5 space-y-3 text-[15px] leading-7 text-gray-700">
              <p className="font-medium text-gray-900">{post.summary}</p>
              {(post.content || '').split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={`${post.id}-detail-${index}`}>{paragraph}</p>
              ))}
            </div>

            <section className="mt-6 border-t border-brand-paperDeep pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">关联真实商家</h3>
                <span className="text-xs text-gray-500">来自当前高德 POI 列表</span>
              </div>
              {post.restaurant ? (
                <RestaurantCard
                  restaurant={post.restaurant}
                  variant="compact"
                  onClick={handleRestaurantClick}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-brand-paperDeep bg-brand-paper p-4 text-sm text-gray-500">
                  正在等待真实商家列表加载，演示图文不会生成虚构商家卡片。
                </div>
              )}
            </section>

            <section className="mt-6 border-t border-brand-paperDeep pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">评论区</h3>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {post.isDemo ? '演示评论' : `${post.commentCount || 0} 条评论`}
                </span>
              </div>
              <div className="space-y-4">
                {(post.comments || []).map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
                      {(comment.authorName || comment.author || '?').charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="font-semibold text-gray-800">{comment.authorName || comment.author}</span>
                        <span>{comment.authorSchool || comment.school}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-2 rounded-xl bg-brand-paper p-2">
                <input
                  type="text"
                  disabled
                  aria-label="评论输入框，待接入真实后端"
                  placeholder="评论发布待接入真实后端"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-gray-500 outline-none disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-500 disabled:cursor-not-allowed"
                >
                  待接入
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerificationPostCard = ({ post, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(post)}
    className="group overflow-hidden rounded-xl border border-brand-paperDeep bg-brand-paperSoft text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primarySoft hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
  >
    <div className="aspect-[4/3] overflow-hidden bg-brand-paperDeep">
      <img
        src={post.cover}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {post.isDemo ? '演示验证' : '已验证'}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
          <Star className="h-3.5 w-3.5 fill-current" />
          {post.rating}
        </span>
      </div>
      <h2 className="line-clamp-2 min-h-[44px] text-base font-semibold leading-snug text-gray-950">
        {post.title}
      </h2>
      <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-600">
        {post.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(post.tags || []).slice(0, 3).map(tag => (
          <span key={`${post.id}-card-${tag}`} className="rounded-full bg-brand-paper px-2 py-0.5 text-[11px] font-medium text-brand-primary">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
        <div className="min-w-0">
          <span className="font-medium text-gray-700">{post.author}</span>
          <span className="mx-1">·</span>
          <span>{post.school}</span>
        </div>
        <span className="flex flex-none items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.timeAgo}
        </span>
      </div>
      <div className="mt-3 flex min-w-0 items-center gap-1 rounded-lg bg-brand-paper px-2 py-1.5 text-xs text-gray-600">
        <MapPin className="h-3.5 w-3.5 flex-none text-brand-primary" />
        <span className="line-clamp-1">
          {post.restaurant ? post.restaurant.name : '等待真实商家匹配'}
        </span>
      </div>
    </div>
  </button>
);

const HomePage = ({ restaurants = [], poiLoading = false, onRestaurantSelect }) => {
  const [selectedSchool, setSelectedSchool] = useState(ALL_SCHOOLS);
  const [query, setQuery] = useState('');
  const [quickFilters, setQuickFilters] = useState(() => new Set());
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const [communityPosts, setCommunityPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // 加载社区帖子
  useEffect(() => {
    let cancelled = false;
    setPostsLoading(true);
    getCommunityPosts({ limit: 60 })
      .then(data => {
        if (!cancelled) setCommunityPosts(data.posts || []);
      })
      .catch(err => {
        console.error('[HomePage] 加载社区帖子失败:', err);
      })
      .finally(() => {
        if (!cancelled) setPostsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // 将 API 帖子数据映射为前端格式，并与 restaurants 关联
  const hydratedPosts = useMemo(() => {
    if (!communityPosts.length) return [];
    return communityPosts.map(post => {
      // resolveRestaurantForPost 逻辑
      const restaurant = resolveRestaurantForPost(post, restaurants);
      return { ...post, restaurant };
    });
  }, [communityPosts, restaurants]);

  const filteredPosts = useMemo(() => {
    const loweredQuery = normalize(query.trim());
    const result = hydratedPosts.filter(post => {
      if (selectedSchool !== ALL_SCHOOLS && post.school !== selectedSchool) return false;

      if (loweredQuery) {
        const haystack = normalize([
          post.title,
          post.summary,
          post.author,
          post.school,
          ...(post.tags || []),
          ...(post.sceneTags || []),
          getRestaurantText(post.restaurant)
        ].join(' '));
        if (!haystack.includes(loweredQuery)) return false;
      }

      if (!matchesQuickFilters(post, quickFilters)) return false;
      if (!matchesDistance(post.restaurant, advancedFilters.distance)) return false;
      if (!matchesPrice(post.restaurant, advancedFilters.price)) return false;
      if (!matchesCategory(post.restaurant, advancedFilters.category)) return false;
      if (!matchesTruth(post, advancedFilters.truth)) return false;
      if (!matchesScene(post, advancedFilters.scene)) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      if (advancedFilters.sort === 'distance') {
        return (a.restaurant?.distance || Number.MAX_SAFE_INTEGER) - (b.restaurant?.distance || Number.MAX_SAFE_INTEGER);
      }
      if (advancedFilters.sort === 'rating') {
        return Number(b.restaurant?.rating || b.rating || 0) - Number(a.restaurant?.rating || a.rating || 0);
      }
      if (advancedFilters.sort === 'validation') {
        return b.validationScore - a.validationScore;
      }
      return 0;
    });
  }, [advancedFilters, hydratedPosts, query, quickFilters, selectedSchool]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [advancedFilters, query, quickFilters, selectedSchool]);

  const selectedFilterChips = useMemo(() => {
    const chips = [];
    if (query.trim()) {
      chips.push({ key: 'query', label: `搜索：${query.trim()}`, onClear: () => setQuery('') });
    }
    if (selectedSchool !== ALL_SCHOOLS) {
      chips.push({ key: 'school', label: selectedSchool, onClear: () => setSelectedSchool(ALL_SCHOOLS) });
    }
    quickFilters.forEach(filterId => {
      const filter = QUICK_FILTERS.find(item => item.id === filterId);
      if (filter) {
        chips.push({
          key: `quick-${filter.id}`,
          label: filter.label,
          onClear: () => setQuickFilters(prev => {
            const next = new Set(prev);
            next.delete(filter.id);
            return next;
          })
        });
      }
    });
    Object.entries(advancedFilters).forEach(([key, value]) => {
      if (value !== DEFAULT_FILTERS[key]) {
        chips.push({
          key,
          label: getOptionLabel(key, value),
          onClear: () => setAdvancedFilters(prev => ({ ...prev, [key]: DEFAULT_FILTERS[key] }))
        });
      }
    });
    return chips;
  }, [advancedFilters, query, quickFilters, selectedSchool]);

  const toggleQuickFilter = (filter) => {
    if (filter.disabled) return;
    setQuickFilters(prev => {
      const next = new Set(prev);
      if (next.has(filter.id)) {
        next.delete(filter.id);
      } else {
        next.add(filter.id);
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedSchool(ALL_SCHOOLS);
    setQuickFilters(new Set());
    setAdvancedFilters(DEFAULT_FILTERS);
  };

  return (
    <main className="min-h-dvh overflow-y-auto bg-brand-paper pb-32">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col items-center">
          <img
            src="/assets/logo.png"
            alt="岳麓食纪"
            className="h-36 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-gray-500">大学城真实吃喝分享</p>
          <span className="mt-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            首页图文与评论为演示内容
          </span>
        </header>

        <section className="sticky top-0 z-20 -mx-4 mb-5 border-b border-brand-paperDeep bg-brand-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">搜索验证图文或真实商家</span>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜商家、菜系、场景"
                  className="h-12 w-full rounded-xl border border-brand-paperDeep bg-brand-paperSoft pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-primary"
                />
              </label>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[54%]">
                {[ALL_SCHOOLS, ...STATIC_CIRCLES].map(school => (
                  <button
                    key={school}
                    type="button"
                    onClick={() => setSelectedSchool(school)}
                    aria-pressed={selectedSchool === school}
                    className={`flex h-11 flex-none items-center rounded-full px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                      selectedSchool === school
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primary'
                    }`}
                  >
                    {school}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {QUICK_FILTERS.map(filter => {
                const Icon = filter.icon;
                const active = quickFilters.has(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleQuickFilter(filter)}
                    disabled={filter.disabled}
                    title={filter.note || filter.label}
                    aria-pressed={active}
                    className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                      active
                        ? 'bg-brand-primary text-white'
                        : filter.disabled
                          ? 'cursor-not-allowed bg-brand-paperSoft text-gray-400'
                          : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {filter.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowAdvancedFilters(prev => !prev)}
                aria-expanded={showAdvancedFilters}
                className="ml-auto flex h-10 items-center gap-1.5 rounded-full border border-brand-paperDeep bg-brand-paperSoft px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-brand-primarySubtle hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <SlidersHorizontal className="h-4 w-4" />
                更多筛选
              </button>
            </div>

            {showAdvancedFilters && (
              <div className="mt-3 rounded-xl border border-brand-paperDeep bg-brand-paperSoft p-3 shadow-sm">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {FILTER_GROUPS.map(group => (
                    <div key={group.key}>
                      <div className="mb-2 text-xs font-semibold text-gray-500">{group.label}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.options.map(option => {
                          const active = advancedFilters[group.key] === option.value;
                          return (
                            <button
                              key={`${group.key}-${option.value}`}
                              type="button"
                              onClick={() => setAdvancedFilters(prev => ({ ...prev, [group.key]: option.value }))}
                              className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                                active
                                  ? 'bg-brand-primary text-white'
                                  : 'bg-brand-paper text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primary'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="mb-2 text-xs font-semibold text-gray-500">营业状态</div>
                    <button
                      type="button"
                      disabled
                      className="rounded-full bg-brand-paper px-2.5 py-1.5 text-xs font-semibold text-gray-400"
                      title="待接入真实营业状态"
                    >
                      正在营业 · 待接入
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedFilterChips.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {selectedFilterChips.map(chip => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onClear}
                    className="flex h-8 items-center gap-1 rounded-full bg-brand-primarySubtle px-2.5 text-xs font-semibold text-brand-primaryHover transition-colors hover:bg-brand-primarySoft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="h-8 rounded-full px-2.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-brand-paperSoft hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  清空
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-950">验证图文</h1>
            <p className="mt-1 text-sm text-gray-500">
              每页 6 组图文，商家卡片只从当前真实 POI 列表派生
            </p>
          </div>
          <div className="rounded-full bg-brand-paperSoft px-3 py-1.5 text-sm font-semibold text-gray-600">
            {poiLoading ? '真实商家加载中' : `${restaurants.length} 个真实商家可匹配`}
          </div>
        </div>

        {postsLoading ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-paperDeep bg-brand-paperSoft py-16 text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
            <h2 className="text-lg font-medium text-gray-900">加载社区动态中...</h2>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-paperDeep bg-brand-paperSoft py-16 text-center">
            <Utensils className="mb-4 h-12 w-12 text-brand-paperDeep" />
            <h2 className="text-lg font-medium text-gray-900">社区功能开发中</h2>
            <p className="mt-1 text-sm text-muted-foreground">敬请期待 🍜</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map(post => (
              <VerificationPostCard
                key={post.id}
                post={post}
                onOpen={setSelectedPost}
              />
            ))}
          </section>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            第 {currentPage} / {totalPages} 页 · 当前页最多 {PAGE_SIZE} 组
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex h-10 items-center gap-1 rounded-full bg-brand-paperSoft px-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-brand-primarySubtle hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </button>
            <button
              type="button"
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex h-10 items-center gap-1 rounded-full bg-brand-paperSoft px-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-brand-primarySubtle hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:text-gray-300"
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <section className="mt-5 rounded-xl border border-brand-primarySoft bg-brand-paperSoft p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-primaryHover">
            <ShieldCheck className="h-4 w-4" />
            待接入真实学生评价
          </div>
          <p className="mt-1 text-sm text-brand-primaryHover">
            当前首页用于验证社区信息流形态，正式版只展示认证学生发布并通过审核的真实图文评价。
          </p>
        </section>
      </div>

      {selectedPost && (
        <VerificationPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onRestaurantSelect={onRestaurantSelect}
        />
      )}
    </main>
  );
};

export default HomePage;
