import React, { useState } from 'react';
import { User, MapPin, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import PersonalCenter from './PersonalCenter';
import { demoFootprints, demoUser } from '../mocks/demoData';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFootprint, setExpandedFootprint] = useState(false);
  const [showPersonalCenter, setShowPersonalCenter] = useState(false);

  const menuItems = [
    { 
      icon: MapPin, 
      label: '打卡足迹', 
      count: demoFootprints.length,
      hasSubmenu: true,
      submenu: demoFootprints
    },
    { icon: Settings, label: '设置', count: null }
  ];

  const handlePersonalCenterOpen = () => {
    setIsOpen(false);
    setShowPersonalCenter(true);
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          {/* 头像按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
              {demoUser.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {demoUser.name}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                  演示认证
                </span>
              </div>
              <p className="text-xs text-gray-500">{demoUser.school}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 下拉菜单 */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* 用户信息 */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    {demoUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">{demoUser.name}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                        演示认证
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{demoUser.school}</p>
                  </div>
                </div>
              </div>

              {/* 菜单项 */}
              <div className="py-2">
                <button
                  onClick={handlePersonalCenterOpen}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 text-left"
                >
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">个人中心</span>
                </button>
                
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() => item.hasSubmenu && setExpandedFootprint(!expandedFootprint)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.count && (
                          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                        {item.hasSubmenu && (
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedFootprint ? 'rotate-90' : ''}`} />
                        )}
                      </div>
                    </button>
                    
                    {/* 子菜单 */}
                    {item.hasSubmenu && expandedFootprint && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {item.submenu.map((footprint, subIndex) => (
                          <div key={subIndex} className="px-4 py-2 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{footprint.name}</span>
                              <span className="text-xs text-gray-500">{footprint.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 个人中心模态框 */}
      <PersonalCenter
        isOpen={showPersonalCenter}
        onClose={() => setShowPersonalCenter(false)}
      />
    </>
  );
};

export default UserProfile;
