import React from 'react';

const MapSidebarHeader = () => (
  <div className="relative flex-none overflow-hidden bg-brand-paper h-36 sm:h-40">
    <img
      src="/assets/yuelu-sidebar-hero.png"
      alt="岳麓食纪山水题字"
      className="h-full w-full object-cover object-center"
      loading="eager"
    />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-brand-paperSoft/75 to-brand-paperSoft" />
    <div className="sr-only">
      岳麓食纪，发现大学城真实美食
    </div>
  </div>
);

export default MapSidebarHeader;