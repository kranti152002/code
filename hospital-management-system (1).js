// src/api/config.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// src/api/httpClient.js
import axios from 'axios';
import { apiConfig } from './config';

const httpClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers
});

// Add request interceptor for authentication
httpClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for error handling
httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page on unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;

// src/api/physicianService.js
import httpClient from './httpClient';

export const physicianService = {
  // Add a new physician
  addPhysician: (physician) => {
    return httpClient.post('/api/physician/post', physician);
  },
  
  // Get physician by name
  getPhysicianByName: (name) => {
    return httpClient.get(`/api/physician/name/${name}`);
  },
  
  // Get physician by position
  getPhysiciansByPosition: (position) => {
    return httpClient.get(`/api/physician/position/${position}`);
  },
  
  // Get physician by employee ID
  getPhysicianByEmpId: (empId) => {
    return httpClient.get(`/api/physician/empid/${empId}`);
  },
  
  // Update physician position
  updatePosition: (position, employeeId) => {
    return httpClient.put(`/update/position/${position}/${employeeId}`);
  },
  
  // Update physician name
  updateName: (empId, name) => {
    return httpClient.put(`/api/physician/update/name/${empId}`, { name });
  },
  
  // Update physician SSN
  updateSSN: (empId, ssn) => {
    return httpClient.put(`/api/physician/update/ssn/${empId}`, { ssn });
  }
};

// src/api/departmentService.js
import httpClient from './httpClient';

export const departmentService = {
  // Add a new department
  addDepartment: (department) => {
    return httpClient.post('/api/department', department);
  },
  
  // Get all departments
  getAllDepartments: () => {
    return httpClient.get('/api/department/');
  },
  
  // Get department by ID
  getDepartmentById: (deptId) => {
    return httpClient.get(`/api/department/${deptId}`);
  },
  
  // Get department head
  getDepartmentHead: (deptId) => {
    return httpClient.get(`/api/department/head/${deptId}`);
  },
  
  // Get head certification by department ID
  getHeadCertification: (deptId) => {
    return httpClient.get(`/api/department/headcertification/${deptId}`);
  },
  
  // Get departments by head
  getDepartmentsByHead: (headId) => {
    return httpClient.get(`/api/department/${headId}`);
  },
  
  // Check if physician is a head of any department
  isPhysicianHead: (physicianId) => {
    return httpClient.get(`/api/department/check/${physicianId}`);
  },
  
  // Update department head
  updateDepartmentHead: (deptId, headId) => {
    return httpClient.put(`/api/department/update/headid/${deptId}`, { headId });
  },
  
  // Update department name
  updateDepartmentName: (deptId, name) => {
    return httpClient.put(`/api/department/update/deptname/${deptId}`, { name });
  }
};

// src/api/affiliatedWithService.js
import httpClient from './httpClient';

export const affiliatedWithService = {
  // Add a physician affiliation
  addAffiliation: (affiliation) => {
    return httpClient.post('/api/affiliated_with/post', affiliation);
  },
  
  // Get physicians by department
  getPhysiciansByDepartment: (deptId) => {
    return httpClient.get(`/api/affiliated_with/physicians/${deptId}`);
  },
  
  // Get departments by physician
  getDepartmentsByPhysician: (physicianId) => {
    return httpClient.get(`/api/affiliated_with/department/${physicianId}`);
  },
  
  // Count physicians in department
  countPhysiciansInDepartment: (deptId) => {
    return httpClient.get(`/api/affiliated_with/countphysician/${deptId}`);
  },
  
  // Check if affiliation is primary
  isPrimaryAffiliation: (physicianId) => {
    return httpClient.get(`/api/affiliated_with/primary/${physicianId}/`);
  },
  
  // Update primary affiliation
  updatePrimaryAffiliation: (physicianId, isPrimary) => {
    return httpClient.get(`/api/affiliated_with/primary/${physicianId}/`, { isPrimary });
  }
};

// src/api/procedureService.js
import httpClient from './httpClient';

export const procedureService = {
  // Add a new procedure
  addProcedure: (procedure) => {
    return httpClient.post('/api/procedure', procedure);
  },
  
  // Get all procedures
  getAllProcedures: () => {
    return httpClient.get('/api/procedure/');
  },
  
  // Get procedure cost by ID
  getProcedureCostById: (id) => {
    return httpClient.get(`/api/procedure/cost/${id}`);
  },
  
  // Get procedure cost by name
  getProcedureCostByName: (name) => {
    return httpClient.get(`/api/procedure/cost/${name}`);
  },
  
  // Update procedure cost
  updateProcedureCost: (id, cost) => {
    return httpClient.put('/api/procedure/cost/id', { id, cost });
  },
  
  // Update procedure name
  updateProcedureName: (id, name) => {
    return httpClient.put(`/api/procedure/name/${id}`, { name });
  }
};

// src/api/trainedInService.js
import httpClient from './httpClient';

