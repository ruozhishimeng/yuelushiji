import { MapPin, Mic, Shuffle, Star, Utensils, Users, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  formatAveragePrice,
  formatDistance
} from '../lib/restaurants/display';

const VOICE_BAR_HEIGHTS = [22, 34, 46, 30, 40];

const DEMO_TRANSCRIPT = '正在解析你的美食需求...';

const AIAssistant = ({ isOpen, restaurants = [], onClose, onRestaurantSelect, onMatchingOpen }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('food');

  useEffect(() => {
    if (isOpen) {
      setExpanded(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isListening) return undefined;

    const timer = setTimeout(() => {
      setTranscript(DEMO_TRANSCRIPT);
      setIsListening(false);
      setShowResult(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isListening]);

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('');
    setShowResult(false);
    setExpanded(true);
  };

  const handleClose = () => {
    setIsListening(false);
    setTranscript('');
    setShowResult(false);
    setExpanded(false);
    onClose();
  };

  const handleRestaurantClick = (restaurant) => {
    onRestaurantSelect(restaurant);
    handleClose();
  };

  const handleRandomRestaurant = () => {
    if (restaurants.length === 0) return;
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    handleRestaurantClick(restaurants[randomIndex]);
  };

  const handleMatchingClick = () => {
    onMatchingOpen({ source: "ai", targetRestaurant: null, initialView: "composer" });
    handleClose();
  };

  const recommendedRestaurants = useMemo(
    () => [...restaurants]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4),
    [restaurants]
  );

  if (!isOpen) return null;

  const isExpanded = expanded || isOpen;

  return (
    <div className="fixed bottom-28 left-1/2 z-50 w-[calc(100vw-32px)] max-w-96 -translate-x-1/2">
      <div className={`bg-brand-paperSoft rounded-2xl shadow-xl transition-all duration-200 ease-out overflow-hidden ${
        isExpanded ? 'w-full h-auto p-4' : 'mx-auto h-16 w-16'
      }`}>
        {!isExpanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="w-full h-full flex items-center justify-center bg-brand-paperSoft rounded-2xl hover:bg-brand-paper transition-colors"
          >
            <Mic className="w-6 h-6 text-brand-primary" />
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">AI 语音助手</h3>
                <span className="px-2 py-0.5 bg-brand-paper text-gray-500 text-xs rounded-full">演示功能</span>
              </div>
              <button
                onClick={handleClose}
                aria-label="关闭 AI 语音助手"
                className="p-1 hover:bg-brand-paper rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex bg-brand-paper rounded-xl p-1">
              <button
                onClick={() => setActiveTab('food')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'food'
                    ? 'bg-brand-paperSoft text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span className="text-sm font-medium">智选美食</span>
              </button>
              <button
                onClick={() => setActiveTab('matching')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'matching'
                    ? 'bg-brand-paperSoft text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">寻找搭子</span>
              </button>
            </div>

            {activeTab === 'food' && (
              <>
                {isListening && (
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-brand-primary rounded-full animate-pulse"
                          style={{
                            height: `${VOICE_BAR_HEIGHTS[i]}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '1.5s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  {isListening ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">正在听你说...</p>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : showResult ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-brand-paper rounded-lg border border-brand-paperDeep">
                        <p className="text-sm text-brand-primary font-medium mb-1">识别结果：</p>
                        <p className="text-gray-800 text-sm">{transcript}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">为您推荐：</p>
                        {recommendedRestaurants.length > 0 ? (
                          <div className="space-y-2">
                            {recommendedRestaurants.map((restaurant) => (
                              <button
                                key={restaurant.id}
                                type="button"
                                className="w-full rounded-lg border border-brand-paperDeep bg-brand-paper p-3 text-left transition-colors hover:bg-brand-primarySubtle focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                onClick={() => handleRestaurantClick(restaurant)}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h4 className="truncate text-sm font-semibold text-gray-900">{restaurant.name}</h4>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {formatDistance(restaurant.distance)}
                                      <span>·</span>
                                      {formatAveragePrice(restaurant.avgPrice)}
                                    </p>
                                  </div>
                                  <span className="flex flex-none items-center gap-1 text-xs font-semibold text-amber-700">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    {restaurant.rating || '暂无'}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-brand-paper rounded-lg border border-brand-paperDeep">
                            <p className="text-sm text-gray-600">正在等待真实商家 POI 数据，进入地图页后也会继续刷新。</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">正在倾听您的需求...</p>
                      <div className="space-y-2">
                        <div className="p-2 bg-brand-paper rounded-lg">
                          <p className="text-xs text-gray-600">试试说：&ldquo;帮我找找天马附近评分最高的湘菜&rdquo;</p>
                        </div>
                        <div className="p-2 bg-brand-paper rounded-lg">
                          <p className="text-xs text-brand-primaryHover">智选会优先使用当前真实地图 POI，不生成虚构商家。</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-3">
                  {!isListening && !showResult && (
                    <button
                      onClick={handleStartListening}
                      className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white rounded-full hover:bg-brand-primaryHover transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>开始说话</span>
                    </button>
                  )}

                  {showResult && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleStartListening}
                        className="flex items-center space-x-1 px-3 py-2 border border-brand-primary text-brand-primary rounded-full hover:bg-brand-primarySubtle transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <Mic className="w-3 h-3" />
                        <span>重新识别</span>
                      </button>
                      <button
                        onClick={handleRandomRestaurant}
                        disabled={restaurants.length === 0}
                        className="px-3 py-2 bg-brand-primary text-white rounded-full hover:bg-brand-primaryHover transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                      >
                        随机智选
                      </button>
                    </div>
                  )}
                </div>

                {!isListening && !showResult && (
                  <button
                    type="button"
                    onClick={handleRandomRestaurant}
                    disabled={restaurants.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-primarySoft bg-brand-paper py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primarySoft disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <Shuffle className="h-4 w-4" />
                    从真实商家里随机智选
                  </button>
                )}
              </>
            )}

            {activeTab === 'matching' && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">先配置偏好，再看附近谁在等搭子</p>
                  <p className="text-xs text-gray-500">从这里会直接进入搭一搭配置界面，不再停留空白入口页</p>
                </div>

                <button
                  onClick={handleMatchingClick}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  <Users className="w-5 h-5" />
                  <span>去配置搭一搭</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
