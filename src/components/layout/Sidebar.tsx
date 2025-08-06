import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Manajemen Pengguna', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Daftar Pemeriksaan', href: '/dashboard/examinations', icon: ClipboardDocumentListIcon },
  { name: 'Manajemen Staf', href: '/dashboard/staff', icon: UserGroupIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-40 w-56 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen,
        }
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/no-bg.png" 
                  alt="Shiyam Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <span className="ml-2 text-sm sm:text-base font-semibold text-gray-900">Shiyam</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors h-10',
                      {
                        'bg-blue-50 text-blue-700 border-r-2 border-blue-700': isActive,
                        'text-gray-700 hover:text-gray-900 hover:bg-gray-50': !isActive,
                      }
                    )}
                  >
                    <item.icon
                      className={clsx(
                        'mr-2 h-4 w-4 flex-shrink-0',
                        {
                          'text-blue-500': isActive,
                          'text-gray-400 group-hover:text-gray-500': !isActive,
                        }
                      )}
                    />
                    <span className="flex-1 text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};