import React, { useState } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const DesignationPage = () => {
  const { designations, departments, addDesignation, updateDesignation, deleteDesignation } = useAttendance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: ''
  });

  const handleAdd = () => {
    if (formData.name && formData.department) {
      addDesignation(formData);
      setFormData({ name: '', department: '' });
    }
  };

  const handleUpdate = (id: string) => {
    if (formData.name && formData.department) {
      updateDesignation(id, formData);
      setEditingId(null);
      setFormData({ name: '', department: '' });
    }
  };

  const startEdit = (designation: typeof designations[0]) => {
    setEditingId(designation.id);
    setFormData({
      name: designation.name,
      department: designation.department
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
        <p className="mt-2 text-gray-600">Manage employee roles and positions</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter designation name"
              className="form-input"
            />
            <select
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="form-select"
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            <div className="md:col-span-2">
              <button
                onClick={handleAdd}
                className="btn btn-primary flex items-center"
              >
                <Plus size={18} className="mr-1" />
                Add Designation
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {designations.map((designation) => (
              <div
                key={designation.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{designation.name}</h3>
                  <p className="text-sm text-gray-500">{designation.department}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(designation)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteDesignation(designation.id)}
                    className="text-error-600 hover:text-error-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationPage;