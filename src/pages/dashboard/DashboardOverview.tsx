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
import { dashboardService } from '../../api/services';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getDashboardStats,
  });

  // Mock chart data
  const examinationTrends = [
    { name: 'Jan', examinations: 65 },
    { name: 'Feb', examinations: 59 },
    { name: 'Mar', examinations: 80 },
    { name: 'Apr', examinations: 81 },
    { name: 'May', examinations: 56 },
    { name: 'Jun', examinations: 55 },
    { name: 'Jul', examinations: 40 },
  ];

  const userDistribution = [
    { name: 'Patients', value: stats?.patientCount || 0, color: '#3B82F6' },
    { name: 'Staff', value: stats?.staffCount || 0, color: '#10B981' },
    { name: 'Admins', value: stats?.adminCount || 0, color: '#F59E0B' },
  ];

  const monthlyStats = [
    { name: 'Week 1', examinations: 20, users: 5 },
    { name: 'Week 2', examinations: 35, users: 8 },
    { name: 'Week 3', examinations: 28, users: 12 },
    { name: 'Week 4', examinations: 42, users: 15 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Examinations',
      value: stats?.totalExaminations || 0,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Active Staff',
      value: stats?.activeStaff || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'increase'
    },
    {
      title: 'Today\'s Examinations',
      value: stats?.todayExaminations || 0,
      icon: CalendarDaysIcon,
      color: 'bg-orange-500',
      change: '-3%',
      changeType: 'decrease'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your Shiyam management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Examination Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Examination Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
      </div>
    </div>
  );
};