import React, { useState } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  Filter, 
  Download, 
  FileText, 
  TrendingUp 
} from 'lucide-react';

const AttendanceReportPage: React.FC = () => {
  const { attendances, departments, employees } = useAttendance();
  
  // State for filters
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to last 30 days
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Default to today
  });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTab, setActiveTab] = useState('detail'); // 'detail' or 'statistics'
  
  // Filter attendances based on selected criteria
  const filteredAttendances = attendances.filter(attendance => {
    const matchesDepartment = selectedDepartment === '' || attendance.department === selectedDepartment;
    const matchesStatus = selectedStatus === '' || attendance.status === selectedStatus;
    
    // Check if date is within the selected range
    const attendanceDate = parseISO(attendance.date);
    const isInDateRange = isWithinInterval(attendanceDate, {
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
    
    return matchesDepartment && matchesStatus && isInDateRange;
  });
  
  // Sort by date (newest first) and then by employee name
  const sortedAttendances = [...filteredAttendances].sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.employeeName.localeCompare(b.employeeName);
  });
  
  // Calculate work hours (for present attendance)
  const calculateWorkHours = (timeIn: string, timeOut: string, breakTime?: string) => {
    if (!timeIn || !timeOut) return 0;
    
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    
    // Subtract break time if available
    if (breakTime) {
      const [breakHours, breakMinutes] = breakTime.split(':').map(Number);
      totalMinutes -= (breakHours * 60 + breakMinutes);
    }
    
    return Math.max(0, totalMinutes / 60); // Convert to hours and ensure non-negative
  };
  
  // Prepare data for statistics charts
  
  // 1. Status distribution
  const statusCounts = {
    Present: filteredAttendances.filter(a => a.status === 'Present').length,
    Late: filteredAttendances.filter(a => a.status === 'Late').length,
    Absent: filteredAttendances.filter(a => a.status === 'Absent').length,
  };
  
  const statusData = [
    { name: 'Present', value: statusCounts.Present, color: '#22c55e' },
    { name: 'Late', value: statusCounts.Late, color: '#f59e0b' },
    { name: 'Absent', value: statusCounts.Absent, color: '#ef4444' },
  ];
  
  // 2. Department distribution
  const departmentData = departments.map(dept => {
    const count = filteredAttendances.filter(a => a.department === dept.name).length;
    return {
      name: dept.name,
      count,
    };
  }).sort((a, b) => b.count - a.count); // Sort by count (highest first)
  
  // 3. Daily trend data
  const dailyData: Record<string, { date: string, present: number, late: number, absent: number }> = {};
  
  filteredAttendances.forEach(attendance => {
    const formattedDate = format(parseISO(attendance.date), 'MM/dd');
    
    if (!dailyData[formattedDate]) {
      dailyData[formattedDate] = {
        date: formattedDate,
        present: 0,
        late: 0,
        absent: 0,
      };
    }
    
    if (attendance.status === 'Present') {
      dailyData[formattedDate].present += 1;
    } else if (attendance.status === 'Late') {
      dailyData[formattedDate].late += 1;
    } else if (attendance.status === 'Absent') {
      dailyData[formattedDate].absent += 1;
    }
  });
  
  const dailyTrendData = Object.values(dailyData)
    .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
    .slice(-10); // Only show last 10 days
  
  // Helpers for UI
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-success-100 text-success-800';
      case 'Late':
        return 'bg-warning-100 text-warning-800';
      case 'Absent':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '—';
    return time.substring(0, 5); // Show only HH:MM
  };
  
  // Handle download report (demo - would generate CSV in real app)
  const downloadReport = () => {
    alert('This would download a CSV report of the attendance data in a real application.');
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
          <p className="text-gray-600">Analyze attendance patterns and statistics</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={downloadReport}
            className="btn btn-primary flex items-center"
          >
            <Download size={18} className="mr-1" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter size={18} className="mr-2 text-gray-500" />
            Report Filters
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="start-date" className="form-label">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="end-date" className="form-label">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="form-select"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-select"
              >
                <option value="">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredAttendances.length} records
              {startDate && endDate && (
                <span> from {format(parseISO(startDate), 'MMM d, yyyy')} to {format(parseISO(endDate), 'MMM d, yyyy')}</span>
              )}
            </div>
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSelectedDepartment('');
                setSelectedStatus('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === 'detail'
                  ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
              }`}
            >
              <FileText size={18} className="mr-2" />
              Detailed Report
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === 'statistics'
                  ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
              }`}
            >
              <BarChartIcon size={18} className="mr-2" />
              Statistics
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'detail' ? (
            <>
              {/* Detailed Report Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAttendances.length > 0 ? (
                      sortedAttendances.map((attendance) => (
                        <tr key={attendance.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {attendance.employeeName}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attendance.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(parseISO(attendance.date), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTime(attendance.timeIn)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTime(attendance.timeOut)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(attendance.status)}`}>
                              {attendance.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attendance.status !== 'Absent'
                              ? `${calculateWorkHours(attendance.timeIn, attendance.timeOut, attendance.breakTime).toFixed(1)}h`
                              : '—'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No attendance records found for the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              {/* Statistics */}
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Present</h3>
                      <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-success-500"></div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts.Present}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredAttendances.length > 0
                        ? `${((statusCounts.Present / filteredAttendances.length) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Late</h3>
                      <div className="h-8 w-8 rounded-full bg-warning-100 flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-warning-500"></div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts.Late}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredAttendances.length > 0
                        ? `${((statusCounts.Late / filteredAttendances.length) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Absent</h3>
                      <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-error-500"></div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{statusCounts.Absent}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredAttendances.length > 0
                        ? `${((statusCounts.Absent / filteredAttendances.length) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Status Distribution Chart */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-900">Status Distribution</h3>
                      <PieChartIcon size={18} className="text-gray-500" />
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} records`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Department Distribution Chart */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-900">Department Distribution</h3>
                      <BarChartIcon size={18} className="text-gray-500" />
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={departmentData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="count" name="Records" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Daily Trend Chart */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-900">Daily Attendance Trend</h3>
                    <TrendingUp size={18} className="text-gray-500" />
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyTrendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" name="Present" stackId="a" fill="#22c55e" />
                        <Bar dataKey="late" name="Late" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="absent" name="Absent" stackId="a" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Key Insights */}
                <div className="bg-primary-50 rounded-lg border border-primary-200 p-4">
                  <h3 className="text-base font-medium text-primary-900 mb-3">Key Insights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                      </div>
                      <p className="ml-2 text-sm text-primary-800">
                        {statusCounts.Present + statusCounts.Late > 0 && statusCounts.Absent > 0 ? (
                          <>
                            Attendance rate: {((statusCounts.Present + statusCounts.Late) / (statusCounts.Present + statusCounts.Late + statusCounts.Absent) * 100).toFixed(1)}%
                          </>
                        ) : (
                          'No attendance data available for calculation.'
                        )}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                      </div>
                      <p className="ml-2 text-sm text-primary-800">
                        {departmentData.length > 0 ? (
                          <>
                            {departmentData[0].name} has the highest attendance with {departmentData[0].count} records.
                          </>
                        ) : (
                          'No department data available.'
                        )}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                      </div>
                      <p className="ml-2 text-sm text-primary-800">
                        {dailyTrendData.length > 0 ? (
                          <>
                            The day with highest attendance was {dailyTrendData.reduce((max, day) => 
                              day.present > max.present ? day : max
                            , dailyTrendData[0]).date} with {dailyTrendData.reduce((max, day) => 
                              day.present > max.present ? day : max
                            , dailyTrendData[0]).present} present employees.
                          </>
                        ) : (
                          'No daily trend data available.'
                        )}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;