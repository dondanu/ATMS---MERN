import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAttendance } from '../../../contexts/AttendanceContext';
import { Save, ArrowLeft } from 'lucide-react';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addEmployee, updateEmployee, getEmployee, departments, designations } = useAttendance();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    designation: '',
    joinDate: '',
    status: '',
    photo: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    daysPresent: 0,
    totalLeaves: 21,
    remainingLeaves: 21
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (id) {
      updateEmployee(id, formData);
    } else {
      addEmployee(formData);
    }
    
    navigate('/employee');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/employee')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Employee' : 'Add New Employee'}
        </h1>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Enter employee name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="form-input w-full"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="form-select w-full"
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <select
                name="designation"
                required
                value={formData.designation}
                onChange={handleChange}
                className="form-select w-full"
              >
                <option value="">Select designation</option>
                {designations
                  .filter(d => !formData.department || d.department === formData.department)
                  .map(designation => (
                    <option key={designation.id} value={designation.name}>
                      {designation.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Date
              </label>
              <input
                name="joinDate"
                type="date"
                required
                value={formData.joinDate}
                onChange={handleChange}
                className="form-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="form-select w-full"
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="form-input w-full"
                placeholder="Enter address"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/employee')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              <Save size={18} className="mr-1" />
              {id ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;