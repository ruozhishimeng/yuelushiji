import React, { useState, useEffect } from 'react';
import { X, Users, Utensils, Coffee, IceCream, Search, MessageCircle, UserPlus, Compass, MapPin } from 'lucide-react';

const MatchingSystem = ({ isOpen, onClose, targetRestaurant = null }) => {
  const [currentStep, setCurrentStep] = useState('preferences'); // 'preferences', 'matching', 'result'
  const [preferences, setPreferences] = useState({
    people: '2人',
    tastes: [],
    purpose: '聊天交友'
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);

  const peopleOptions = ['2人', '4人', '不限'];
  const tasteOptions = [
    { key: 'spicy', label: '辣', icon: '🌶️' },
    { key: 'mild', label: '清淡', icon: '🥗' },
    { key: 'dessert', label: '甜点', icon: '🍰' },
    { key: 'drink', label: '饮品', icon: '🥤' }
  ];
  
  // 更新核心诉求选项
  const purposeOptions = [
    { key: 'chat', label: '聊天交友', icon: MessageCircle, desc: '边吃边聊，扩展校友圈' },
    { key: 'explore', label: '组队探店', icon: Compass, desc: '新店打卡，分担排队压力' },
    { key: 'group', label: '大餐拼饭', icon: Utensils, desc: 'AA制吃大餐，拼单战友' }
  ];

  // 模拟匹配到的用户数据
  const mockMatchedUsers = [
    {
      id: 1,
      name: '王同学',
      school: '湖南大学',
      avatar: 'https://loremflickr.com/60/60/people?random=1',
      commonGoal: targetRestaurant ? `也想吃${targetRestaurant.name}` : '堕落街烧烤',
      matchRate: 98,
      tags: ['不吃辣', 'E人']
    },
    {
      id: 2,
      name: '李同学',
      school: '中南大学',
      avatar: 'https://loremflickr.com/60/60/people?random=2',
      commonGoal: targetRestaurant ? `对${targetRestaurant.name}感兴趣` : '堕落街烧烤',
      matchRate: 92,
      tags: ['嗜辣如命', '社恐']
    }
  ];

  const handleTasteToggle = (taste) => {
    setPreferences(prev => ({
      ...prev,
      tastes: prev.tastes.includes(taste)
        ? prev.tastes.filter(t => t !== taste)
        : [...prev.tastes, taste]
    }));
  };

  const handleStartMatching = () => {
    setCurrentStep('matching');
    setIsMatching(true);
    
    // 模拟匹配过程
    setTimeout(() => {
      setMatchedUsers(mockMatchedUsers);
      setIsMatching(false);
      setCurrentStep('result');
    }, 3000);
  };

  const handleReset = () => {
    setCurrentStep('preferences');
    setPreferences({
      people: '2人',
      tastes: [],
      purpose: '聊天交友'
    });
    setMatchedUsers([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">搭一搭</h2>
              {/* 动态标题逻辑 */}
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <p className="text-sm text-gray-600">
                  {targetRestaurant 
                    ? `寻找${targetRestaurant.name}的饭搭子` 
                    : '寻找周边的饭搭子'
                  }
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {currentStep === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">人数选择</h3>
                <div className="flex space-x-3">
                  {peopleOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setPreferences(prev => ({ ...prev, people: option }))}
                      className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                        preferences.people === option
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">口味偏好</h3>
                <div className="grid grid-cols-2 gap-3">
                  {tasteOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => handleTasteToggle(option.key)}
                      className={`flex items-center space-x-2 py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                        preferences.tastes.includes(option.key)
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {/* 文案修改：核心诉求 -> 我想找... */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">我想找...</h3>
                <div className="space-y-3">
                  {purposeOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setPreferences(prev => ({ ...prev, purpose: option.label }))}
                      className={`w-full py-4 px-4 rounded-2xl font-medium text-left transition-all duration-300 ${
                        preferences.purpose === option.label
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className={`text-sm ${
                            preferences.purpose === option.label ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {option.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartMatching}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
              >
                开始匹配
              </button>
            </div>
          )}

          {currentStep === 'matching' && (
            <div className="text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-4 border-4 border-orange-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {isMatching ? '正在搜寻中...' : '匹配成功！'}
              </h3>
              <p className="text-gray-600">
                {targetRestaurant 
                  ? `正在为你寻找同样想吃${targetRestaurant.name}的饭搭子`
                  : '正在岳麓大学城搜索志同道合的人'
                }
              </p>
            </div>
          )}

          {currentStep === 'result' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">匹配成功！</h3>
                <p className="text-gray-600">为你找到了 {matchedUsers.length} 个饭搭子</p>
              </div>

              {matchedUsers.map(user => (
                <div key={user.id} className="bg-gray-50 rounded-2xl p-4 animate-slide-up">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full mx-auto object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{user.name}</h4>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{user.school}</span>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          {user.matchRate}%匹配
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.commonGoal}</p>
                      <div className="flex space-x-1">
                        {user.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>打个招呼</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 transition-colors">
                      <UserPlus className="w-4 h-4" />
                      <span>加入群聊</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  重新匹配
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  完成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingSystem;
