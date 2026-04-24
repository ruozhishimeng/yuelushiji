import React, { useState } from 'react';
import { X, Star, ThumbsUp, Camera, AlertTriangle } from 'lucide-react';

const ReviewModal = ({ restaurant, isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!isOpen || !restaurant) return null;

  const reviews = restaurant.recentReviews || [];

  const filterOptions = [
    { key: 'all', label: '全部', icon: null },
    { key: 'positive', label: '好评', icon: ThumbsUp },
    { key: 'withImages', label: '有图', icon: Camera },
    { key: 'negative', label: '避雷', icon: AlertTriangle }
  ];

  const filteredReviews = reviews.filter(review => {
    switch (activeFilter) {
      case 'positive':
        return review.rating >= 4;
      case 'withImages':
        return review.images?.length > 0;
      case 'negative':
        return review.rating <= 2;
      default:
        return true;
    }
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <span className="text-3xl font-bold text-orange-600">{restaurant.rating || '暂无'}</span>
                {restaurant.rating && (
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.floor(restaurant.rating))}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <span>真实学生评价待接入</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* 筛选标签 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === option.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.icon && <option.icon className="w-4 h-4" />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 评价列表 */}
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
          {filteredReviews.length > 0 ? filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {review.author?.charAt(0) || '评'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{review.author}</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  {/* 评价图片 */}
                  {review.images?.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="评价图片"
                          className="w-20 h-20 rounded-lg mx-auto object-cover"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* 点赞 */}
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{review.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">暂无真实学生评价</p>
              <p className="text-sm text-gray-400 mt-2">当前仅展示高德商家基础信息，打卡评价接入后会在这里展示。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
