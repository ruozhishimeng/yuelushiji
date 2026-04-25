import { MapPin, Star, TrendingUp, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  formatAveragePrice,
  formatDistance,
  formatPriceLevel
} from '../lib/restaurants/display';

const demoHeat = [128, 103, 96, 82, 76, 61, 48, 35];

const toNumber = (value, fallback) => {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const rankers = [
  {
    key: 'recommended',
    label: '综合推荐',
    badge: '真实POI',
    description: '按评分、距离和价格做前端综合排序'
  },
  {
    key: 'distance',
    label: '距离最近',
    badge: '真实POI',
    description: '优先展示离地图中心更近的商家'
  },
  {
    key: 'rating',
    label: '高分优先',
    badge: '真实POI',
    description: '优先展示高德评分更高的商家'
  },
  {
    key: 'budget',
    label: '人均友好',
    badge: '真实POI',
    description: '优先展示人均价格更低的商家'
  },
  {
    key: 'student-demo',
    label: '学生热评榜',
    badge: '演示',
    description: '演示真实学生评价接入后的榜单形态'
  }
];

const getRankedRestaurants = (restaurants, activeKey) => {
  const list = [...restaurants];

  if (activeKey === 'distance') {
    return list.sort((a, b) => toNumber(a.distance, Infinity) - toNumber(b.distance, Infinity));
  }

  if (activeKey === 'rating') {
    return list.sort((a, b) => toNumber(b.rating, 0) - toNumber(a.rating, 0));
  }

  if (activeKey === 'budget') {
    return list.sort((a, b) => toNumber(a.avgPrice, Infinity) - toNumber(b.avgPrice, Infinity));
  }

  if (activeKey === 'student-demo') {
    return list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  return list.sort((a, b) => {
    const scoreA = toNumber(a.rating, 0) * 20 - toNumber(a.distance, 3000) / 120 - toNumber(a.avgPrice, 60) / 4;
    const scoreB = toNumber(b.rating, 0) * 20 - toNumber(b.distance, 3000) / 120 - toNumber(b.avgPrice, 60) / 4;
    return scoreB - scoreA;
  });
};

const RankingPanel = ({ restaurants, onRestaurantSelect }) => {
  const [activeKey, setActiveKey] = useState('recommended');
  const activeRanker = rankers.find((ranker) => ranker.key === activeKey) || rankers[0];

  const rankedRestaurants = useMemo(
    () => getRankedRestaurants(restaurants, activeKey).slice(0, 8),
    [restaurants, activeKey]
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {rankers.map((ranker) => (
          <button
            key={ranker.key}
            type="button"
            onClick={() => setActiveKey(ranker.key)}
            className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeKey === ranker.key
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primaryHover'
            }`}
          >
            {ranker.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-brand-primarySoft bg-brand-primarySubtle px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand-primary" />
          <span className="text-sm font-semibold text-brand-primaryHover">{activeRanker.label}</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-brand-primaryHover">
            {activeRanker.badge}
          </span>
        </div>
        <p className="mt-1 text-sm text-brand-primaryHover">{activeRanker.description}</p>
      </div>

      {rankedRestaurants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm font-medium text-gray-700">暂无可排行商家</p>
          <p className="mt-1 text-sm text-gray-500">等待地图加载真实餐饮 POI 后自动生成榜单。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankedRestaurants.map((restaurant, index) => (
            <button
              key={`${activeKey}-${restaurant.id}`}
              type="button"
              onClick={() => onRestaurantSelect(restaurant)}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-primarySoft hover:bg-brand-primarySubtle hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <div className="flex gap-4">
                <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-base font-bold ${
                  index < 3 ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-gray-900">{restaurant.name}</h3>
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">{restaurant.location}</p>
                    </div>
                    {activeKey === 'student-demo' && (
                      <span className="flex-none rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        演示热度 {demoHeat[index] || 20}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-brand-warning" />
                      {restaurant.rating || '暂无评分'}
                    </span>
                    <span>{formatAveragePrice(restaurant.avgPrice)}</span>
                    <span>{formatPriceLevel(restaurant.priceLevel)}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {formatDistance(restaurant.distance)}
                    </span>
                    {activeKey === 'student-demo' && (
                        <span className="flex items-center gap-1 text-brand-primary">
                        <Users className="h-4 w-4" />
                        待接入真实学生评价
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RankingPanel;
