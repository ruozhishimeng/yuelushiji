import { Bot, Home, Map, Trophy, User } from 'lucide-react';
import React from 'react';

const navItems = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'map', label: '地图', icon: Map },
  { key: 'ranking', label: '榜单', icon: Trophy },
  { key: 'profile', label: '我的', icon: User }
];

const BottomActionBar = ({ activePage, onPageChange, onAiOpen, isAiOpen }) => {
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activePage === item.key;

    return (
      <button
        key={item.key}
        type="button"
        aria-pressed={isActive}
        aria-label={`切换到${item.label}`}
        onClick={() => onPageChange(item.key)}
        className={`flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
          isActive
            ? 'bg-brand-paper text-brand-primary'
            : 'text-gray-500 hover:bg-brand-paper hover:text-brand-primary'
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-ui-kaiti">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100vw-24px)] max-w-[520px] -translate-x-1/2 pb-[env(safe-area-inset-bottom)]" aria-label="底部主导航">
      <div className="relative rounded-2xl border border-brand-paperDeep bg-brand-paperSoft/95 px-2 py-2 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-[1fr_76px_1fr] items-center gap-2">
          <div className="flex min-w-0 gap-1">
            {leftItems.map(renderItem)}
          </div>

          <button
            type="button"
            aria-pressed={isAiOpen}
            aria-label={isAiOpen ? '关闭 AI 助手' : '打开 AI 助手'}
            onClick={onAiOpen}
            className={`relative mx-auto flex h-16 w-16 -translate-y-5 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
              isAiOpen
                ? 'bg-brand-primaryHover'
                : 'bg-gradient-to-br from-brand-primary via-teal-600 to-slate-900'
            }`}
          >
            <span className="absolute inset-0 rounded-2xl bg-white/10" />
            <Bot className="relative h-7 w-7" />
            <span className="font-ui-kaiti absolute -bottom-5 text-xs font-bold text-brand-primary">AI</span>
          </button>

          <div className="flex min-w-0 gap-1">
            {rightItems.map(renderItem)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomActionBar;
