import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Gemini Filters', path: '/filters', icon: 'smart_toy' },
    { name: 'Processing Logs', path: '/logs', icon: 'history' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
    { name: 'Setup Guide', path: '/setup', icon: 'help' },
  ];
  
  return (
    <aside className={cn(
      "w-full md:w-64 bg-white shadow-md z-10 md:h-screen md:flex md:flex-col",
      mobileOpen ? "block fixed inset-0" : "hidden md:block",
    )}>
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center">
          <img src="https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png" alt="Gmail Logo" className="h-8 w-auto mr-2" />
          <span className="text-xl font-medium text-neutral-900">ReadyReply</span>
        </div>
        <p className="text-neutral-600 text-sm mt-1">Gemini-powered email responses</p>
      </div>
      
      <nav className="p-2 flex-1 overflow-y-auto">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link 
                href={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center p-2 rounded-md",
                  isActive(item.path) 
                    ? "bg-neutral-100 text-blue-600" 
                    : "hover:bg-neutral-100 text-neutral-600 hover:text-blue-600"
                )}
              >
                <span className="material-icons mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {mobileOpen && (
        <div className="md:hidden p-4 border-t border-neutral-200">
          <button 
            onClick={onClose}
            className="w-full flex items-center justify-center p-2 bg-neutral-100 rounded-md text-neutral-600"
          >
            <span className="material-icons mr-2">close</span>
            Close Menu
          </button>
        </div>
      )}
    </aside>
  );
}
