import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

const FloatingPanel = ({ isOpen, title, badge, description, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="fixed left-1/2 top-5 z-40 w-[calc(100vw-32px)] max-w-[720px] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md lg:left-[calc(50%+208px)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {badge && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              aria-label="关闭浮层"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[78vh] overflow-y-auto p-5">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingPanel;
