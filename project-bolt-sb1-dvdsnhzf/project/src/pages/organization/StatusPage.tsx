import React, { useState } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const StatusPage = () => {
  const { statuses, addStatus, updateStatus, deleteStatus } = useAttendance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: 'green'
  });

  const handleAdd = () => {
    if (formData.name && formData.color) {
      addStatus(formData);
      setFormData({ name: '', color: 'green' });
    }
  };

  const handleUpdate = (id: string) => {
    if (formData.name && formData.color) {
      updateStatus(id, formData);
      setEditingId(null);
      setFormData({ name: '', color: 'green' });
    }
  };

  const startEdit = (status: typeof statuses[0]) => {
    setEditingId(status.id);
    setFormData({
      name: status.name,
      color: status.color
    });
  };

  const colors = [
    { name: 'Green', value: 'green' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Red', value: 'red' },
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Status Types</h1>
        <p className="mt-2 text-gray-600">Manage employee status indicators</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter status name"
              className="form-input"
            />
            <select
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="form-select"
            >
              {colors.map(color => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
            <div className="md:col-span-2">
              <button
                onClick={handleAdd}
                className="btn btn-primary flex items-center"
              >
                <Plus size={18} className="mr-1" />
                Add Status
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {statuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-3 bg-${status.color}-500`}
                  ></div>
                  <span className="font-medium text-gray-900">{status.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(status)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteStatus(status.id)}
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

export default StatusPage;