import React, { useState } from 'react';
import { X, Star, Camera } from 'lucide-react';

const EvaluationModal = ({ restaurant, isOpen, onClose }) => {
  const [ratings, setRatings] = useState({
    taste: 0,
    environment: 0,
    service: 0
  });
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);

  if (!isOpen || !restaurant) return null;

  const handleStarClick = (category, rating) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleAIGenerate = () => {
    const aiComments = [
      `这家店在堕落街真的绝了，人均只要${restaurant.avgPrice}元，口味超地道，学长强烈推荐！`,
      `${restaurant.name}的招牌菜真的很棒，环境也不错，服务态度很好，性价比超高！`,
      `和朋友一起来${restaurant.name}，菜品分量很足，味道正宗，下次还会再来！`,
      `${restaurant.name}的${restaurant.hotDishes?.[0]?.name || '招牌菜'}真的很好吃，强烈推荐给大家！`
    ];
    
    const randomComment = aiComments[Math.floor(Math.random() * aiComments.length)];
    setComment(randomComment);
  };

  const handleSubmit = () => {
    // 这里可以添加提交评价的逻辑
    console.log('提交评价:', { ratings, comment, images });
    onClose();
  };

  const renderStars = (category, currentRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => handleStarClick(category, i + 1)}
        className={`w-8 h-8 ${
          i < currentRating ? 'text-yellow-500' : 'text-gray-300'
        } hover:text-yellow-500 transition-colors`}
      >
        <Star className="w-full h-full fill-current" />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">打卡评价</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6">
          {/* 餐厅信息 */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <img
              src={`https://loremflickr.com/60/60/restaurant?random=${restaurant.id}`}
              alt={restaurant.name}
              className="w-12 h-12 rounded-lg mx-auto object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.location}</p>
            </div>
          </div>

          {/* 评分区域 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">请为本次用餐体验评分</h3>
            
            {/* 口味评分 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">口味</span>
              <div className="flex space-x-1">
                {renderStars('taste', ratings.taste)}
              </div>
            </div>
            
            {/* 环境评分 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">环境</span>
              <div className="flex space-x-1">
                {renderStars('environment', ratings.environment)}
              </div>
            </div>
            
            {/* 服务评分 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">服务</span>
              <div className="flex space-x-1">
                {renderStars('service', ratings.service)}
              </div>
            </div>
          </div>

          {/* 拍照模块 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">添加图片</h3>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">添加图片</span>
                </div>
              ))}
            </div>
          </div>

          {/* 评价输入 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">写下你的评价</h3>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="分享你的用餐体验，帮助其他同学做出选择..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleAIGenerate}
                className="absolute bottom-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                AI 帮你评价
              </button>
            </div>
          </div>
        </div>

        {/* 底部提交按钮 */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
          >
            发布评价
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
