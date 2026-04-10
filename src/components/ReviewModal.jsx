import React, { useState } from 'react';
import { X, Star, Filter, ThumbsUp, Camera, AlertTriangle } from 'lucide-react';

const ReviewModal = ({ restaurant, isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!isOpen || !restaurant) return null;

  // 模拟评价数据
  const reviews = [
    {
      id: 1,
      author: '湖大某同学',
      avatar: 'https://loremflickr.com/40/40/people?random=1',
      rating: 5,
      comment: '分量很足，剁椒鱼头绝了！鱼肉鲜嫩，汤汁浓郁，配菜也很丰富。环境不错，服务态度也很好，性价比超高！',
      date: '2024-03-10',
      images: ['https://loremflickr.com/100/100/food?random=1'],
      likes: 12,
      type: 'positive'
    },
    {
      id: 2,
      author: '中南小王',
      avatar: 'https://loremflickr.com/40/40/people?random=2',
      rating: 4,
      comment: '味道不错，就是人太多了要等位。建议错峰去，不然真的要等很久。老板人很好，会主动推荐招牌菜。',
      date: '2024-03-08',
      images: [],
      likes: 8,
      type: 'positive'
    },
    {
      id: 3,
      author: '师大小李',
      avatar: 'https://loremflickr.com/40/40/people?random=3',
      rating: 3,
      comment: '一般般吧，没有想象中那么好吃。价格倒是挺实惠的，就是味道普通，可能不会再去了。',
      date: '2024-03-05',
      images: [],
      likes: 3,
      type: 'neutral'
    },
    {
      id: 4,
      author: '湖大老张',
      avatar: 'https://loremflickr.com/40/40/people?random=4',
      rating: 2,
      comment: '避雷！服务态度很差，菜品也不新鲜。等了半个多小时才上菜，结果味道还不如食堂。不推荐！',
      date: '2024-03-01',
      images: [],
      likes: 15,
      type: 'negative'
    },
    {
      id: 5,
      author: '中南学姐',
      avatar: 'https://loremflickr.com/40/40/people?random=5',
      rating: 5,
      comment: '超级好吃！每次来堕落街都要来这家，老板人也很好，给的料特别足。强烈推荐剁椒鱼头！',
      date: '2024-02-28',
      images: ['https://loremflickr.com/100/100/food?random=2'],
      likes: 20,
      type: 'positive'
    }
  ];

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
        return review.images.length > 0;
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
                <span className="text-3xl font-bold text-orange-600">{restaurant.rating}</span>
                <div className="flex items-center space-x-1">
                  {renderStars(Math.floor(restaurant.rating))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span>味道: 4.2</span>
                <span className="mx-2">·</span>
                <span>环境: 4.0</span>
                <span className="mx-2">·</span>
                <span>服务: 4.1</span>
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
          {filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full mx-auto object-cover"
                />
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
                  {review.images.length > 0 && (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
