import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance, Attendance } from '../../contexts/AttendanceContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  RefreshCw
} from 'lucide-react';

const AttendanceManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { attendances, employees, departments, deleteAttendance } = useAttendance();
  
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const itemsPerPage = 10;

  // Apply filters to attendance data
  const filteredAttendances = attendances.filter((attendance) => {
    const matchesSearch = attendance.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || attendance.department === selectedDepartment;
    const matchesStatus = selectedStatus === '' || attendance.status === selectedStatus;
    const matchesDate = selectedDate === '' || attendance.date === selectedDate;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
  });

  // Sort by date (newest first) and then by employee name
  const sortedAttendances = [...filteredAttendances].sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.employeeName.localeCompare(b.employeeName);
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedAttendances.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAttendances.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle size={16} className="text-success-600" />;
      case 'Late':
        return <Clock size={16} className="text-warning-600" />;
      case 'Absent':
        return <XCircle size={16} className="text-error-600" />;
      default:
        return null;
    }
  };

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '—';
    return time.substring(0, 5); // Show only HH:MM
  };

  // Handle delete attendance
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      deleteAttendance(id);
    }
  };

  // Handle reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedStatus('');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // Handle download report (demo - would generate CSV in real app)
  const downloadReport = () => {
    alert('This would download a CSV report of the filtered attendance records in a real application.');
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">View and manage employee attendance records</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/attendance/add')}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Attendance
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="btn btn-ghost flex items-center"
            >
              <Filter size={18} className="mr-1 text-gray-500" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={downloadReport}
              className="btn btn-ghost flex items-center"
            >
              <Download size={18} className="mr-1 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
          
          {filtersVisible && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 animate-slide-up">
              <div>
                <label htmlFor="department-filter" className="form-label">
                  Department
                </label>
                <select
                  id="department-filter"
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
                <label htmlFor="status-filter" className="form-label">
                  Status
                </label>
                <select
                  id="status-filter"
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
              
              <div>
                <label htmlFor="date-filter" className="form-label">
                  Date
                </label>
                <input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="btn btn-ghost flex items-center"
                >
                  <RefreshCw size={16} className="mr-1" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Break Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {employees.find(e => e.id === attendance.employeeId)?.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={employees.find(e => e.id === attendance.employeeId)?.photo}
                              alt={attendance.employeeName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                              {attendance.employeeName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <button
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                            onClick={() => navigate(`/attendance/employee/${attendance.employeeId}`)}
                          >
                            {attendance.employeeName}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(attendance.status)}`}>
                          {getStatusIcon(attendance.status)}
                          <span className="ml-1">{attendance.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attendance.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(attendance.timeIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(attendance.timeOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(attendance.breakTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/attendance/edit/${attendance.id}`)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(attendance.id)}
                          className="text-error-600 hover:text-error-900 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No attendance records found. Try adjusting your filters or adding a new record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {sortedAttendances.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedAttendances.length)} of {sortedAttendances.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`btn btn-ghost flex items-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`btn btn-ghost flex items-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagementPage;