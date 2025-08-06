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
      title: 'Manajemen Pengguna',
      description: 'Manajemen akun admin, staf, dan pasien yang komprehensif dengan kontrol akses berbasis peran.'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Pelacakan Pemeriksaan',
      description: 'Riwayat pemeriksaan pasien lengkap dengan catatan detail dan pelacakan status.'
    },
    {
      icon: UserGroupIcon,
      title: 'Penugasan Staf',
      description: 'Menugaskan pasien kepada staf tertentu secara efisien untuk pengiriman perawatan yang optimal.'
    },
    {
      icon: ChartBarIcon,
      title: 'Dashboard Real-time',
      description: 'Pemantauan langsung dan analitik dengan wawasan dan pelaporan yang komprehensif.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Admin membuat akun staf dan pasien',
      description: 'Administrator sistem dapat dengan mudah membuat dan mengelola akun pengguna untuk staf dan pasien Shiyam.'
    },
    {
      number: '02',
      title: 'Staf ditugaskan kepada pasien tertentu',
      description: 'Anggota staf Shiyam ditugaskan kepada pasien berdasarkan spesialisasi dan ketersediaan.'
    },
    {
      number: '03',
      title: 'Staf memasukkan data pemeriksaan pasien',
      description: 'Staf medis dapat mencatat catatan pemeriksaan detail, tanda vital, dan informasi perawatan.'
    },
    {
      number: '04',
      title: 'Admin memantau semua data melalui dashboard',
      description: 'Pemantauan real-time dan analitik memberikan pengawasan komprehensif terhadap semua aktivitas Shiyam.'
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
                  alt="Logo Shiyam" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Shiyam Manager</span>
            </div>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Sistem Manajemen
              <span className="block text-blue-600">Aplikasi Shiyam</span>
            </h1>
            {/* <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Sederhanakan data pasien, manajemen staf, dan pelacakan pemeriksaan dengan platform manajemen Shiyam komprehensif yang dirancang untuk fasilitas medis modern.
            </p> */}
            <Link
              to="/login"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-medium rounded-md hover:bg-blue-700 transition-colors group"
            >
              Login Admin
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
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Manajemen Pengguna</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Kelola semua pengguna sistem</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <ClipboardDocumentCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pemeriksaan</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Lacak pemeriksaan pasien</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Analitik</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Wawasan real-time</p>
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
              Manajemen Shiyam Komprehensif
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform kami menyediakan semua alat yang Anda butuhkan untuk mengelola operasi Shiyam secara efisien
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
              Cara Kerja
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alur kerja sederhana yang dirancang untuk profesional Shiyam
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
                  alt="Logo Shiyam" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="ml-3 text-xl font-semibold">Shiyam Manager</span>
            </div>
            <p className="text-gray-400 mb-6">
              Sistem manajemen Shiyam profesional untuk fasilitas medis modern
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">
                © 2025 Shiyam Manager. Semua hak dilindungi. | oleh{' '}
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