import React, { useState } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const OrganizationPage = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useAttendance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDepartment, setNewDepartment] = useState('');
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (newDepartment.trim()) {
      addDepartment({ name: newDepartment });
      setNewDepartment('');
    }
  };

  const handleUpdate = (id: string) => {
    if (editName.trim()) {
      updateDepartment(id, { name: editName });
      setEditingId(null);
      setEditName('');
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organization Overview</h1>
        <p className="mt-2 text-gray-600">Manage your organization's structure and departments</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Departments</h2>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Enter department name"
              className="form-input flex-1"
            />
            <button
              onClick={handleAdd}
              className="btn btn-primary flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add Department
            </button>
          </div>

          <div className="space-y-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                {editingId === dept.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="form-input flex-1 mr-4"
                  />
                ) : (
                  <span className="text-gray-900">{dept.name}</span>
                )}
                
                <div className="flex items-center space-x-2">
                  {editingId === dept.id ? (
                    <button
                      onClick={() => handleUpdate(dept.id)}
                      className="text-success-600 hover:text-success-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(dept.id, dept.name)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteDepartment(dept.id)}
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

export default OrganizationPage;