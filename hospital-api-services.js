import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Complete Nurse service (extending what was already started)
export const nurseService = {
  // Basic CRUD operations
  getAllNurses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nurse/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nurses:', error);
      throw error;
    }
  },
  
  getNurseById: async (empId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nurse/${empId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching nurse with ID ${empId}:`, error);
      throw error;
    }
  },
  
  addNurse: async (nurseData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/nurse`, nurseData);
      return response.data;
    } catch (error) {
      console.error('Error adding nurse:', error);
      throw error;
    }
  },
  
  updateNurse: async (nurse) => {
    try {
      // Update registration status
      await axios.put(`${API_BASE_URL}/nurse/registered/${nurse.EmployeeID}`, { status: nurse.Registered ? 1 : 0 });
      // Update SSN
      await axios.put(`${API_BASE_URL}/nurse/ssn/${nurse.EmployeeID}`, { ssn: nurse.SSN });
      return true;
    } catch (error) {
      console.error('Error updating nurse:', error);
      throw error;
    }
  },
  
  // Advanced operations
  getNursePosition: async (empId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nurse/position/${empId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching position for nurse ${empId}:`, error);
      throw error;
    }
  },
  
  getNurseRegistrationStatus: async (empId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nurse/registered/${empId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registration status for nurse ${empId}:`, error);
      throw error;
    }
  },
  
  getPatientsByNurse: async (nurseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/patient/${nurseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patients for nurse ${nurseId}:`, error);
      throw error;
    }
  },
  
  getPatientsByNurseAndDate: async (nurseId, date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/patient/${nurseId}/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patients for nurse ${nurseId} on date ${date}:`, error);
      throw error;
    }
  }
};

// Room service
export const roomService = {
  // Based on available endpoints from the appointment section
  getRoomByPatientAndDate: async (patientId, date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/room/${patientId}/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room for patient ${patientId} on date ${date}:`, error);
      throw error;
    }
  },
  
  getRoomsByPhysicianAndDate: async (physicianId, date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/room/${physicianId}/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms for physician ${physicianId} on date ${date}:`, error);
      throw error;
    }
  },
  
  getRoomsByNurseAndDate: async (nurseId, date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/room/${nurseId}/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms for nurse ${nurseId} on date ${date}:`, error);
      throw error;
    }
  },
  
  updateAppointmentRoom: async (appointmentId, room) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/appointment/room/${appointmentId}`, { room });
      return response.data;
    } catch (error) {
      console.error(`Error updating room for appointment ${appointmentId}:`, error);
      throw error;
    }
  }
};

// Certification service 
export const certificationService = {
  // Based on the TrainedIn endpoints
  getAllCertifications: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trained_in/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }
  },
  
  addCertification: async (certificationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trained_in`, certificationData);
      return response.data;
    } catch (error) {
      console.error('Error adding certification:', error);
      throw error;
    }
  },
  
  getPhysicianCertifications: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trained_in/treatment/${physicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching certifications for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  getPhysiciansByCertification: async (procedureId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trained_in/physicians/${procedureId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physicians for procedure ${procedureId}:`, error);
      throw error;
    }
  },
  
  getExpiringCertifications: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trained_in/expiredsooncerti/${physicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching expiring certifications for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  updateCertificationExpiry: async (physicianId, procedureId, expiryDate) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/trained_in/certificationexpiry/${physicianId}&${procedureId}`, 
        { expiryDate });
      return response.data;
    } catch (error) {
      console.error(`Error updating certification expiry for physician ${physicianId} and procedure ${procedureId}:`, error);
      throw error;
    }
  }
};

// Insurance service
export const insuranceService = {
  // Based on patient endpoints that reference insurance
  getPatientInsurance: async (patientId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patient/insurance/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching insurance for patient ${patientId}:`, error);
      throw error;
    }
  }
  
  // Note: Since there are no other insurance-specific endpoints in the documentation,
  // this service is minimal. You might want to expand it based on your requirements.
};

