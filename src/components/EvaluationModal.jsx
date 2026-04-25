import React, { useState } from 'react';
import { X, Star, Camera } from 'lucide-react';

const EvaluationModal = ({ restaurant, isOpen, onClose }) => {
  const [ratings, setRatings] = useState({
    taste: 0,
    environment: 0,
    service: 0
  });
  const [comment, setComment] = useState('');
  const [images] = useState([]);

  if (!isOpen || !restaurant) return null;

  const handleStarClick = (category, rating) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleAIGenerate = () => {
    setComment(`我在${restaurant.name}的真实体验：\n口味：\n环境：\n服务：\n价格/分量：\n是否推荐：`);
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
          i < currentRating ? 'text-brand-warning' : 'text-gray-300'
        } hover:text-brand-warning transition-colors focus:outline-none focus:ring-2 focus:ring-brand-warning`}
        aria-label={`${category} ${i + 1} 星`}
      >
        <Star className="w-full h-full fill-current" />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">打卡评价</h2>
          <button
            onClick={onClose}
            aria-label="关闭打卡评价"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6">
          {/* 餐厅信息 */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            {restaurant.photos?.[0] ? (
              <img
                src={restaurant.photos[0]}
                alt={restaurant.name}
                className="w-12 h-12 rounded-lg mx-auto object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-brand-primarySubtle text-brand-primary flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
            )}
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
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary transition-colors"
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
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
              />
              <button
                onClick={handleAIGenerate}
                className="absolute bottom-3 right-3 rounded-full bg-brand-info px-3 py-1 text-xs text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-brand-info"
              >
                生成模板
              </button>
            </div>
          </div>
        </div>

        {/* 底部提交按钮 */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primaryHover transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            发布评价
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
