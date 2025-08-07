import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export const PrivacyPolicy: React.FC = () => {
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  const content = {
    id: {
      title: 'Kebijakan Privasi - Assiyam Diabetes Checker',
      lastUpdated: 'Terakhir diperbarui: 15 Januari 2025',
      sections: [
        {
          title: '1. Informasi yang Kami Kumpulkan',
          content: `Aplikasi Assiyam Diabetes Checker mengumpulkan informasi berikut:`,
          subsections: [
            {
              subtitle: '1.1 Informasi yang Anda Berikan',
              items: [
                'Data pribadi (nama, usia, riwayat kesehatan)',
                'Hasil pemeriksaan diabetes',
                'Riwayat penggunaan aplikasi'
              ]
            },
            {
              subtitle: '1.2 Informasi yang Dikumpulkan Otomatis',
              items: [
                'Data penggunaan aplikasi',
                'Informasi perangkat (model, sistem operasi)',
                'Log error dan performa aplikasi'
              ]
            }
          ]
        },
        {
          title: '2. Bagaimana Kami Menggunakan Informasi',
          content: `Kami menggunakan informasi yang dikumpulkan untuk:`,
          items: [
            'Menyediakan layanan pemeriksaan diabetes',
            'Meningkatkan akurasi diagnosis AI',
            'Memperbaiki performa aplikasi',
            'Memberikan dukungan teknis'
          ]
        },
        {
          title: '3. Berbagi Informasi',
          content: `Kami TIDAK menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak ketiga, kecuali:`,
          items: [
            'Dengan persetujuan Anda',
            'Untuk mematuhi hukum yang berlaku',
            'Untuk melindungi hak dan keamanan kami'
          ]
        },
        {
          title: '4. Keamanan Data',
          content: `Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda:`,
          items: [
            'Enkripsi data dalam transit dan penyimpanan',
            'Akses terbatas ke data pribadi',
            'Pemantauan keamanan secara berkala'
          ]
        },
        {
          title: '5. Penyimpanan Data',
          content: `Data Anda disimpan di server yang aman dan akan dihapus jika:`,
          items: [
            'Anda meminta penghapusan',
            'Aplikasi tidak lagi digunakan dalam jangka waktu tertentu',
            'Diperlukan untuk mematuhi hukum'
          ]
        },
        {
          title: '6. Hak Pengguna',
          content: `Anda memiliki hak untuk:`,
          items: [
            'Mengakses data pribadi Anda',
            'Memperbaiki data yang tidak akurat',
            'Menghapus data pribadi',
            'Menolak pengumpulan data tertentu'
          ]
        },
        {
          title: '7. Perubahan Kebijakan',
          content: `Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui aplikasi.`
        },
        {
          title: '8. Kontak',
          content: `Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi:`,
          contact: {
            email: 'diabetescare.pkl@gmail.com',
            address: 'solo, Indonesia'
          }
        }
      ],
      note: 'Catatan: Kebijakan privasi ini berlaku untuk aplikasi Assiyam Diabetes Checker versi 1.0.0 dan seterusnya.'
    },
    en: {
      title: 'Privacy Policy - Assiyam Diabetes Checker',
      lastUpdated: 'Last updated: January 15, 2025',
      sections: [
        {
          title: '1. Information We Collect',
          content: `The Assiyam Diabetes Checker application collects the following information:`,
          subsections: [
            {
              subtitle: '1.1 Information You Provide',
              items: [
                'Personal data (name, age, health history)',
                'Diabetes examination results',
                'Application usage history'
              ]
            },
            {
              subtitle: '1.2 Automatically Collected Information',
              items: [
                'Application usage data',
                'Device information (model, operating system)',
                'Error logs and application performance'
              ]
            }
          ]
        },
        {
          title: '2. How We Use Information',
          content: `We use the collected information to:`,
          items: [
            'Provide diabetes examination services',
            'Improve AI diagnosis accuracy',
            'Enhance application performance',
            'Provide technical support'
          ]
        },
        {
          title: '3. Information Sharing',
          content: `We do NOT sell, trade, or transfer your personal information to third parties, except:`,
          items: [
            'With your consent',
            'To comply with applicable laws',
            'To protect our rights and security'
          ]
        },
        {
          title: '4. Data Security',
          content: `We implement reasonable security measures to protect your personal information:`,
          items: [
            'Data encryption in transit and storage',
            'Limited access to personal data',
            'Regular security monitoring'
          ]
        },
        {
          title: '5. Data Storage',
          content: `Your data is stored on secure servers and will be deleted if:`,
          items: [
            'You request deletion',
            'The application is not used for a certain period',
            'Required to comply with laws'
          ]
        },
        {
          title: '6. User Rights',
          content: `You have the right to:`,
          items: [
            'Access your personal data',
            'Correct inaccurate data',
            'Delete personal data',
            'Opt-out of certain data collection'
          ]
        },
        {
          title: '7. Policy Changes',
          content: `We may update this privacy policy from time to time. Changes will be notified through the application.`
        },
        {
          title: '8. Contact',
          content: `If you have questions about this privacy policy, please contact:`,
          contact: {
            email: 'diabetescare.pkl@gmail.com',
            address: 'solo, Indonesia'
          }
        }
      ],
      note: 'Note: This privacy policy applies to Assiyam Diabetes Checker application version 1.0.0 and onwards.'
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage('id')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'id'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentContent.title}
            </h1>
            <p className="text-gray-600">
              {currentContent.lastUpdated}
            </p>
          </div>

          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <section key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                
                {section.content && (
                  <p className="text-gray-700 mb-4">
                    {section.content}
                  </p>
                )}

                {section.subsections && (
                  <div className="space-y-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {subsection.subtitle}
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.items && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.contact && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> {section.contact.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Address:</strong> {section.contact.address}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              {currentContent.note}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}; 