import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

// Types
export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  joinDate: string;
  status: string;
  photo: string;
  daysPresent: number;
  totalLeaves: number;
  remainingLeaves: number;
};

export type Attendance = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  status: 'Present' | 'Late' | 'Absent';
  date: string;
  timeIn: string;
  timeOut: string;
  breakTime: string;
};

export type Leave = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type Department = {
  id: string;
  name: string;
};

export type Designation = {
  id: string;
  name: string;
  department: string;
};

export type Status = {
  id: string;
  name: string;
  color: string;
};

type AttendanceContextType = {
  employees: Employee[];
  attendances: Attendance[];
  leaves: Leave[];
  departments: Department[];
  designations: Designation[];
  statuses: Status[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;
  getAttendance: (id: string) => Attendance | undefined;
  getAttendanceByEmployee: (employeeId: string) => Attendance[];
  addLeave: (leave: Omit<Leave, 'id'>) => void;
  updateLeave: (id: string, leave: Partial<Leave>) => void;
  deleteLeave: (id: string) => void;
  getLeaveByEmployee: (employeeId: string) => Leave[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addDesignation: (designation: Omit<Designation, 'id'>) => void;
  updateDesignation: (id: string, designation: Partial<Designation>) => void;
  deleteDesignation: (id: string) => void;
  addStatus: (status: Omit<Status, 'id'>) => void;
  updateStatus: (id: string, status: Partial<Status>) => void;
  deleteStatus: (id: string) => void;
};

// Mock data
const MOCK_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'Human Resources' },
  { id: '3', name: 'Finance' },
  { id: '4', name: 'Marketing' },
  { id: '5', name: 'Operations' },
];

const MOCK_DESIGNATIONS: Designation[] = [
  { id: '1', name: 'Software Engineer', department: 'Engineering' },
  { id: '2', name: 'Senior Software Engineer', department: 'Engineering' },
  { id: '3', name: 'HR Manager', department: 'Human Resources' },
  { id: '4', name: 'Financial Analyst', department: 'Finance' },
  { id: '5', name: 'Marketing Specialist', department: 'Marketing' },
];

const MOCK_STATUSES: Status[] = [
  { id: '1', name: 'Active', color: 'green' },
  { id: '2', name: 'On Leave', color: 'yellow' },
  { id: '3', name: 'Terminated', color: 'red' },
  { id: '4', name: 'Probation', color: 'blue' },
];

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, Country',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joinDate: '2022-01-15',
    status: 'Active',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    daysPresent: 210,
    totalLeaves: 21,
    remainingLeaves: 10,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    address: '456 Oak St, City, Country',
    department: 'Human Resources',
    designation: 'HR Manager',
    joinDate: '2021-08-10',
    status: 'Active',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    daysPresent: 245,
    totalLeaves: 21,
    remainingLeaves: 5,
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '555-123-4567',
    address: '789 Pine St, City, Country',
    department: 'Finance',
    designation: 'Financial Analyst',
    joinDate: '2023-02-20',
    status: 'Probation',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    daysPresent: 95,
    totalLeaves: 15,
    remainingLeaves: 15,
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '222-333-4444',
    address: '101 Elm St, City, Country',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    joinDate: '2022-07-05',
    status: 'On Leave',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    daysPresent: 180,
    totalLeaves: 21,
    remainingLeaves: 0,
  },
];

// Generate mock attendance data for the past 30 days
const generateAttendanceData = (): Attendance[] => {
  const attendances: Attendance[] = [];
  const today = new Date();
  const employees = MOCK_EMPLOYEES;

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    employees.forEach(employee => {
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) return;
      
      // Random status with 70% present, 20% late, 10% absent
      const rand = Math.random();
      let status: 'Present' | 'Late' | 'Absent' = 'Present';
      if (rand > 0.7 && rand <= 0.9) {
        status = 'Late';
      } else if (rand > 0.9) {
        status = 'Absent';
      }
      
      // Skip if employee is on leave (for demo purposes)
      if (employee.status === 'On Leave' && i < 7) {
        status = 'Absent';
      }
      
      attendances.push({
        id: `${employee.id}-${formattedDate}`,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        status,
        date: formattedDate,
        timeIn: status !== 'Absent' ? (status === 'Late' ? '10:15:00' : '09:00:00') : '',
        timeOut: status !== 'Absent' ? '18:00:00' : '',
        breakTime: status !== 'Absent' ? '01:00:00' : '',
      });
    });
  }
  
  return attendances;
};

