import { Clock, ShieldCheck, Star } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { demoHomeCircles, demoHomePosts } from '../mocks/demoData';

const HomePage = () => {
  const [activeCircle, setActiveCircle] = useState(demoHomeCircles[0]);
  const visiblePosts = useMemo(
    () => demoHomePosts.filter(post => post.circle === activeCircle),
    [activeCircle]
  );

  return (
    <main className="min-h-dvh overflow-y-auto bg-brand-paper pb-32">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col items-center">
          <img
            src="/assets/logo.png"
            alt="岳麓食纪"
            className="h-36 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-gray-500">大学城真实吃喝分享</p>
          <span className="mt-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            首页演示内容
          </span>
        </header>

        <section className="sticky top-0 z-10 -mx-4 mb-5 border-b border-brand-paperDeep bg-brand-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {demoHomeCircles.map((circle) => (
              <button
                key={circle}
                type="button"
                onClick={() => setActiveCircle(circle)}
                aria-pressed={activeCircle === circle}
                className={`flex h-11 flex-none items-center rounded-full px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  activeCircle === circle
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-brand-paperSoft text-gray-600 hover:bg-brand-primarySubtle hover:text-brand-primary'
                }`}
              >
                {circle}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-xl border border-brand-paperDeep bg-brand-paperSoft shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden bg-brand-paperDeep">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    演示
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {post.rating}
                  </span>
                </div>
                <h2 className="line-clamp-2 min-h-[44px] text-base font-semibold leading-snug text-gray-950">
                  {post.title}
                </h2>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
                  <div className="min-w-0">
                    <span className="font-medium text-gray-700">{post.author}</span>
                    <span className="mx-1">·</span>
                    <span>{post.school}</span>
                  </div>
                  <span className="flex flex-none items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.timeAgo}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-xl border border-brand-primarySoft bg-brand-paperSoft p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-primaryHover">
            <ShieldCheck className="h-4 w-4" />
            待接入真实学生评价
          </div>
          <p className="mt-1 text-sm text-brand-primaryHover">
            当前首页用于验证社区信息流形态，正式版只展示认证学生发布并通过审核的真实图文评价。
          </p>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
