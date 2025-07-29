import React from 'react';
import { Menu } from '@headlessui/react';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Shiyam Management System</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
              <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              <div className="hidden sm:block text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block w-full text-left px-3 sm:px-4 py-2 text-sm text-gray-700`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
};