export const trainedInService = {
  // Add a physician certification
  addCertification: (certification) => {
    return httpClient.post('/api/trained_in', certification);
  },
  
  // Get all procedures with certification
  getAllCertifiedProcedures: () => {
    return httpClient.get('/api/trained_in/');
  },
  
  // Get treatments by physician
  getTreatmentsByPhysician: (physicianId) => {
    return httpClient.get(`/api/trained_in/treatment/${physicianId}`);
  },
  
  // Get physicians by procedure
  getPhysiciansByProcedure: (procedureId) => {
    return httpClient.get(`/api/trained_in/physicians/${procedureId}`);
  },
  
  // Get soon-to-expire certifications
  getSoonExpiringCertifications: (physicianId) => {
    return httpClient.get(`/api/trained_in/expiredsooncerti/${physicianId}`);
  },
  
  // Update certification expiry
  updateCertificationExpiry: (physicianId, procedureId, expiryDate) => {
    return httpClient.put(`/api/trained_in/certificationexpiry/${physicianId}&${procedureId}`, { expiryDate });
  }
};

// src/api/patientService.js
import httpClient from './httpClient';

export const patientService = {
  // Add a new patient
  addPatient: (patient) => {
    return httpClient.post('/api/patient', patient);
  },
  
  // Get all patients
  getAllPatients: () => {
    return httpClient.get('/api/patient/');
  },
  
  // Get patients by physician
  getPatientsByPhysician: (physicianId) => {
    return httpClient.get(`/api/patient/${physicianId}`);
  },
  
  // Get patient details by physician and patient ID
  getPatientDetailsByPhysician: (physicianId, patientId) => {
    return httpClient.get(`/api/patient/${physicianId}/${patientId}`);
  },
  
  // Get patient insurance ID
  getPatientInsurance: (patientId) => {
    return httpClient.get(`/api/patient/insurance/${patientId}`);
  },
  
  // Update patient address
  updatePatientAddress: (ssn, address) => {
    return httpClient.put(`/api/patient/address/${ssn}`, { address });
  },
  
  // Update patient phone
  updatePatientPhone: (ssn, phone) => {
    return httpClient.put(`/api/patient/phone/${ssn}`, { phone });
  }
};

// src/api/nurseService.js
import httpClient from './httpClient';

export const nurseService = {
  // Add a new nurse
  addNurse: (nurse) => {
    return httpClient.post('/api/nurse', nurse);
  },
  
  // Get all nurses
  getAllNurses: () => {
    return httpClient.get('/api/nurse/');
  },
  
  // Get nurse by employee ID
  getNurseByEmpId: (empId) => {
    return httpClient.get(`/api/nurse/${empId}`);
  },
  
  // Get nurse position
  getNursePosition: (empId) => {
    return httpClient.get(`/api/nurse/position/${empId}`);
  },
  
  // Check if nurse is registered
  isNurseRegistered: (empId) => {
    return httpClient.get(`/api/nurse/registered/${empId}`);
  },
  
  // Update nurse registered status
  updateNurseRegistered: (empId, isRegistered) => {
    return httpClient.put(`/api/nurse/registered/${empId}`, { isRegistered });
  },
  
  // Update nurse SSN
  updateNurseSSN: (empId, ssn) => {
    return httpClient.put(`/api/nurse/ssn/${empId}`, { ssn });
  }
};

// src/api/appointmentService.js
import httpClient from './httpClient';

export const appointmentService = {
  // Add a new appointment
  addAppointment: (appointment) => {
    return httpClient.post('/api/appointment/', appointment);
  },
  
  // Get all appointments
  getAllAppointments: () => {
    return httpClient.get('/api/appointment');
  },
  
  // Get appointments by start date
  getAppointmentsByDate: (startDate) => {
    return httpClient.get(`/api/appointment/${startDate}`);
  },
  
  // Get patient by appointment ID
  getPatientByAppointment: (appointmentId) => {
    return httpClient.get(`/api/appointment/patient/${appointmentId}`);
  },
  
  // Get physician by appointment ID
  getPhysicianByAppointment: (appointmentId) => {
    return httpClient.get(`/api/appointment/physician/${appointmentId}`);
  },
  
  // Get nurse by appointment ID
  getNurseByAppointment: (appointmentId) => {
    return httpClient.get(`/api/appointment/nurse/${appointmentId}`);
  },
  
  // Get examination room by appointment ID
  getRoomByAppointment: (appointmentId) => {
    return httpClient.get(`/api/appointment/examinationroom/${appointmentId}`);
  },
  
  // Get physicians by patient ID
  getPhysiciansByPatient: (patientId) => {
    return httpClient.get(`/api/appointment/physician/${patientId}`);
  },
  
  // Get physician by patient ID and date
  getPhysicianByPatientAndDate: (patientId, date) => {
    return httpClient.get(`/api/appointment/physician/${patientId}/${date}`);
  },
  
  // Update examination room
  updateExaminationRoom: (appointmentId, room) => {
    return httpClient.put(`/api/appointment/room/${appointmentId}`, { room });
  }
};

