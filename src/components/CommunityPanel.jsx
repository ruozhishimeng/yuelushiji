import { Clock, MessageCircle, ShieldCheck, Star } from 'lucide-react';
import React from 'react';
import { demoCommunityReviews } from '../mocks/demoData';

const CommunityPanel = () => {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">最新评价流</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-blue-700">
            演示功能
          </span>
        </div>
        <p className="mt-1 text-sm text-blue-700">
          当前展示演示评价样式，正式版将读取真实学生 Review，不进入现有商家评分计算。
        </p>
      </div>

      <div className="space-y-4">
        {demoCommunityReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {review.author.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{review.author}</h3>
                    <span className="text-sm text-gray-500">{review.school}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <ShieldCheck className="h-3 w-3" />
                      {review.verification}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{review.timeAgo}</span>
                    <span>·</span>
                    <span>{review.restaurantName}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-none items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
                <Star className="h-4 w-4 fill-current" />
                {review.rating}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-700">{review.content}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CommunityPanel;
