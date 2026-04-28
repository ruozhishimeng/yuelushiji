import {
  Award, Building2, Camera, Check, Clock, Compass, Edit3, Heart,
  LogIn, MapPin, MessageSquare, Settings, Star, User, Users, Utensils, X
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { favoriteApi } from '../lib/api/favoriteApi';
import { formatAveragePrice, formatDistance, formatReviewCount } from '../lib/restaurants/display';
import { getMatchHistoryStatusMeta, MATCH_HISTORY_DEMO } from "../lib/demo/matchingData";

/* -------------------------------------------------------------------------- */
/*  勋章计算（纯前端，基于 user.stats）                                           */
/* -------------------------------------------------------------------------- */
const BADGE_DEFINITIONS = [
  { id: 1, name: '探店小王子', icon: Utensils, earn: (s) => s.checkinCount >= 10, desc: '打卡超过10家不同店铺' },
  { id: 2, name: '辣椒专业户', icon: Heart, earn: (s) => s.reviewCount >= 3, desc: '多次评价香辣类菜品' },
  { id: 3, name: '食堂代言人', icon: Building2, earn: (s) => s.checkinCount >= 20, desc: '多次在学校食堂区域打卡' },
  { id: 4, name: '早起鸟儿', icon: User, earn: (s) => s.checkinCount >= 7, desc: '连续打卡早餐' },
  { id: 5, name: '夜猫子', icon: MapPin, earn: (s) => s.checkinCount >= 5, desc: '深夜食堂打卡达人' },
  { id: 6, name: '社交达人', icon: Settings, earn: (s) => s.reviewCount >= 10, desc: '活跃互动达人' },
  { id: 7, name: '美食评论家', icon: Award, earn: (s) => s.reviewCount >= 5, desc: '发表过优质评价' },
  { id: 8, name: '省钱小能手', icon: Heart, earn: (s) => s.favoriteCount >= 3, desc: '收藏超值店铺' },
  { id: 9, name: '导航专家', icon: MapPin, earn: (s) => s.checkinCount >= 15, desc: '探索广泛区域' },
];

function computeBadges(stats = {}) {
  const s = { favoriteCount: 0, reviewCount: 0, checkinCount: 0, ...stats };
  return BADGE_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    icon: def.icon,
    earned: def.earn(s),
    description: def.desc,
  }));
}

function computeFoodieTier(stats = {}) {
  const { checkinCount = 0, reviewCount = 0 } = stats;
  if (checkinCount >= 50 || reviewCount >= 20) return '品食大师';
  if (checkinCount >= 20 || reviewCount >= 10) return '品食探索者';
  if (checkinCount >= 10 || reviewCount >= 5) return '品食学徒';
  if (checkinCount >= 3) return '新手食客';
  return '初来乍到';
}


/* -------------------------------------------------------------------------- */
/*  登录/注册 内联小卡片                                                         */
/* -------------------------------------------------------------------------- */
function MatchParticipantStack({ participants = [] }) {
  const visible = participants.slice(0, 3);
  const hiddenCount = Math.max(participants.length - visible.length, 0);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((participant) => (
          <div
            key={participant.id}
            className={(participant.avatarTone || "bg-brand-primarySoft text-brand-primary") + " flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-paper text-xs font-semibold shadow-sm"}
            title={participant.name}
          >
            {participant.avatarUrl ? (
              <img src={participant.avatarUrl} alt={participant.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              participant.name.slice(0, 1)
            )}
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <span className="ml-2 text-xs font-medium text-gray-500">+{hiddenCount}</span>
      )}
    </div>
  );
}

function LoginScreen({ onRegister, loading, error }) {
  const [nickname, setNickname] = useState('tcm');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) onRegister(nickname.trim());
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-paper px-4">
      <div className="w-full max-w-sm rounded-2xl bg-brand-paperSoft p-6 shadow-lg">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
            <User className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="font-ui-kaiti text-lg font-bold text-gray-900">登录后查看个人中心</h2>
          <p className="mt-1 text-sm text-gray-500">输入 <span className="font-semibold text-brand-primary">tcm</span> 进入演示账号，或输入新昵称注册</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="输入 tcm 进入演示账号"
            maxLength={20}
            autoFocus
            disabled={loading}
            className="w-full rounded-xl border border-brand-paperDeep bg-brand-paper px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          {error && <p className="text-center text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !nickname.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primaryHover disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? '登录中…' : '进入个人主页'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  ProfilePage 主组件                                                           */