// Affiliation service
export const affiliationService = {
  getAllAffiliations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with`);
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliations:', error);
      throw error;
    }
  },
  
  addAffiliation: async (affiliationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/affiliated_with/post`, affiliationData);
      return response.data;
    } catch (error) {
      console.error('Error adding affiliation:', error);
      throw error;
    }
  },
  
  getPhysiciansByDepartment: async (deptId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/physicians/${deptId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physicians for department ${deptId}:`, error);
      throw error;
    }
  },
  
  getDepartmentsByPhysician: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/department/${physicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching departments for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  getPhysicianCountByDepartment: async (deptId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/countphysician/${deptId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physician count for department ${deptId}:`, error);
      throw error;
    }
  },
  
  isPrimaryAffiliation: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/primary/${physicianId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error checking primary affiliation for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  updatePrimaryAffiliation: async (physicianId, isPrimary) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/primary/${physicianId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error updating primary affiliation for physician ${physicianId}:`, error);
      throw error;
    }
  }
};

// Dashboard service for stats and reports
export const dashboardService = {
  getPhysicianStats: async () => {
    try {
      const physicians = await physicianService.getAllPhysicians();
      const departmentCounts = {};
      
      // Get department counts
      for (const physician of physicians) {
        const departments = await affiliationService.getDepartmentsByPhysician(physician.EmployeeID);
        for (const dept of departments) {
          if (departmentCounts[dept.Name]) {
            departmentCounts[dept.Name]++;
          } else {
            departmentCounts[dept.Name] = 1;
          }
        }
      }
      
      return {
        totalPhysicians: physicians.length,
        departmentDistribution: departmentCounts
      };
    } catch (error) {
      console.error('Error generating physician stats:', error);
      throw error;
    }
  },
  
  getPatientStats: async () => {
    try {
      const patients = await patientService.getAllPatients();
      const appointments = await appointmentService.getAllAppointments();
      
      // Count appointments per patient
      const appointmentsPerPatient = {};
      for (const appointment of appointments) {
        if (appointmentsPerPatient[appointment.Patient]) {
          appointmentsPerPatient[appointment.Patient]++;
        } else {
          appointmentsPerPatient[appointment.Patient] = 1;
        }
      }
      
      return {
        totalPatients: patients.length,
        appointmentsDistribution: appointmentsPerPatient,
        averageAppointmentsPerPatient: Object.values(appointmentsPerPatient).reduce((a, b) => a + b, 0) / patients.length
      };
    } catch (error) {
      console.error('Error generating patient stats:', error);
      throw error;
    }
  },
  
  getDepartmentStats: async () => {
    try {
      const departments = await departmentService.getAllDepartments();
      const departmentStats = [];
      
      for (const dept of departments) {
        const physicianCount = await affiliationService.getPhysicianCountByDepartment(dept.DepartmentID);
        const head = await departmentService.getDepartmentHead(dept.DepartmentID);
        
        departmentStats.push({
          department: dept.Name,
          id: dept.DepartmentID,
          physicianCount,
          head: head ? head.Name : 'No head assigned'
        });
      }
      
      return departmentStats;
    } catch (error) {
      console.error('Error generating department stats:', error);
      throw error;
    }
  },
  
  getAppointmentStats: async () => {
    try {
      const appointments = await appointmentService.getAllAppointments();
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Get today's appointments
      const todayAppointments = await appointmentService.getAppointmentsByDate(todayString);
      
      // Count by month for current year
      const appointmentsByMonth = {};
      for (const appointment of appointments) {
        const date = new Date(appointment.StartDateTime);
        if (date.getFullYear() === today.getFullYear()) {
          const month = date.getMonth();
          if (appointmentsByMonth[month]) {
            appointmentsByMonth[month]++;
          } else {
            appointmentsByMonth[month] = 1;
          }
        }
      }
      
      return {
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        appointmentsByMonth
      };
    } catch (error) {
      console.error('Error generating appointment stats:', error);
      throw error;
    }
  }
};

// Export all services
export {
  patientService,
  physicianService,
  departmentService,
  appointmentService,
  procedureService,
  nurseService,
  roomService,
  certificationService,
  insuranceService,
  affiliationService,
  dashboardService
};