// Generate mock leave data
const generateLeaveData = (): Leave[] => {
  const leaves: Leave[] = [];
  
  leaves.push({
    id: '1',
    employeeId: '4', // Emily Wilson
    startDate: '2023-10-01',
    endDate: '2023-10-07',
    reason: 'Family vacation',
    status: 'Approved',
  });
  
  leaves.push({
    id: '2',
    employeeId: '1', // John Doe
    startDate: '2023-09-15',
    endDate: '2023-09-16',
    reason: 'Medical appointment',
    status: 'Approved',
  });
  
  leaves.push({
    id: '3',
    employeeId: '2', // Jane Smith
    startDate: '2023-10-20',
    endDate: '2023-10-22',
    reason: 'Personal reasons',
    status: 'Approved',
  });
  
  leaves.push({
    id: '4',
    employeeId: '3', // Michael Johnson
    startDate: '2023-11-01',
    endDate: '2023-11-02',
    reason: 'Family event',
    status: 'Pending',
  });
  
  return leaves;
};

// Create context
const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Provider component
export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [designations, setDesignations] = useState<Designation[]>(MOCK_DESIGNATIONS);
  const [statuses, setStatuses] = useState<Status[]>(MOCK_STATUSES);

  // Initialize with mock data
  useEffect(() => {
    setEmployees(MOCK_EMPLOYEES);
    setAttendances(generateAttendanceData());
    setLeaves(generateLeaveData());
  }, []);

  // Employee CRUD operations
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? { ...employee, ...employeeData } : employee
      )
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const getEmployee = (id: string) => {
    return employees.find((employee) => employee.id === id);
  };

  // Attendance CRUD operations
  const addAttendance = (attendance: Omit<Attendance, 'id'>) => {
    const newAttendance = {
      ...attendance,
      id: Date.now().toString(),
    };
    setAttendances([...attendances, newAttendance]);
  };

  const updateAttendance = (id: string, attendanceData: Partial<Attendance>) => {
    setAttendances(
      attendances.map((attendance) =>
        attendance.id === id ? { ...attendance, ...attendanceData } : attendance
      )
    );
  };

  const deleteAttendance = (id: string) => {
    setAttendances(attendances.filter((attendance) => attendance.id !== id));
  };

  const getAttendance = (id: string) => {
    return attendances.find((attendance) => attendance.id === id);
  };

  const getAttendanceByEmployee = (employeeId: string) => {
    return attendances.filter((attendance) => attendance.employeeId === employeeId);
  };

  // Leave CRUD operations
  const addLeave = (leave: Omit<Leave, 'id'>) => {
    const newLeave = {
      ...leave,
      id: Date.now().toString(),
    };
    setLeaves([...leaves, newLeave]);
  };

  const updateLeave = (id: string, leaveData: Partial<Leave>) => {
    setLeaves(
      leaves.map((leave) =>
        leave.id === id ? { ...leave, ...leaveData } : leave
      )
    );
  };

  const deleteLeave = (id: string) => {
    setLeaves(leaves.filter((leave) => leave.id !== id));
  };

  const getLeaveByEmployee = (employeeId: string) => {
    return leaves.filter((leave) => leave.employeeId === employeeId);
  };

  // Department CRUD operations
  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment = {
      ...department,
      id: Date.now().toString(),
    };
    setDepartments([...departments, newDepartment]);
  };

  const updateDepartment = (id: string, departmentData: Partial<Department>) => {
    setDepartments(
      departments.map((department) =>
        department.id === id ? { ...department, ...departmentData } : department
      )
    );
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter((department) => department.id !== id));
  };

  // Designation CRUD operations
  const addDesignation = (designation: Omit<Designation, 'id'>) => {
    const newDesignation = {
      ...designation,
      id: Date.now().toString(),
    };
    setDesignations([...designations, newDesignation]);
  };

  const updateDesignation = (id: string, designationData: Partial<Designation>) => {
    setDesignations(
      designations.map((designation) =>
        designation.id === id ? { ...designation, ...designationData } : designation
      )
    );
  };

  const deleteDesignation = (id: string) => {
    setDesignations(designations.filter((designation) => designation.id !== id));
  };

  // Status CRUD operations
  const addStatus = (status: Omit<Status, 'id'>) => {
    const newStatus = {
      ...status,
      id: Date.now().toString(),
    };
    setStatuses([...statuses, newStatus]);
  };

  const updateStatus = (id: string, statusData: Partial<Status>) => {
    setStatuses(
      statuses.map((status) =>
        status.id === id ? { ...status, ...statusData } : status
      )
    );
  };

  const deleteStatus = (id: string) => {
    setStatuses(statuses.filter((status) => status.id !== id));
  };

  const value = {
    employees,
    attendances,
    leaves,
    departments,
    designations,
    statuses,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendance,
    getAttendanceByEmployee,
    addLeave,
    updateLeave,
    deleteLeave,
    getLeaveByEmployee,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addDesignation,
    updateDesignation,
    deleteDesignation,
    addStatus,
    updateStatus,
    deleteStatus,
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

// Custom hook to use attendance context
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};