import { Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SORT_OPTIONS = [
  ['distance', '距离最近'],
  ['price', '价格最低'],
  ['rating', '评分最高']
];

const CATEGORY_OPTIONS = [
  ['all', '全部'],
  ['午饭', '午饭/晚饭'],
  ['奶茶', '奶茶/饮品'],
  ['快餐', '快餐/简餐'],
  ['长沙特色', '长沙特色']
];

const FilterMenu = ({ searchTerm, sortBy, activeCategory, onSearchChange, onSortChange, onCategoryFilter }) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleFilterChange = (key, value) => {
    if (key === 'sortBy') {
      onSortChange(value);
    } else if (key === 'category') {
      onCategoryFilter(value);
    }
    setShowFilterMenu(false);
  };

  useEffect(() => {
    if (!showFilterMenu) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowFilterMenu(false);
    };
    const handleClickOutside = (e) => {
      if (!e.target.closest('#filter-menu') && !e.target.closest('[aria-controls="filter-menu"]')) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFilterMenu]);

  return (
    <div className="relative z-30 flex-none border-b border-brand-paperDeep bg-brand-paperSoft p-4">
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索餐厅或美食..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-brand-paperDeep bg-brand-paperSoft py-3 pl-10 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              aria-expanded={showFilterMenu}
              aria-controls="filter-menu"
              aria-label="打开筛选菜单"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-brand-primarySubtle hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              title="筛选"
            >
              <Filter className="w-5 h-5" />
            </button>

            {showFilterMenu && (
              <div
                id="filter-menu"
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 bg-brand-paperSoft rounded-xl shadow-xl border border-brand-paperDeep overflow-hidden z-[1000]">
                <div className="p-2">
                  <h4 className="font-ui-kaiti mb-2 text-sm font-medium text-gray-700">排序方式</h4>
                  {SORT_OPTIONS.map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handleFilterChange('sortBy', value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        sortBy === value
                          ? 'bg-brand-primarySoft text-brand-primaryHover'
                          : 'hover:bg-brand-paper'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-brand-paperDeep p-2">
                  <h4 className="font-ui-kaiti mb-2 text-sm font-medium text-gray-700">状态筛选</h4>
                  <div className="px-3 py-2 rounded-lg text-sm text-gray-400">
                    待接入实时排队数据
                  </div>
                </div>

                <div className="border-t border-brand-paperDeep p-2">
                  <h4 className="font-ui-kaiti mb-2 text-sm font-medium text-gray-700">美食分类</h4>
                  <div className="space-y-1">
                    {CATEGORY_OPTIONS.map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => handleFilterChange('category', value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          activeCategory === value
                            ? 'bg-brand-primarySoft text-brand-primaryHover'
                            : 'hover:bg-brand-paper'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;