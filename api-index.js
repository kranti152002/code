// Export all API services from one file for easy importing

// Import services
import patientAPI from './patientService';
import physicianAPI from './physicianService';
import departmentAPI from './departmentService';
import appointmentAPI from './appointmentService';
import procedureAPI from './procedureService';
import nurseAPI from './nurseService';
import roomAPI from './roomService';
import certificationAPI from './certificationService';
import insuranceAPI from './insuranceService';
import affiliationAPI from './affiliationService';
import dashboardAPI from './dashboardService';

// Export all services
export {
  patientAPI,
  physicianAPI,
  departmentAPI,
  appointmentAPI,
  procedureAPI,
  nurseAPI,
  roomAPI,
  certificationAPI,
  insuranceAPI,
  affiliationAPI,
  dashboardAPI
};

// Export config
export * from './config';