/* ========================================================================== */
const ProfilePage = ({ onRestaurantSelect, onToggleFavorite }) => {
  const { user, loading: authLoading, register, refreshProfile, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('favorites');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const popupRef = useRef(null);

  // 本地编辑状态（Phase 1 仅本地保存）
  const [editName, setEditName] = useState('');
  const [editSchool, setEditSchool] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [saved, setSaved] = useState(false);

  // 收藏列表
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favError, setFavError] = useState(null);

  // 注册中
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState(null);

  /* ---- 同步 user 到本地编辑状态 ---- */
  useEffect(() => {
    if (user) {
      setEditName(user.nickname || '');
      setEditSchool(user.school || '');
      setEditAvatar(user.avatarUrl || '');
    }
  }, [user]);

  /* ---- 拉取收藏列表 ---- */
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    setFavoritesLoading(true);
    setFavError(null);
    try {
      const data = await favoriteApi.list();
      setFavorites(data.favorites || []);
    } catch (err) {
      setFavError(err.message);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  /* ---- 缓存 badges & foodieTier ---- */
  const stats = user?.stats || {};
  const badges = computeBadges(stats);
  const earnedBadges = badges.filter((b) => b.earned).length;
  const foodieTier = computeFoodieTier(stats);

  /* ---- 处理收藏切换 ---- */
  const handleToggleFavorite = async (restaurantId) => {
    if (onToggleFavorite) {
      await onToggleFavorite(restaurantId);
      // 从列表中移除
      setFavorites((prev) => prev.filter((f) => f.id !== restaurantId));
    }
  };

  /* ---- 注册 ---- */
  const handleRegister = async (nickname) => {
    setRegistering(true);
    setRegError(null);
    try {
      await register(nickname, '');
      await refreshProfile();
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  /* ---- 点击外部关闭弹窗 ---- */
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

  /* ---- 保存个人资料（本地） ---- */
  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setShowEditPopup(false);
  };

  /* ---- 卡片点击 ---- */
  const handleCardClick = (restaurant) => {
    if (onRestaurantSelect && restaurant.coordinates) {
      onRestaurantSelect(restaurant);
    }
  };

  /* ====== 加载态 ====== */
  if (authLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-brand-paper">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-brand-primary/30 border-t-brand-primary" />
          <p className="text-sm text-gray-500">正在加载…</p>
        </div>
      </main>
    );
  }

  /* ====== 未登录 ====== */
  if (!isAuthenticated) {
    return <LoginScreen onRegister={handleRegister} loading={registering} error={regError} />;
  }

  /* ====== 已登录：主页面 ====== */
  return (
    <main className="relative min-h-dvh overflow-y-auto bg-brand-paper pb-32">
      <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 lg:px-8">

        {/* ── 悬浮头部 ── */}
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
          </div>

          {/* 编辑入口 */}
          <button
            onClick={() => setShowEditPopup((prev) => !prev)}
            aria-label="编辑个人资料"
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-brand-paperSoft hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* 悬浮编辑小窗 */}
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

              {/* 头像编辑 */}
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

              {/* 昵称 */}
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

              {/* 学校 */}
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-500">学校</label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-brand-paperDeep bg-brand-paper px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* 认证状态 */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-paper px-3 py-2">
                <span className="text-xs text-gray-600">学生认证状态</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user?.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {user?.verificationStatus === 'verified' ? '已认证' : '未认证'}
                </span>
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

        {/* ── 用户头像区 ── */}
        <div className="mt-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white shadow-sm">
              {editAvatar ? (
                <img src={editAvatar} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                editName.charAt(0)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-950">{editName}</h2>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user?.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {user?.verificationStatus === 'verified' ? '已认证' : '未认证'}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{editSchool || '未填写学校'}</p>
            </div>
          </div>

          {/* 粉丝/点赞/关注 + 品食段位 */}
          <div className="mt-4 flex items-center justify-between border-b border-brand-paperDeep pb-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Users className="h-4 w-4 text-gray-400" />
                <strong className="text-gray-900">--</strong> 粉丝
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <Heart className="h-4 w-4 text-rose-400" />
                <strong className="text-gray-900">{stats.reviewCount || 0}</strong> 被赞
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <Users className="h-4 w-4 text-blue-400" />
                <strong className="text-gray-900">--</strong> 关注
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">{foodieTier}</span>
            </div>
          </div>
        </div>

        {/* ── 打卡·评价·探店 统计 ── */}
        <section className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-brand-paperSoft px-4 py-3 text-center">
            <Camera className="mx-auto mb-1.5 h-5 w-5 text-brand-primary" />
            <div className="text-xl font-bold text-gray-900">{stats.checkinCount || 0}</div>
            <div className="text-xs text-gray-500">打卡数量</div>
          </div>
          <div className="rounded-2xl bg-brand-paperSoft px-4 py-3 text-center">
            <MessageSquare className="mx-auto mb-1.5 h-5 w-5 text-brand-primary" />
            <div className="text-xl font-bold text-gray-900">{stats.reviewCount || 0}</div>
            <div className="text-xs text-gray-500">评价数量</div>
          </div>
          <div className="rounded-2xl bg-brand-paperSoft px-4 py-3 text-center">
            <Compass className="mx-auto mb-1.5 h-5 w-5 text-brand-primary" />
            <div className="text-xl font-bold text-gray-900">{stats.favoriteCount || 0}</div>
            <div className="text-xs text-gray-500">收藏总数</div>
          </div>
        </section>

        {/* ── 搭一搭历史 + 我的勋章 ── */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl bg-brand-paperSoft p-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Users className="h-5 w-5 text-brand-primary" />
              搭一搭历史
              <span className="ml-auto rounded-full bg-brand-primarySoft px-2 py-0.5 text-xs text-brand-primary">
                {MATCH_HISTORY_DEMO.length} 条演示
              </span>
            </h2>
            <div className="mt-4 space-y-3">
              {MATCH_HISTORY_DEMO.map((item) => {
                const statusMeta = getMatchHistoryStatusMeta(item.status);
                return (
                  <article key={item.id} className="rounded-2xl border border-brand-paperDeep bg-brand-paper px-3.5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <MatchParticipantStack participants={item.participants} />
                      <span className={statusMeta.badgeClass + " rounded-full px-2 py-0.5 text-[11px] font-medium"}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <MapPin className="h-4 w-4 text-brand-primary" />
                        <span>{item.restaurant}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{item.timeLabel}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{item.resultSummary}</p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 我的勋章 — computed */}
          <section className="rounded-2xl bg-brand-paperSoft p-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Award className="h-5 w-5 text-amber-500" />
              我的勋章
              <span className="ml-auto rounded-full bg-brand-primarySoft px-2 py-0.5 text-xs text-brand-primary">
                {earnedBadges}/{badges.length}
              </span>
            </h2>
            {badges.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
                <Award className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">暂无勋章</p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {badges.map((badge) => {
                  const IconComp = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      title={badge.description}
                      className={`flex aspect-square flex-col items-center justify-center rounded-xl p-2 text-center transition-colors ${
                        badge.earned
                          ? 'border border-brand-primarySoft bg-brand-paper'
                          : 'border border-brand-paperDeep bg-brand-paper opacity-60'
                      }`}
                    >
                      <IconComp
                        className={`mx-auto h-6 w-6 ${
                          badge.earned ? 'text-brand-primary' : 'text-gray-400'
                        }`}
                      />
                      <span className={`mt-1 block text-xs font-medium leading-tight ${
                        badge.earned ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {badge.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ── 我的收藏 / 最近光临 ── */}
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

          {/* 收藏 Tab */}
          {activeTab === 'favorites' && (
            <>
              {favoritesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary/30 border-t-brand-primary" />
                </div>
              ) : favError ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-red-500">加载失败：{favError}</p>
                  <button
                    onClick={fetchFavorites}
                    className="mt-2 text-sm text-brand-primary underline"
                  >
                    重试
                  </button>
                </div>
              ) : favorites.length === 0 ? (
                /* 收藏为空 */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Heart className="mb-2 h-10 w-10 text-gray-300" />
                  <p className="text-gray-500">还没有收藏，去地图上发现好店吧 🗺️</p>
                </div>
              ) : (
                <div className="divide-y divide-brand-paperDeep">
                  {favorites.map((restaurant) => (
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
                            {restaurant.distance ? formatDistance(restaurant.distance) + ' · ' : ''}{restaurant.address || restaurant.location || '未知位置'}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(restaurant.id);
                          }}
                          aria-label="取消收藏"
                          className="text-rose-400 transition-colors hover:text-rose-600"
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                        {onToggleFavorite && (
                          <span className="mt-0.5 text-[11px] text-gray-400">取消</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 最近光临 Tab — 空状态 */}
          {activeTab === 'visits' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="mb-2 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">还没有打卡记录，去附近探店吧 📍</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
