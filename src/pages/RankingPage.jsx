import React from 'react';
import RankingPanel from '../components/RankingPanel';

const RankingPage = ({ restaurants, poiLoading, onRestaurantSelect }) => {
  return (
    <main className="min-h-dvh overflow-y-auto bg-brand-paper pb-32">
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col items-center">
          <img
            src="/assets/ranking.png"
            alt="大学城榜单"
            className="h-36 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-gray-500">基于真实地图 POI 的前端榜单</p>
        </header>

        {poiLoading && restaurants.length === 0 ? (
          <div className="rounded-xl border border-brand-paperDeep bg-brand-paperSoft p-8 text-center text-sm text-gray-500">
            正在加载真实商家数据...
          </div>
        ) : (
          <RankingPanel
            restaurants={restaurants}
            onRestaurantSelect={onRestaurantSelect}
          />
        )}
      </div>
    </main>
  );
};

export default RankingPage;
