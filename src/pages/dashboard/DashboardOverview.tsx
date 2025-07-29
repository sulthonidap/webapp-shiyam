import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersIcon, 
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  ResponsiveContainer 
} from 'recharts';
import { userService, examinationService } from '../../api/services';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Skeleton Components
const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="flex items-center">
          <div className="h-3 bg-gray-200 rounded w-12 mr-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
    <div className="h-[300px] bg-gray-200 rounded"></div>
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div>
      <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-80"></div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ChartSkeleton />
      <ChartSkeleton />
      <div className="lg:col-span-2">
        <ChartSkeleton />
      </div>
    </div>
  </div>
);

export const DashboardOverview: React.FC = () => {
  // Menggunakan query yang sudah ada dari halaman lain
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const { data: examinations = [], isLoading: examinationsLoading } = useQuery({
    queryKey: ['examinations'],
    queryFn: examinationService.getExaminations,
  });

  const isLoading = usersLoading || examinationsLoading;

  // Hitung statistik dari data yang sudah ada
  const today = new Date().toISOString().split('T')[0];
  const todayExaminations = examinations.filter(exam => {
    const examDate = new Date(exam.createdAt).toISOString().split('T')[0];
    return examDate === today;
  });
  
  const stats = {
    totalUsers: users.length,
    totalExaminations: examinations.length,
    activeStaff: users.filter(u => u.role === 'staff').length,
    todayExaminations: todayExaminations.length,
    adminCount: users.filter(u => u.role === 'admin').length,
    staffCount: users.filter(u => u.role === 'staff').length,
    patientCount: users.filter(u => u.role === 'patient').length,
  };

  // Generate examination trends dari data real (7 hari terakhir)
  const generateExaminationTrends = () => {
    const trends = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = examinations.filter(exam => {
        const examDate = new Date(exam.createdAt).toISOString().split('T')[0];
        return examDate === dateStr;
      }).length;
      
      trends.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        examinations: count
      });
    }
    
    return trends;
  };

  // Generate monthly stats dari data real (4 minggu terakhir)
  const generateMonthlyStats = () => {
    const stats = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekExaminations = examinations.filter(exam => {
        const examDate = new Date(exam.createdAt);
        return examDate >= weekStart && examDate <= weekEnd;
      }).length;
      
      const weekUsers = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return userDate >= weekStart && userDate <= weekEnd;
      }).length;
      
      stats.push({
        name: `Week ${4-i}`,
        examinations: weekExaminations,
        users: weekUsers
      });
    }
    
    return stats;
  };

  const userDistribution = [
    { name: 'Patients', value: stats.patientCount, color: '#3B82F6' },
    { name: 'Staff', value: stats.staffCount, color: '#10B981' },
    { name: 'Admins', value: stats.adminCount, color: '#F59E0B' },
  ];

  const examinationTrends = generateExaminationTrends();
  const monthlyStats = generateMonthlyStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Examinations',
      value: stats.totalExaminations,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'increase'
    },
    {
      title: 'Today\'s Examinations',
      value: stats.todayExaminations,
      icon: CalendarDaysIcon,
      color: 'bg-orange-500',
      change: '-3%',
      changeType: 'decrease'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-blue-500 animate-pulse"></div>
        </div>
      )}
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your Shiyam management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <span className={`text-xs sm:text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Examination Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Examination Trends (7 Days)</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={examinationTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="examinations" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">User Distribution</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                className="sm:outerRadius={100}"
                fill="#8884d8"
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Weekly Statistics (4 Weeks)</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="examinations" fill="#3B82F6" name="Examinations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#10B981" name="New Users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <UsersIcon className="h-8 w-8 text-blue-500 mb-3" />
            <h4 className="font-medium text-gray-900">Add New User</h4>
            <p className="text-sm text-gray-600">Create a new user account</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-green-500 mb-3" />
            <h4 className="font-medium text-gray-900">Add Examination</h4>
            <p className="text-sm text-gray-600">Record a new examination</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <UserGroupIcon className="h-8 w-8 text-purple-500 mb-3" />
            <h4 className="font-medium text-gray-900">Manage Staff</h4>
            <p className="text-sm text-gray-600">View staff assignments</p>
          </button>
        </div>
      </div> */}
    </div>
  );
};