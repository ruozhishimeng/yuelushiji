import React, { useState } from 'react';
import { X, User, MapPin, Settings, ChevronDown, ChevronRight, Award, Heart, Utensils, Building2 } from 'lucide-react';

const PersonalCenter = ({ isOpen, onClose }) => {
  const [expandedFootprint, setExpandedFootprint] = useState(false);
  const [selectedTaste, setSelectedTaste] = useState('不吃辣');
  const [selectedPrice, setSelectedPrice] = useState('20元以下');

  const userInfo = {
    name: '王同学',
    school: '中南大学',
    avatar: 'https://loremflickr.com/64/64/people?random=1'
  };

  // 社区标签数据
  const communityTags = ["热情E人", "湖南土著", "不排队会死星人"];

  // 勋章数据
  const badges = [
    { id: 1, name: '探店小王子', icon: Utensils, earned: true, description: '打卡超过10家不同店铺' },
    { id: 2, name: '辣椒专业户', icon: Heart, earned: true, description: '多次点赞香辣类菜品' },
    { id: 3, name: '食堂代言人', icon: Building2, earned: false, description: '多次在学校食堂区域打卡' },
    { id: 4, name: '早起鸟儿', icon: User, earned: false, description: '连续7天早餐打卡' },
    { id: 5, name: '夜猫子', icon: MapPin, earned: true, description: '深夜食堂打卡达人' },
    { id: 6, name: '社交达人', icon: Settings, earned: false, description: '成功匹配10次饭搭子' },
    { id: 7, name: '美食评论家', icon: Award, earned: false, description: '发表50条优质评价' },
    { id: 8, name: '省钱小能手', icon: Heart, earned: true, description: '发现超值美食店铺' },
    { id: 9, name: '导航专家', icon: MapPin, earned: false, description: '准确分享位置信息' }
  ];

  // 打卡足迹数据
  const footprintData = [
    { name: '堕子王烧烤', date: '2024-03-10' },
    { name: '中南大学鱼粉王', date: '2024-03-08' },
    { name: '麓山南路臭豆腐', date: '2024-03-05' },
    { name: '岳麓山脚剁椒鱼头', date: '2024-03-01' }
  ];

  const tasteOptions = ['不吃辣', '嗜辣如命', '清淡为主'];
  const priceOptions = ['20元以下', '20-50元', '50-100元'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">个人中心</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[80vh] p-6 space-y-6">
          {/* 个人信息与学生认证 */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <img
                src={userInfo.avatar}
                alt="用户头像"
                className="w-16 h-16 rounded-full mx-auto object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800">{userInfo.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    学生认证
                  </span>
                </div>
                <p className="text-gray-600">{userInfo.school}</p>
              </div>
            </div>
          </div>

          {/* 社区标签 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">社区标签</h4>
            <div className="flex flex-wrap gap-2">
              {communityTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 用餐偏好设置 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">用餐偏好</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">口味偏好</label>
                <div className="relative">
                  <select
                    value={selectedTaste}
                    onChange={(e) => setSelectedTaste(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  >
                    {tasteOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">价格区间</label>
                <div className="relative">
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  >
                    {priceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* 我的勋章 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">我的勋章</h4>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                    badge.earned
                      ? 'border-orange-200 bg-orange-50 hover:bg-orange-100'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <badge.icon
                    className={`w-6 h-6 mb-1 ${
                      badge.earned ? 'text-orange-500' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs text-center font-medium ${
                      badge.earned ? 'text-orange-700' : 'text-gray-500'
                    }`}
                  >
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 我的足迹 */}
          <div>
            <button
              onClick={() => setExpandedFootprint(!expandedFootprint)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">我的足迹</span>
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                  {footprintData.length}
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedFootprint ? 'rotate-90' : ''}`} />
            </button>
            
            {expandedFootprint && (
              <div className="mt-3 space-y-2">
                {footprintData.map((footprint, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <span className="text-gray-700">{footprint.name}</span>
                    <span className="text-sm text-gray-500">{footprint.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalCenter;
