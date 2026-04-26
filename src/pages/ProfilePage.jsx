import { Award, Camera, Check, Clock, Compass, Edit3, Heart, MapPin, MessageSquare, Settings, Star, Users, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  demoBadges,
  demoFavorites,
  demoMatchingHistory,
  demoRecentVisits,
  demoUser,
  demoUserActivity,
  demoUserStats
} from '../mocks/demoData';
import { formatAveragePrice, formatDistance, formatReviewCount } from '../lib/restaurants/display';

const ProfilePage = ({ restaurants = [], onRestaurantSelect }) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const popupRef = useRef(null);

  const [editName, setEditName] = useState(demoUser.name);
  const [editSchool, setEditSchool] = useState(demoUser.school);
  const [editAvatar, setEditAvatar] = useState('');
  const [saved, setSaved] = useState(false);

  // 我的收藏：从真实高德POI中筛选已收藏的
  const realFavorites = restaurants.filter(r => r.isFavorite);
  // 最近光临：从真实POI中取visitCount>0的，fallback到demo
  const realVisits = restaurants.filter(r => typeof r.visitCount === 'number' && r.visitCount > 0);
  const recentVisits = realVisits.length > 0 ? realVisits : demoRecentVisits;
  const displayList = activeTab === 'favorites'
    ? (realFavorites.length > 0 ? realFavorites : demoFavorites)
    : recentVisits;

  // 点击外部关闭编辑弹窗
  useEffect(() => {
    if (!showEditPopup) return;
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowEditPopup(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowEditPopup(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showEditPopup]);

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setShowEditPopup(false);
  };

  const handleCardClick = (restaurant) => {
    if (onRestaurantSelect && restaurant.coordinates) {
      onRestaurantSelect(restaurant);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-y-auto bg-brand-paper pb-32">
      <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 lg:px-8">

        {/* 悬浮头部 */ }
        <div className="relative">
          <div className="flex flex-col">
            <div className="relative inline-block self-start">
              <img
                src="/assets/ME.png"
                alt="我的"
                className="h-[216px] w-auto object-contain"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-brand-paper/70" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-brand-paper/80 to-transparent" />
            </div>
            <p className="mt-1 text-sm text-gray-500">当前为演示数据</p>
          </div>

          {/* 个人资料编辑入口 */ }
          <button
            onClick={() => setShowEditPopup(prev => !prev)}
            aria-label="编辑个人资料"
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-brand-paperSoft hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* 悬浮编辑小窗 */ }
          {showEditPopup && (
            <div
              ref={popupRef}
              className="absolute right-0 top-12 z-[100] w-72 rounded-2xl border border-brand-paperDeep bg-brand-paperSoft p-4 shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">编辑个人资料</h3>
                <button
                  onClick={() => setShowEditPopup(false)}
                  aria-label="关闭"
                  className="rounded-lg p-1 text-gray-400 hover:bg-brand-paper hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 头像编辑 */ }
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-white shadow-sm">
                  {editAvatar ? (
                    <img src={editAvatar} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    editName.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500">头像链接</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="输入图片URL"
                    className="mt-1 w-full rounded-lg border border-brand-paperDeep bg-brand-paper px-3 py-1.5 text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              {/* 昵称 */ }
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-500">昵称</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={20}
                  className="mt-1 w-full rounded-lg border border-brand-paperDeep bg-brand-paper px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* 学校 */ }
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-500">学校</label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-brand-paperDeep bg-brand-paper px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* 认证状态 */ }
              <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-paper px-3 py-2">
                <span className="text-xs text-gray-600">学生认证状态</span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">演示认证</span>
              </div>

              <button
                onClick={handleSaveProfile}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryHover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    已保存
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    保存修改
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 用户头像区 悬浮无卡片 */ }
        <div className="mt-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white shadow-sm">
              {editName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-950">{editName}</h2>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  演示认证
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{editSchool}</p>
            </div>
          </div>

          {/* 粉丝/点赞/关注 + 品食段位 */ }
          <div className="mt-4 flex items-center justify-between border-b border-brand-paperDeep pb-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Users className="h-4 w-4 text-gray-400" />
                <strong className="text-gray-900">{demoUserStats.fans}</strong> 粉丝
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <Heart className="h-4 w-4 text-rose-400" />
                <strong className="text-gray-900">{demoUserStats.likes}</strong> 点赞
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <Users className="h-4 w-4 text-blue-400" />
                <strong className="text-gray-900">{demoUserStats.following}</strong> 关注
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">{demoUserStats.foodieTier}</span>
            </div>
          </div>
        </div>

        {/* 打卡·评价·探店 统计 */ }
        <section className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-brand-paperSoft px-4 py-3 text-center">
            <Camera className="mx-auto mb-1.5 h-5 w-5 text-brand-primary" />
            <div className="text-xl font-bold text-gray-900">{demoUserActivity.checkInCount}</div>
            <div className="text-xs text-gray-500">打卡数量</div>
          </div>
          <div className="rounded-2xl bg-brand-paperSoft px-4 py-3 text-center">
            <MessageSquare className="mx-auto mb-1.5 h-5 w-5 text-brand-primary" />
            <div className="text-xl font-bold text-gray-900">{demoUserActivity.reviewCount}</div>
            <div className="text-xs text-gray-500">评价数量</div>
          </div>
          <div className="rounded-2xl bg-brand-paperSoft px-4 py-3 text-center">
            <Compass className="mx-auto mb-1.5 h-5 w-5 text-brand-primary" />
            <div className="text-xl font-bold text-gray-900">{demoUserActivity.exploreCount}</div>
            <div className="text-xs text-gray-500">探店总数</div>
          </div>
        </section>

        {/* 搭一搭历史 + 我的勋章 */ }
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl bg-brand-paperSoft p-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Users className="h-5 w-5 text-brand-primary" />
              搭一搭历史
              <span className="ml-auto rounded-full bg-brand-primarySoft px-2 py-0.5 text-xs text-brand-primary">
                {demoMatchingHistory.length}
              </span>
            </h2>
            <div className="mt-3 space-y-2">
              {demoMatchingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-brand-paper px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-gray-800">{item.restaurant}</p>
                    <p className="text-xs text-gray-500">{item.matchedWith} · {item.date}</p>
                  </div>
                  <span className={`ml-2 flex-none rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-brand-paperSoft p-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Award className="h-5 w-5 text-amber-500" />
              我的勋章
              <span className="ml-auto rounded-full bg-brand-primarySoft px-2 py-0.5 text-xs text-brand-primary">
                {demoBadges.filter(b => b.earned).length}/{demoBadges.length}
              </span>
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {demoBadges.map((badge) => (
                <div
                  key={badge.id}
                  title={badge.description}
                  className={`aspect-square rounded-xl p-2 text-center transition-colors ${
                    badge.earned
                      ? 'border border-brand-primarySoft bg-brand-paper'
                      : 'border border-brand-paperDeep bg-brand-paper opacity-60'
                  }`}
                >
                  <badge.icon
                    className={`mx-auto h-6 w-6 ${
                      badge.earned ? 'text-brand-primary' : 'text-gray-400'
                    }`}
                  />
                  <span className={`mt-1 block text-xs font-medium ${
                    badge.earned ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 我的收藏 / 最近光临 */ }
        <section className="mt-4 rounded-2xl bg-brand-paperSoft p-4">
          <div className="mb-4 flex rounded-xl bg-brand-paper p-1">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'favorites'
                  ? 'bg-brand-paperSoft text-brand-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className={`mr-1.5 inline-block h-4 w-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
              我的收藏
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'visits'
                  ? 'bg-brand-paperSoft text-brand-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="mr-1.5 inline-block h-4 w-4" />
              最近光临
            </button>
          </div>

          {displayList.length === 0 ? (
            <div className="py-12 text-center">
              <Heart className="mx-auto mb-2 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">
                {activeTab === 'favorites' ? '暂无收藏的餐厅' : '暂无到店记录'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-paperDeep">
              {displayList.map((restaurant) => (
                <div
                  key={restaurant.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(restaurant)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(restaurant);
                    }
                  }}
                  className="flex min-h-[88px] cursor-pointer items-center gap-3 px-1 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-brand-primarySubtle/30 focus:outline-none focus-visible:bg-brand-primarySubtle/30"
                >
                  <div className="h-[72px] w-[72px] flex-none overflow-hidden rounded-lg bg-brand-paper">
                    {restaurant.photos && restaurant.photos.find(Boolean) ? (
                      <img
                        src={restaurant.photos.find(Boolean)}
                        alt={restaurant.name}
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

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">
                      {restaurant.name}
                    </h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                      <span className="flex items-center gap-0.5 font-medium text-gray-700">
                        <Star className="h-3.5 w-3.5 fill-current text-brand-warning" />
                        {restaurant.rating || '暂无评分'}
                      </span>
                      <span className="text-gray-400">{formatReviewCount(restaurant)}</span>
                      <span className="font-semibold text-brand-primary">
                        {formatAveragePrice(restaurant.avgPrice)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3.5 w-3.5 flex-none" />
                      <span className="line-clamp-1">
                        {formatDistance(restaurant.distance)} · {restaurant.location}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {(restaurant.tags || []).slice(0, 2).map((tag, i) => (
                        <span
                          key={`${restaurant.id}-${i}`}
                          className="rounded-full bg-brand-paper px-2 py-0.5 text-[11px] font-medium text-brand-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-none flex-col items-center">
                    <span className="text-lg font-bold text-brand-primary">
                      {restaurant.visitCount || 0}
                    </span>
                    <span className="text-[11px] text-gray-400">去过</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;