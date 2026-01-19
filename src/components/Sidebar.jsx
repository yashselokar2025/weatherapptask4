import React from 'react';
import { Menu, Bell, Calendar, User, Settings } from 'lucide-react';

const Sidebar = ({ onSearchOpen }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/30 flex flex-col gap-4">
        <button 
          onClick={onSearchOpen}
          className="w-14 h-14 bg-white/30 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <button className="w-14 h-14 bg-white/30 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110">
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
        <button className="w-14 h-14 bg-white/30 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110">
          <Calendar className="w-6 h-6 text-gray-700" />
        </button>
        <button className="w-14 h-14 bg-white/30 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110">
          <User className="w-6 h-6 text-gray-700" />
        </button>
        <button className="w-14 h-14 bg-white/30 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110">
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
export default Sidebar;