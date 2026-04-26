import React, { useState } from 'react';
import { X, Users, Utensils, Search, MessageCircle, UserPlus, Compass, MapPin } from 'lucide-react';
import { demoMatchedUsers } from '../mocks/demoData';

const MatchingSystem = ({ isOpen, onClose, targetRestaurant = null }) => {
  const [currentStep, setCurrentStep] = useState('preferences');
  const [preferences, setPreferences] = useState({
    people: '2人',
    tastes: [],
    purpose: '聊天交友'
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);

  const peopleOptions = ['2人', '4人', '不限'];
  const tasteOptions = [
    { key: 'spicy', label: '辣', icon: '辣' },
    { key: 'mild', label: '清淡', icon: '淡' },
    { key: 'dessert', label: '甜点', icon: '甜' },
    { key: 'drink', label: '饮品', icon: '饮' }
  ];

  const purposeOptions = [
    { key: 'chat', label: '聊天交友', icon: MessageCircle, desc: '边吃边聊，扩展校友圈' },
    { key: 'explore', label: '组队探店', icon: Compass, desc: '新店打卡，分担排队压力' },
    { key: 'group', label: '大餐拼饭', icon: Utensils, desc: 'AA制吃大餐，拼单战友' }
  ];

  const handleTasteToggle = (taste) => {
    setPreferences(prev => ({
      ...prev,
      tastes: prev.tastes.includes(taste)
        ? prev.tastes.filter(item => item !== taste)
        : [...prev.tastes, taste]
    }));
  };

  const handleStartMatching = () => {
    setCurrentStep('matching');
    setIsMatching(true);

    setTimeout(() => {
      setMatchedUsers(demoMatchedUsers);
      setIsMatching(false);
      setCurrentStep('result');
    }, 1200);
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
      <div className="bg-brand-paperSoft/95 backdrop-blur-md rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-800">搭一搭</h2>
                <span className="px-2 py-0.5 bg-brand-paper text-gray-500 text-xs rounded-full">演示功能</span>
              </div>
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
            aria-label="关闭饭搭子匹配"
            className="p-2 hover:bg-brand-paper rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

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
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-brand-paper text-gray-700 hover:bg-brand-paperDeep'
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
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-brand-paper text-gray-700 hover:bg-brand-paperDeep'
                      }`}
                    >
                      <span className="text-sm font-semibold">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">我想找...</h3>
                <div className="space-y-3">
                  {purposeOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setPreferences(prev => ({ ...prev, purpose: option.label }))}
                      className={`w-full py-4 px-4 rounded-2xl font-medium text-left transition-all duration-300 ${
                        preferences.purpose === option.label
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-brand-paper text-gray-700 hover:bg-brand-paperDeep'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className={`text-sm ${
                            preferences.purpose === option.label ? 'text-teal-50' : 'text-gray-500'
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
                className="w-full py-4 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primaryHover transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                开始演示匹配
              </button>
            </div>
          )}

          {currentStep === 'matching' && (
            <div className="text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-brand-primary rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-teal-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-4 border-4 border-teal-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 text-brand-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {isMatching ? '正在演示匹配...' : '匹配成功！'}
              </h3>
              <p className="text-gray-600">
                {targetRestaurant
                  ? `正在为你寻找同样想吃${targetRestaurant.name}的饭搭子`
                  : '真实匹配服务待接入，当前使用演示数据'
                }
              </p>
            </div>
          )}

          {currentStep === 'result' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">演示匹配成功</h3>
                <p className="text-gray-600">为你展示了 {matchedUsers.length} 个演示饭搭子</p>
              </div>

              {matchedUsers.map(user => (
                <div key={user.id} className="bg-brand-paper rounded-2xl p-4 animate-slide-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{user.name}</h4>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{user.school}</span>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          {user.matchRate}%匹配
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {targetRestaurant ? `也想吃${targetRestaurant.name}` : '演示共同目标'}
                      </p>
                      <div className="flex space-x-1">
                        {user.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-brand-primarySoft text-brand-primary px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary">
                      <MessageCircle className="w-4 h-4" />
                      <span>打个招呼</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-brand-primary text-brand-primary rounded-xl hover:bg-brand-primarySubtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary">
                      <UserPlus className="w-4 h-4" />
                      <span>加入群聊</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 border border-brand-paperDeep text-gray-700 rounded-xl hover:bg-brand-paper transition-colors"
                >
                  重新匹配
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primaryHover transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
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
