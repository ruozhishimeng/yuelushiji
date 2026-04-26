import { Camera, ChevronDown, Crown, Flame, MapPin, Star, ThumbsUp, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  formatAveragePrice,
  formatDistance,
  formatReviewCount
} from '../lib/restaurants/display';
import { demoDishes, demoLocations, demoRankingSubTags } from '../mocks/demoData';

const RANKING_TABS = [
  { key: 'hot', label: '热门榜', icon: Flame, color: 'text-orange-500' },
  { key: 'queue', label: '排队榜', icon: TrendingUp, color: 'text-red-500' },
  { key: 'praise', label: '好评榜', icon: ThumbsUp, color: 'text-brand-primary' },
  { key: 'item', label: '单品榜', icon: Crown, color: 'text-amber-500' }
];

const CATEGORIES = ['江湖美食', '佳饮甜点'];

const toNumber = (value, fallback) => {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const sortRestaurants = (list, ranking) => {
  const copy = [...list];
  switch (ranking) {
    case 'hot':
      return copy.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    case 'queue':
      return copy.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    case 'praise':
      return copy.sort((a, b) => toNumber(b.rating, 0) - toNumber(a.rating, 0));
    default:
      return copy;
  }
};

const RankingPanel = ({ restaurants, onRestaurantSelect }) => {
  const [activeLocation, setActiveLocation] = useState(demoLocations[0]);
  const [activeRanking, setActiveRanking] = useState('hot');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [expandedTags, setExpandedTags] = useState(false);
  const [activeTag, setActiveTag] = useState('');

  const subTags = demoRankingSubTags[activeCategory] || [];
  const visibleTags = expandedTags ? subTags : subTags.slice(0, 4);
  const isItemRanking = activeRanking === 'item';

  const handleTagClick = (tag) => {
    setActiveTag(prev => prev === tag ? '' : tag);
  };

  const sortedRestaurants = useMemo(
    () => sortRestaurants(restaurants, activeRanking).slice(0, 15),
    [restaurants, activeRanking]
  );

  const filteredRestaurants = useMemo(() => {
    if (!activeTag) return sortedRestaurants;
    return sortedRestaurants.filter(r =>
      (r.tags || []).some(t => t === activeTag)
    );
  }, [sortedRestaurants, activeTag]);

  const filteredDishes = useMemo(() => {
    if (!isItemRanking) return [];
    return demoDishes
      .filter(d => !activeTag || d.tag === activeTag)
      .sort((a, b) => b.heat - a.heat);
  }, [isItemRanking, activeTag]);

  const displayList = isItemRanking ? filteredDishes : filteredRestaurants;
  const rankName = RANKING_TABS.find(t => t.key === activeRanking)?.label || '';
  const titleName = activeTag || activeCategory;
  const rankingTitle = isItemRanking
    ? `大学城${titleName}${rankName}`
    : `${titleName}${rankName}`;

  return (
    <div className="flex gap-4">
      {/* 左侧区域选择 + 榜单分类 */ }
      <div className="flex w-[104px] flex-none flex-col gap-3">
        {/* 地区选择 */ }
        <div className="space-y-1">
          {demoLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc)}
              className={`w-full rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition-all duration-200 ${
                activeLocation === loc
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primaryHover'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="border-t border-brand-paperDeep pt-3">
          <p className="mb-2 px-1 text-[11px] font-medium text-gray-400">榜单分类</p>
          <div className="flex flex-col gap-1">
            {RANKING_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveRanking(tab.key)}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    activeRanking === tab.key
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primaryHover'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeRanking === tab.key ? 'text-white' : tab.color}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右侧主内容 */ }
      <div className="min-w-0 flex-1">
        {/* 美食大类切换 */ }
        <div className="flex gap-2 mb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveTag(''); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 子标签筛选 单选 */ }
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primaryHover'
                }`}
              >
                {tag}
              </button>
            ))}
            {subTags.length > 4 && (
              <button
                onClick={() => setExpandedTags(!expandedTags)}
                className="flex items-center gap-0.5 rounded-full bg-brand-paperSoft px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-brand-primarySubtle"
              >
                {expandedTags ? '收起' : '更多'}
                <ChevronDown className={`h-3 w-3 transition-transform ${expandedTags ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* 榜单名 */ }
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-brand-paperSoft px-3 py-1.5">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-900">{rankingTitle}</span>
          </div>
          <span className="text-xs text-gray-400">{displayList.length}个</span>
        </div>

        {/* 商家列表 / 菜品列表 */ }
        {displayList.length === 0 ? (
          <div className="rounded-2xl bg-brand-paperSoft py-12 text-center">
            <Star className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">暂无符合条件的{isItemRanking ? '单品' : '商家'}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-brand-paperSoft p-3">
            <div className="divide-y divide-brand-paperDeep">
              {displayList.map((item, index) => {
                const isRestaurant = !isItemRanking;
                return (
                  <div
                    key={isRestaurant ? `${activeRanking}-${item.id}` : item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (isRestaurant && onRestaurantSelect) onRestaurantSelect(item);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isRestaurant && onRestaurantSelect) onRestaurantSelect(item);
                      }
                    }}
                    className={`flex items-center gap-3 px-1 py-3 first:pt-1 last:pb-1 transition-colors hover:bg-brand-primarySubtle/30 focus:outline-none focus-visible:bg-brand-primarySubtle/30 ${isRestaurant ? 'cursor-pointer' : ''}`}
                  >
                    {/* 图片缩略图 */ }
                    {isRestaurant ? (
                      <div className="h-[72px] w-[72px] flex-none overflow-hidden rounded-lg bg-brand-paper">
                        {item.photos && item.photos.find(Boolean) ? (
                          <img
                            src={item.photos.find(Boolean)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-brand-primary/60">
                            <Camera className="mb-0.5 h-5 w-5" />
                            <span className="text-[10px] font-medium">无图</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`flex h-[72px] w-[72px] flex-none items-center justify-center rounded-lg text-sm font-bold ${
                        index < 3 ? 'bg-brand-primary text-white' : 'bg-brand-paper text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                    )}

                    {/* 中间信息 */ }
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">
                        {isRestaurant ? item.name : item.name}
                      </h4>
                      {isRestaurant ? (
                        <>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                            <span className="flex items-center gap-0.5 font-medium text-gray-700">
                              <Star className="h-3.5 w-3.5 fill-current text-brand-warning" />
                              {item.rating || '暂无评分'}
                            </span>
                            <span className="text-gray-400">{formatReviewCount(item)}</span>
                            <span className="font-semibold text-brand-primary">
                              {formatAveragePrice(item.avgPrice)}
                            </span>
                          </div>
                          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-gray-400">
                            <MapPin className="h-3.5 w-3.5 flex-none" />
                            <span className="line-clamp-1">
                              {formatDistance(item.distance)} · {item.location}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            {(item.tags || []).slice(0, 2).map((tag, i) => (
                              <span
                                key={`${item.id}-${i}`}
                                className="rounded-full bg-brand-paper px-2 py-0.5 text-[11px] font-medium text-brand-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="mt-0.5 flex items-center gap-2 text-xs">
                          <span className="text-gray-500">{item.restaurant}</span>
                          <span className="font-semibold text-brand-primary">{item.price}元</span>
                          {item.tag && (
                            <span className="rounded-full bg-brand-paper px-1.5 py-0.5 text-[10px] text-brand-primary">{item.tag}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 右侧去过/人气 */ }
                    <div className="flex flex-none flex-col items-center">
                      <span className="text-base font-bold text-brand-primary">
                        {isRestaurant ? (item.likes || 0) : item.heat}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {isRestaurant ? '热度' : '人气'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPanel;