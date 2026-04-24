import { MessageCircle, Mic, Trophy } from 'lucide-react';
import React from 'react';

const actions = [
  { key: 'ranking', label: '榜单', icon: Trophy },
  { key: 'voice', label: '语音', icon: Mic },
  { key: 'community', label: '社区', icon: MessageCircle }
];

const BottomActionBar = ({ activePanel, onPanelChange }) => {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100vw-32px)] max-w-[360px] -translate-x-1/2">
      <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white/95 p-2 shadow-2xl backdrop-blur-md">
        {actions.map((action) => {
          const Icon = action.icon;
          const isActive = activePanel === action.key;

          return (
            <button
              key={action.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onPanelChange(isActive ? null : action.key)}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Icon className="h-5 w-5 flex-none" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomActionBar;
