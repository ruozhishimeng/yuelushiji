import { Mic, X, Utensils, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DEMO_TRANSCRIPT = '正在解析你的美食需求...';
const DEMO_RECOMMENDATIONS = [];

const AIAssistant = ({ isOpen, onClose, onRestaurantSelect, onMatchingOpen }) => {
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

  const handleMatchingClick = () => {
    onMatchingOpen(null);
    handleClose();
  };

  if (!isOpen) return null;

  const isExpanded = expanded || isOpen;

  return (
    <div className="fixed bottom-28 left-1/2 z-50 w-[calc(100vw-32px)] max-w-96 -translate-x-1/2">
      <div className={`bg-white rounded-3xl shadow-xl transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'w-full h-auto p-4' : 'mx-auto h-16 w-16'
      }`}>
        {!isExpanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="w-full h-full flex items-center justify-center bg-white rounded-3xl hover:bg-gray-50 transition-colors"
          >
            <Mic className="w-6 h-6 text-orange-500" />
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">AI 语音助手</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">演示功能</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('food')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'food'
                    ? 'bg-white text-orange-500 shadow-sm'
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
                    ? 'bg-white text-orange-500 shadow-sm'
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
                          className="w-2 bg-orange-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 40 + 20}px`,
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
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : showResult ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-600 font-medium mb-1">识别结果：</p>
                        <p className="text-gray-800 text-sm">{transcript}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">为您推荐：</p>
                        {DEMO_RECOMMENDATIONS.length > 0 ? (
                          <div className="flex space-x-3 overflow-x-auto pb-2">
                            {DEMO_RECOMMENDATIONS.map((restaurant) => (
                              <div
                                key={restaurant.id}
                                className="flex-shrink-0 w-48 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-orange-50 transition-colors"
                                onClick={() => handleRestaurantClick(restaurant)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-gray-800 text-sm truncate">{restaurant.name}</h4>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-xs text-gray-600">{restaurant.rating}</span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600">{restaurant.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600">AI 推荐暂未接入真实商家数据，请先使用左侧搜索和地图商家。</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">正在倾听您的需求...</p>
                      <div className="space-y-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">试试说："帮我找找天马附近评分最高的湘菜"</p>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <p className="text-xs text-orange-700">真实商家数据已由地图搜索加载，AI 推荐后续再接入。</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-3">
                  {!isListening && !showResult && (
                    <button
                      onClick={handleStartListening}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm"
                    >
                      <Mic className="w-4 h-4" />
                      <span>开始说话</span>
                    </button>
                  )}

                  {showResult && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleStartListening}
                        className="flex items-center space-x-1 px-3 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors text-sm"
                      >
                        <Mic className="w-3 h-3" />
                        <span>重新识别</span>
                      </button>
                      <button
                        onClick={handleClose}
                        className="px-3 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm"
                      >
                        确定
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'matching' && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">寻找志同道合的饭搭子</p>
                  <p className="text-xs text-gray-500">演示入口，真实匹配服务待接入</p>
                </div>

                <button
                  onClick={handleMatchingClick}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  <span>开始搭一搭</span>
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
