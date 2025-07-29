import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: UserGroupIcon,
      title: 'User Management',
      description: 'Comprehensive admin, staff, and patient account management with role-based access control.'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Examination Tracking',
      description: 'Complete patient examination history with detailed notes and status tracking.'
    },
    {
      icon: UserGroupIcon,
      title: 'Staff Assignment',
      description: 'Efficiently assign patients to specific staff members for optimized care delivery.'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Dashboard',
      description: 'Live monitoring and analytics with comprehensive insights and reporting.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Admin creates staff and patient accounts',
      description: 'System administrators can easily create and manage user accounts for Shiyam staff and patients.'
    },
    {
      number: '02',
      title: 'Staff are assigned to specific patients',
      description: 'Shiyam staff members are assigned to patients based on specialization and availability.'
    },
    {
      number: '03',
      title: 'Staff input patient examination data',
      description: 'Medical staff can record detailed examination notes, vital signs, and treatment information.'
    },
    {
      number: '04',
      title: 'Admin monitors all data through dashboard',
      description: 'Real-time monitoring and analytics provide comprehensive oversight of all Shiyam activities.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/no-bg.png" 
                  alt="Shiyam Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Shiyam Manager</span>
            </div>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Patient Examination
              <span className="block text-blue-600">Management System</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Streamline patient data, staff management, and examination tracking with our comprehensive Shiyam management platform designed for modern medical facilities.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-medium rounded-md hover:bg-blue-700 transition-colors group"
            >
              Admin Login
              <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-12 sm:mt-16">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">User Management</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Manage all system users</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <ClipboardDocumentCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Examinations</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Track patient examinations</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Analytics</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Real-time insights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Shiyam Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to efficiently manage Shiyam operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple workflow designed for Shiyam professionals
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="flex-1">
                  <div className={`max-w-lg ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-blue-600 mr-4">{step.number}</span>
                      <CheckCircleIcon className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-6xl font-bold text-blue-200">{step.number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/no-bg.png" 
                  alt="Shiyam Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-3 text-xl font-semibold">Shiyam Manager</span>
            </div>
            <p className="text-gray-400 mb-6">
              Professional Shiyam management system for modern medical facilities
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">
                © 2025 Shiyam Manager. All rights reserved. | by{' '}
                <a 
                  href="https://www.instagram.com/dapz__/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  dapz__
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};