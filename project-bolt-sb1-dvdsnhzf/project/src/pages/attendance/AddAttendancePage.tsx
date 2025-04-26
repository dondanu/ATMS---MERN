import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAttendance } from '../../contexts/AttendanceContext';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const AddAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    employees, 
    departments, 
    addAttendance, 
    updateAttendance, 
    getAttendance 
  } = useAttendance();
  
  // Initialize form state
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    status: 'Present',
    date: new Date().toISOString().split('T')[0],
    timeIn: '09:00',
    timeOut: '18:00',
    breakTime: '01:00',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load attendance data if editing
  useEffect(() => {
    if (id) {
      const attendance = getAttendance(id);
      if (attendance) {
        // Format times for form inputs (remove seconds)
        const timeIn = attendance.timeIn ? attendance.timeIn.substring(0, 5) : '';
        const timeOut = attendance.timeOut ? attendance.timeOut.substring(0, 5) : '';
        const breakTime = attendance.breakTime ? attendance.breakTime.substring(0, 5) : '';
        
        setForm({
          employeeId: attendance.employeeId,
          employeeName: attendance.employeeName,
          department: attendance.department,
          status: attendance.status,
          date: attendance.date,
          timeIn,
          timeOut,
          breakTime,
        });
      } else {
        // If attendance not found, redirect back to attendance list
        navigate('/attendance');
      }
    }
  }, [id, getAttendance, navigate]);
  
  // Update employee name and department when employee is selected
  useEffect(() => {
    if (form.employeeId) {
      const selectedEmployee = employees.find(e => e.id === form.employeeId);
      if (selectedEmployee) {
        setForm(prev => ({
          ...prev,
          employeeName: selectedEmployee.name,
          department: selectedEmployee.department,
        }));
      }
    }
  }, [form.employeeId, employees]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Reset errors when field is modified
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // If status is changed to Absent, clear time fields
    if (name === 'status' && value === 'Absent') {
      setForm(prev => ({
        ...prev,
        [name]: value,
        timeIn: '',
        timeOut: '',
        breakTime: '',
      }));
    }
    
    // If status is changed from Absent, set default time values
    if (name === 'status' && value !== 'Absent' && form.status === 'Absent') {
      setForm(prev => ({
        ...prev,
        [name]: value,
        timeIn: '09:00',
        timeOut: '18:00',
        breakTime: '01:00',
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }
    
    if (!form.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (form.status !== 'Absent') {
      if (!form.timeIn) {
        newErrors.timeIn = 'Please enter time in';
      }
      
      if (!form.timeOut) {
        newErrors.timeOut = 'Please enter time out';
      }
      
      if (form.timeIn && form.timeOut && form.timeIn >= form.timeOut) {
        newErrors.timeOut = 'Time out must be after time in';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Format times to include seconds for storage
    const formattedTimeIn = form.timeIn ? `${form.timeIn}:00` : '';
    const formattedTimeOut = form.timeOut ? `${form.timeOut}:00` : '';
    const formattedBreakTime = form.breakTime ? `${form.breakTime}:00` : '';
    
    const attendanceData = {
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      department: form.department,
      status: form.status as 'Present' | 'Late' | 'Absent',
      date: form.date,
      timeIn: formattedTimeIn,
      timeOut: formattedTimeOut,
      breakTime: formattedBreakTime,
    };
    
    try {
      if (id) {
        // Update existing attendance
        updateAttendance(id, attendanceData);
      } else {
        // Add new attendance
        addAttendance(attendanceData);
      }
      
      // Redirect back to attendance list
      navigate('/attendance');
    } catch (error) {
      console.error('Error saving attendance:', error);
      setErrors(prev => ({
        ...prev,
        form: 'An error occurred while saving. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/attendance')}
          className="mr-4 btn btn-ghost flex items-center p-2"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Attendance' : 'Add New Attendance'}
          </h1>
          <p className="text-gray-600">
            {id ? 'Update attendance details' : 'Record a new attendance entry'}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {errors.form && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{errors.form}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Selection */}
              <div>
                <label htmlFor="employeeId" className="form-label">
                  Employee <span className="text-error-600">*</span>
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  className={`form-select ${errors.employeeId ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                {errors.employeeId && (
                  <p className="mt-1 text-sm text-error-600">{errors.employeeId}</p>
                )}
              </div>
              
              {/* Department (Automatically filled) */}
              <div>
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={form.department}
                  className="form-input bg-gray-50"
                  readOnly
                />
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="form-label">
                  Status <span className="text-error-600">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="form-label">
                  Date <span className="text-error-600">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`form-input ${errors.date ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  required
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-error-600">{errors.date}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Time In */}
              <div>
                <label htmlFor="timeIn" className="form-label">
                  Time In {form.status !== 'Absent' && <span className="text-error-600">*</span>}
                </label>
                <input
                  id="timeIn"
                  name="timeIn"
                  type="time"
                  value={form.timeIn}
                  onChange={handleChange}
                  className={`form-input ${errors.timeIn ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  disabled={form.status === 'Absent'}
                  required={form.status !== 'Absent'}
                />
                {errors.timeIn && (
                  <p className="mt-1 text-sm text-error-600">{errors.timeIn}</p>
                )}
              </div>
              
              {/* Time Out */}
              <div>
                <label htmlFor="timeOut" className="form-label">
                  Time Out {form.status !== 'Absent' && <span className="text-error-600">*</span>}
                </label>
                <input
                  id="timeOut"
                  name="timeOut"
                  type="time"
                  value={form.timeOut}
                  onChange={handleChange}
                  className={`form-input ${errors.timeOut ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                  disabled={form.status === 'Absent'}
                  required={form.status !== 'Absent'}
                />
                {errors.timeOut && (
                  <p className="mt-1 text-sm text-error-600">{errors.timeOut}</p>
                )}
              </div>
              
              {/* Break Time */}
              <div>
                <label htmlFor="breakTime" className="form-label">
                  Break Time
                </label>
                <input
                  id="breakTime"
                  name="breakTime"
                  type="time"
                  value={form.breakTime}
                  onChange={handleChange}
                  className="form-input"
                  disabled={form.status === 'Absent'}
                />
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="btn btn-ghost mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Save size={18} className="mr-1" />
              {isSubmitting ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendancePage;