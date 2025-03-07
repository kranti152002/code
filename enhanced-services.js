import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Patient service with enhanced functionality
export const patientService = {
  // Basic CRUD operations
  getAllPatients: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patient/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },
  
  getPatientById: async (ssn) => {
    try {
      // Since there's no direct endpoint for getting patient by SSN, 
      // we'll get all and filter
      const patients = await patientAPI.getAllPatients();
      return patients.data.find(patient => patient.SSN === ssn);
    } catch (error) {
      console.error(`Error fetching patient with SSN ${ssn}:`, error);
      throw error;
    }
  },
  
  addPatient: async (patientData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/patient`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },
  
  updatePatient: async (patient) => {
    try {
      // Update address
      await axios.put(`${API_BASE_URL}/patient/address/${patient.SSN}`, { address: patient.Address });
      // Update phone
      await axios.put(`${API_BASE_URL}/patient/phone/${patient.SSN}`, { phone: patient.Phone });
      return true;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },
  
  // Advanced operations
  getPatientsByPhysician: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patient/${physicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patients for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  getPatientInsurance: async (patientId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patient/insurance/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching insurance for patient ${patientId}:`, error);
      throw error;
    }
  },
  
  searchPatients: async (searchTerm) => {
    try {
      const patients = await patientAPI.getAllPatients();
      // Filter patients by name containing the search term
      return patients.data.filter(patient => 
        patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }
};

// Physician service with enhanced functionality
export const physicianService = {
  // Basic CRUD operations
  getAllPhysicians: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/physician/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching physicians:', error);
      throw error;
    }
  },
  
  getPhysicianById: async (empId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/physician/empid/${empId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physician with ID ${empId}:`, error);
      throw error;
    }
  },
  
  addPhysician: async (physicianData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/physician/post`, physicianData);
      return response.data;
    } catch (error) {
      console.error('Error adding physician:', error);
      throw error;
    }
  },
  
  updatePhysician: async (physician) => {
    try {
      // Update name
      await axios.put(`${API_BASE_URL}/physician/update/name/${physician.EmployeeID}`, { name: physician.Name });
      // Update position
      await axios.put(`${API_BASE_URL}/update/position/${physician.Position}/${physician.EmployeeID}`);
      // Update SSN
      await axios.put(`${API_BASE_URL}/physician/update/ssn/${physician.EmployeeID}`, { ssn: physician.SSN });
      return true;
    } catch (error) {
      console.error('Error updating physician:', error);
      throw error;
    }
  },
  
  // Advanced operations
  getPhysiciansByName: async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/physician/name/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physicians with name ${name}:`, error);
      throw error;
    }
  },
  
  getPhysiciansByPosition: async (position) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/physician/position/${position}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physicians with position ${position}:`, error);
      throw error;
    }
  },
  
  getPhysicianSpecializations: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trained_in/treatment/${physicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching specializations for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  getPhysicianDepartments: async (physicianId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/department/${physicianId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching departments for physician ${physicianId}:`, error);
      throw error;
    }
  }
};

// Department service with enhanced functionality
export const departmentService = {
  // Basic CRUD operations
  getAllDepartments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },
  
  getDepartmentById: async (deptId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department/${deptId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department with ID ${deptId}:`, error);
      throw error;
    }
  },
  
  addDepartment: async (departmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/department`, departmentData);
      return response.data;
    } catch (error) {
      console.error('Error adding department:', error);
      throw error;
    }
  },
  
  updateDepartment: async (department) => {
    try {
      // Update department name
      await axios.put(`${API_BASE_URL}/department/update/deptname/${department.DepartmentID}`, { name: department.Name });
      // Update department head if provided
      if (department.Head) {
        await axios.put(`${API_BASE_URL}/department/update/headid/${department.DepartmentID}`, { headId: department.Head });
      }
      return true;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },
  
  // Advanced operations
  getDepartmentHead: async (deptId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department/head/${deptId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching head of department ${deptId}:`, error);
      throw error;
    }
  },
  
  getDepartmentHeadCertification: async (deptId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department/headcertification/${deptId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching head certification for department ${deptId}:`, error);
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
  
  getPhysiciansByDepartment: async (deptId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliated_with/physicians/${deptId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physicians for department ${deptId}:`, error);
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
  }
};