// src/api/dashboardService.js
import httpClient from './httpClient';

export const dashboardService = {
  // Get summary statistics
  getStatistics: () => {
    return httpClient.get('/api/dashboard/statistics');
  },
  
  // Get recent appointments
  getRecentAppointments: () => {
    return httpClient.get('/api/dashboard/appointments/recent');
  },
  
  // Get department statistics
  getDepartmentStats: () => {
    return httpClient.get('/api/dashboard/departments/stats');
  },
  
  // Get physician workload
  getPhysicianWorkload: () => {
    return httpClient.get('/api/dashboard/physicians/workload');
  }
};

// src/api/index.js
export * from './physicianService';
export * from './departmentService';
export * from './affiliatedWithService';
export * from './procedureService';
export * from './trainedInService';
export * from './patientService';
export * from './nurseService';
export * from './appointmentService';
export * from './dashboardService';

// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import httpClient from '../api/httpClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await httpClient.post('/api/auth/verify', { token });
      setCurrentUser(response.data.user);
    } catch (err) {
      localStorage.removeItem('token');
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await httpClient.post('/api/auth/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchFunction().then(res => setData(res.data)) };
};

// src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues = {}, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    // Clear error on field change
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Reset form after successful submission if needed
      // setValues(initialValues);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
};

// src/utils/dateUtils.js
import { format, parseISO, differenceInDays, addDays } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date, formatString = 'MMM dd, yyyy HH:mm') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
};

export const daysBetween = (startDate, endDate) => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    return differenceInDays(end, start);
  } catch (error) {
    console.error('Error calculating days between:', error);
    return 0;
  }
};

export const addDaysToDate = (date, days) => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return addDays(parsedDate, days);
  } catch (error) {
    console.error('Error adding days to date:', error);
    return date;
  }
};

// src/utils/formatters.js
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};

export const formatSSN = (ssn) => {
  if (!ssn) return '';
  
  // Remove all non-digits
  const cleaned = ssn.toString().replace(/\D/g, '');
  
  // Format as XXX-XX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return ssn;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// src/utils/validators.js
export const validateRequired = (value) => {
  return value ? undefined : 'This field is required';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  
  return undefined;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  return undefined;
};

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'Phone number is required';
  
  const phoneRegex = /^\d{10}$/;
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (!phoneRegex.test(cleaned)) {
    return 'Phone number must be 10 digits';
  }
  
  return undefined;
};

export const validateSSN = (ssn) => {
  if (!ssn) return 'SSN is required';
  
  const ssnRegex = /^\d{9}$/;
  const cleaned = ssn.toString().replace(/\D/g, '');
  
  if (!ssnRegex.test(cleaned)) {
    return 'SSN must be 9 digits';
  }
  
  return undefined;
};

// src/components/common/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Hospital Management System
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
          <Link to="/physicians" className="hover:text-gray-200">Physicians</Link>
          <Link to="/departments" className="hover:text-gray-200">Departments</Link>
          <Link to="/patients" className="hover:text-gray-200">Patients</Link>
          <Link to="/nurses" className="hover:text-gray-200">Nurses</Link>
          <Link to="/appointments" className="hover:text-gray-200">Appointments</Link>
          <Link to="/procedures" className="hover:text-gray-200">Procedures</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-sm hidden md:inline">Hello, {currentUser.name}</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

// src/components/common/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserMd, FaHospital, FaUsers, FaNotesMedical, FaCalendarAlt, FaProcedures, FaUserNurse, FaChartLine } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/physicians', name: 'Physicians', icon: <FaUserMd /> },
    { path: '/departments', name: 'Departments', icon: <FaHospital /> },
    { path: '/affiliations', name: 'Affiliations', icon: <FaHospital /> },
    { path: '/patients', name: 'Patients', icon: <FaUsers /> },
    { path: '/nurses', name: 'Nurses', icon: <FaUserNurse /> },
    { path: '/procedures', name: 'Procedures', icon: <FaProcedures /> },
    { path: '/trained-in', name: 'Certifications', icon: <FaNotesMedical /> },
    { path: '/appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h2 className="text-xl font-bold">HMS</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-700"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-4 hover:bg-gray-700 transition-colors ${
                  location.pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

// src/components/common/Card.js
import React from 'react';

const Card = ({ title, children, className = '', titleClassName = '', bodyClassName = '', footerContent }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 py-3 border-b ${titleClassName}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
      {footerContent && (
        <div className="px-4 py-3 bg-gray-50 border-t">{footerContent}</div>
      )}
    </div>
  );
};

export default Card;

// src/components/common/Button.js
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50',
    link: 'bg-transparent text-blue-600 hover:underline'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

// src/components/common/Table.js
import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import Button from './Button';

const Table = ({ 
  columns, 
  data, 
  initialSortBy = [], 
  initialPageSize = 10, 
  pageSizeOptions = [5, 10, 20, 50], 
  className = ''
}) => {
  const [pageSize, setPage