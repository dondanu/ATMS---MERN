import React from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { 
  BarChart as BarChartIcon, 
  Users, 
  Clock, 
  UserCheck, 
  UserX, 
  Calendar, 
  TrendingUp, 
  Briefcase
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const DashboardPage: React.FC = () => {
  const { employees, attendances, departments } = useAttendance();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const presentToday = attendances.filter(a => a.date === today && a.status === 'Present').length;
  const lateToday = attendances.filter(a => a.date === today && a.status === 'Late').length;
  const absentToday = attendances.filter(a => a.date === today && a.status === 'Absent').length;
  
  // Calculate attendance rate (percentage of employees present)
  const attendanceRate = totalEmployees > 0 
    ? Math.round(((presentToday + lateToday) / totalEmployees) * 100) 
    : 0;
  
  // Get the last 7 days for attendance trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  // Prepare data for attendance trend chart
  const attendanceTrend = last7Days.map(date => {
    const dayAttendances = attendances.filter(a => a.date === date);
    const present = dayAttendances.filter(a => a.status === 'Present').length;
    const late = dayAttendances.filter(a => a.status === 'Late').length;
    const absent = dayAttendances.filter(a => a.status === 'Absent').length;
    
    // Format date to show only day name
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      date: dayName,
      present,
      late,
      absent,
    };
  });
  
  // Prepare data for department distribution chart
  const departmentDistribution = departments.map(dept => {
    const count = employees.filter(e => e.department === dept.name).length;
    return {
      name: dept.name,
      value: count,
    };
  });
  
  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Present', value: presentToday, color: '#22c55e' },
    { name: 'Late', value: lateToday, color: '#f59e0b' },
    { name: 'Absent', value: absentToday, color: '#ef4444' },
  ];
  
  // Time distribution - mock data for work hours
  const timeDistribution = [
    { name: '< 7 hours', employees: 2 },
    { name: '7-8 hours', employees: 8 },
    { name: '8-9 hours', employees: 12 },
    { name: '9+ hours', employees: 5 },
  ];
  
  // Department colors for the bar chart
  const COLORS = ['#4f46e5', '#0d9488', '#f59e0b', '#ef4444', '#22c55e'];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of attendance and employee metrics</p>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalEmployees}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Users size={24} className="text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">{activeEmployees} active</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-500">{totalEmployees - activeEmployees} inactive</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center">
              <UserCheck size={24} className="text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">{presentToday} present</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-warning-600 font-medium">{lateToday} late</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-error-600 font-medium">{absentToday} absent</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Work Hours</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8.2h</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center">
              <Clock size={24} className="text-secondary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-primary-600 font-medium">+0.5h</span>
            <span className="text-gray-500 ml-1">from last week</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{departments.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
              <Briefcase size={24} className="text-accent-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Most active: </span>
            <span className="text-primary-600 font-medium ml-1">Engineering</span>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Attendance Trend</h2>
              <p className="text-sm text-gray-500">Last 7 days attendance</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-gray-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Department Distribution Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Department Distribution</h2>
              <p className="text-sm text-gray-500">Employees per department</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <BarChartIcon size={18} className="text-gray-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" width={100} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }} 
                />
                <Legend />
                <Bar dataKey="value" name="Employees" radius={[0, 4, 4, 0]}>
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today's Status</h2>
              <p className="text-sm text-gray-500">Attendance status distribution</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar size={18} className="text-gray-600" />
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }} 
                  formatter={(value) => [`${value} employees`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-2">
            {statusDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Work Hours Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Work Hours</h2>
              <p className="text-sm text-gray-500">Distribution of employee work hours</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock size={18} className="text-gray-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }} 
                />
                <Legend />
                <Bar dataKey="employees" name="Employees" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;