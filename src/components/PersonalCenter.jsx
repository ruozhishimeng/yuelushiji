import React, { useState } from 'react';
import { X, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import {
  demoBadges,
  demoCommunityTags,
  demoFootprints,
  demoPriceOptions,
  demoTasteOptions,
  demoUser
} from '../mocks/demoData';

const PersonalCenter = ({ isOpen, onClose }) => {
  const [expandedFootprint, setExpandedFootprint] = useState(false);
  const [selectedTaste, setSelectedTaste] = useState(demoTasteOptions[0]);
  const [selectedPrice, setSelectedPrice] = useState(demoPriceOptions[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800">个人中心</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">演示数据</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[80vh] p-6 space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
                {demoUser.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800">{demoUser.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    演示认证
                  </span>
                </div>
                <p className="text-gray-600">{demoUser.school}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">社区标签</h4>
            <div className="flex flex-wrap gap-2">
              {demoCommunityTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">用餐偏好</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">口味偏好</label>
                <div className="relative">
                  <select
                    value={selectedTaste}
                    onChange={(event) => setSelectedTaste(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  >
                    {demoTasteOptions.map(option => (
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
                    onChange={(event) => setSelectedPrice(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                  >
                    {demoPriceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">我的勋章</h4>
            <div className="grid grid-cols-3 gap-3">
              {demoBadges.map((badge) => (
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

          <div>
            <button
              onClick={() => setExpandedFootprint(!expandedFootprint)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">我的足迹</span>
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                  {demoFootprints.length}
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedFootprint ? 'rotate-90' : ''}`} />
            </button>

            {expandedFootprint && (
              <div className="mt-3 space-y-2">
                {demoFootprints.map((footprint, index) => (
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