// Appointment service with enhanced functionality
export const appointmentService = {
  // Basic CRUD operations
  getAllAppointments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  
  addAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointment/`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  },
  
  updateAppointmentRoom: async (appointmentId, room) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/appointment/room/${appointmentId}`, { room: room });
      return response.data;
    } catch (error) {
      console.error(`Error updating room for appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  // Advanced operations
  getAppointmentsByDate: async (date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/${date}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for date ${date}:`, error);
      throw error;
    }
  },
  
  getPatientByAppointment: async (appointmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/patient/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient for appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  getPhysicianByAppointment: async (appointmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/physician/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physician for appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  getNurseByAppointment: async (appointmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/nurse/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching nurse for appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  getAppointmentsByPhysician: async (physicianId) => {
    try {
      // Get all patients for this physician
      const patients = await axios.get(`${API_BASE_URL}/appointment/patient/${physicianId}`);
      // Get all appointments
      const allAppointments = await axios.get(`${API_BASE_URL}/appointment`);
      
      // Filter appointments for these patients
      return allAppointments.data.filter(appointment => 
        patients.data.some(patient => patient.SSN === appointment.Patient)
      );
    } catch (error) {
      console.error(`Error fetching appointments for physician ${physicianId}:`, error);
      throw error;
    }
  },
  
  getAppointmentsByPatient: async (patientId) => {
    try {
      // Get appointment dates for this patient
      const dates = await axios.get(`${API_BASE_URL}/appointment/date/${patientId}`);
      // Create appointment objects with available information
      return dates.data.map(date => ({
        Patient: patientId,
        StartDateTime: date,
        // Other fields would need additional API calls
      }));
    } catch (error) {
      console.error(`Error fetching appointments for patient ${patientId}:`, error);
      throw error;
    }
  }
};

// Procedure service with enhanced functionality
export const procedureService = {
  // Basic CRUD operations
  getAllProcedures: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/procedure/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching procedures:', error);
      throw error;
    }
  },
  
  getProcedureById: async (procedureId) => {
    try {
      // Fetch all procedures and find the requested one
      const procedures = await axios.get(`${API_BASE_URL}/procedure/`);
      return procedures.data.find(procedure => procedure.Code === procedureId);
    } catch (error) {
      console.error(`Error fetching procedure with ID ${procedureId}:`, error);
      throw error;
    }
  },
  
  addProcedure: async (procedureData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/procedure`, procedureData);
      return response.data;
    } catch (error) {
      console.error('Error adding procedure:', error);
      throw error;
    }
  },
  
  updateProcedure: async (procedure) => {
    try {
      // Update procedure name
      await axios.put(`${API_BASE_URL}/procedure/name/${procedure.Code}`, { name: procedure.Name });
      // Update procedure cost
      await axios.put(`${API_BASE_URL}/procedure/cost/${procedure.Code}`, { cost: procedure.Cost });
      return true;
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },
  
  // Advanced operations
  getProcedureCostById: async (procedureId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/procedure/cost/${procedureId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cost for procedure ${procedureId}:`, error);
      throw error;
    }
  },
  
  getProcedureCostByName: async (procedureName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/procedure/cost/${procedureName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cost for procedure named ${procedureName}:`, error);
      throw error;
    }
  },
  
  getPhysiciansByProcedure: async (procedureId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trained_in/physicians/${procedureId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching physicians for procedure ${procedureId}:`, error);
      throw error;
    }
  }
};

// Nurse service with enhanced functionality
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
  getN