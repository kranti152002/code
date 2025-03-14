// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Patients from './pages/Patients';
import Physicians from './pages/Physicians';
import Departments from './pages/Departments';
import Appointments from './pages/Appointments';
import Procedures from './pages/Procedures';
import Nurses from './pages/Nurses';
import TrainedIn from './pages/TrainedIn';
import AffiliatedWith from './pages/AffiliatedWith';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/physicians" element={<Physicians />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/procedures" element={<Procedures />} />
            <Route path="/nurses" element={<Nurses />} />
            <Route path="/trained-in" element={<TrainedIn />} />
            <Route path="/affiliated-with" element={<AffiliatedWith />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

// File: src/App.css
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
}

.page-title {
  color: #3c4b64;
  border-bottom: 2px solid #3c4b64;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.card {
  transition: transform 0.3s;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.card-img-top {
  height: 180px;
  object-fit: cover;
}

.table {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #3c4b64;
  border-color: #3c4b64;
}

.btn-primary:hover {
  background-color: #2d3a4f;
  border-color: #2d3a4f;
}

.service-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.service-card .card-body {
  flex: 1;
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #3c4b64;
}

// File: src/components/common/Navbar.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-hospital-alt me-2"></i>
          HMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <NavDropdown title="Management" id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/patients">
                Patients
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/physicians">
                Physicians
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/nurses">
                Nurses
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/departments">
                Departments
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/appointments">
                Appointments
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/procedures">
                Procedures
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Relationships" id="relationship-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/trained-in">
                Trained In
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/affiliated-with">
                Affiliated With
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#">
              <i className="fas fa-user me-1"></i> Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

// File: src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Patient APIs
export const patientAPI = {
  getAllPatients: () => axios.get(`${API_BASE_URL}/patient/`),
  addPatient: (patient) => axios.post(`${API_BASE_URL}/patient`, patient),
  getPatientByPhysician: (physicianId) => axios.get(`${API_BASE_URL}/patient/${physicianId}`),
  getPatientDetails: (physicianId, patientId) => axios.get(`${API_BASE_URL}/patient/${physicianId}/${patientId}`),
  getInsurance: (patientId) => axios.get(`${API_BASE_URL}/patient/insurance/${patientId}`),
  updateAddress: (ssn, address) => axios.put(`${API_BASE_URL}/patient/address/${ssn}`, address),
  updatePhone: (ssn, phone) => axios.put(`${API_BASE_URL}/patient/phone/${ssn}`, phone)
};

// Physician APIs
export const physicianAPI = {
  getAllPhysicians: () => axios.get(`${API_BASE_URL}/physician/`),
  addPhysician: (physician) => axios.post(`${API_BASE_URL}/physician/post`, physician),
  getPhysicianByName: (name) => axios.get(`${API_BASE_URL}/physician/name/${name}`),
  getPhysiciansByPosition: (position) => axios.get(`${API_BASE_URL}/physician/position/${position}`),
  getPhysicianByEmpId: (empId) => axios.get(`${API_BASE_URL}/physician/empid/${empId}`),
  updatePosition: (position, employeeId) => axios.put(`${API_BASE_URL}/update/position/${position}/${employeeId}`),
  updateName: (empId, name) => axios.put(`${API_BASE_URL}/physician/update/name/${empId}`, name),
  updateSSN: (empId, ssn) => axios.put(`${API_BASE_URL}/physician/update/ssn/${empId}`, ssn)
};

// Department APIs
export const departmentAPI = {
  getAllDepartments: () => axios.get(`${API_BASE_URL}/department/`),
  addDepartment: (department) => axios.post(`${API_BASE_URL}/department`, department),
  getDepartmentById: (deptId) => axios.get(`${API_BASE_URL}/department/${deptId}`),
  getDepartmentHead: (deptId) => axios.get(`${API_BASE_URL}/department/head/${deptId}`),
  getHeadCertification: (deptId) => axios.get(`${API_BASE_URL}/department/headcertification/${deptId}`),
  getDepartmentsByHead: (headId) => axios.get(`${API_BASE_URL}/department/${headId}`),
  checkIfPhysicianIsHead: (physicianId) => axios.get(`${API_BASE_URL}/department/check/${physicianId}`),
  updateDepartmentHead: (deptId, headId) => axios.put(`${API_BASE_URL}/department/update/headid/${deptId}`, headId),
  updateDepartmentName: (deptId, name) => axios.put(`${API_BASE_URL}/department/update/deptname/${deptId}`, name)
};

// Appointment APIs
export const appointmentAPI = {
  getAllAppointments: () => axios.get(`${API_BASE_URL}/appointment`),
  addAppointment: (appointment) => axios.post(`${API_BASE_URL}/appointment/`, appointment),
  getAppointmentsByDate: (startDate) => axios.get(`${API_BASE_URL}/appointment/${startDate}`),
  getPatientByAppointment: (appointmentId) => axios.get(`${API_BASE_URL}/appointment/patient/${appointmentId}`),
  getPhysicianByAppointment: (appointmentId) => axios.get(`${API_BASE_URL}/appointment/physician/${appointmentId}`),
  getNurseByAppointment: (appointmentId) => axios.get(`${API_BASE_URL}/appointment/nurse/${appointmentId}`),
  getRoomByAppointment: (appointmentId) => axios.get(`${API_BASE_URL}/appointment/examinationroom/${appointmentId}`),
  getPhysiciansByPatient: (patientId) => axios.get(`${API_BASE_URL}/appointment/physician/${patientId}`),
  getPhysicianByPatientAndDate: (patientId, date) => axios.get(`${API_BASE_URL}/appointment/physician/${patientId}/${date}`),
  getNursesByPatient: (patientId) => axios.get(`${API_BASE_URL}/appointment/nurse/${patientId}`),
  getNurseByPatientAndDate: (patientId, date) => axios.get(`${API_BASE_URL}/appointment/nurse/${patientId}/${date}`),
  getAppointmentDatesByPatient: (patientId) => axios.get(`${API_BASE_URL}/appointment/date/${patientId}`),
  getPatientsByPhysician: (physicianId) => axios.get(`${API_BASE_URL}/appointment/patient/${physicianId}`),
  getPatientsByPhysicianAndDate: (physicianId, date) => axios.get(`${API_BASE_URL}/appointment/patient/${physicianId}/${date}`),
  updateRoom: (appointmentId, room) => axios.put(`${API_BASE_URL}/appointment/room/${appointmentId}`, room)
};

// Procedure APIs
export const procedureAPI = {
  getAllProcedures: () => axios.get(`${API_BASE_URL}/procedure/`),
  addProcedure: (procedure) => axios.post(`${API_BASE_URL}/procedure`, procedure),
  getProcedureCostById: (id) => axios.get(`${API_BASE_URL}/procedure/cost/${id}`),
  getProcedureCostByName: (name) => axios.get(`${API_BASE_URL}/procedure/cost/${name}`),
  updateProcedureCost: (id, cost) => axios.put(`${API_BASE_URL}/procedure/cost/${id}`, cost),
  updateProcedureName: (id, name) => axios.put(`${API_BASE_URL}/procedure/name/${id}`, name)
};

// Nurse APIs
export const nurseAPI = {
  getAllNurses: () => axios.get(`${API_BASE_URL}/nurse/`),
  addNurse: (nurse) => axios.post(`${API_BASE_URL}/nurse`, nurse),
  getNurseByEmpId: (empId) => axios.get(`${API_BASE_URL}/nurse/${empId}`),
  getNursePosition: (empId) => axios.get(`${API_BASE_URL}/nurse/position/${empId}`),
  isNurseRegistered: (empId) => axios.get(`${API_BASE_URL}/nurse/registered/${empId}`),
  updateRegistrationStatus: (empId, status) => axios.put(`${API_BASE_URL}/nurse/registered/${empId}`, status),
  updateSSN: (empId, ssn) => axios.put(`${API_BASE_URL}/nurse/ssn/${empId}`, ssn)
};

// AffiliatedWith APIs
export const affiliatedWithAPI = {
  addAffiliation: (affiliation) => axios.post(`${API_BASE_URL}/affiliated_with/post`, affiliation),
  getPhysiciansByDepartment: (deptId) => axios.get(`${API_BASE_URL}/affiliated_with/physicians/${deptId}`),
  getDepartmentsByPhysician: (physicianId) => axios.get(`${API_BASE_URL}/affiliated_with/department/${physicianId}`),
  getPhysicianCountByDepartment: (deptId) => axios.get(`${API_BASE_URL}/affiliated_with/countphysician/${deptId}`),
  isPrimaryAffiliation: (physicianId) => axios.get(`${API_BASE_URL}/affiliated_with/primary/${physicianId}`),
  updatePrimaryAffiliation: (physicianId) => axios.get(`${API_BASE_URL}/affiliated_with/primary/${physicianId}`)
};

// TrainedIn APIs
export const trainedInAPI = {
  addCertification: (certification) => axios.post(`${API_BASE_URL}/trained_in`, certification),
  getAllProcedures: () => axios.get(`${API_BASE_URL}/trained_in/`),
  getTreatmentsByPhysician: (physicianId) => axios.get(`${API_BASE_URL}/trained_in/treatment/${physicianId}`),
  getPhysiciansByProcedure: (procedureId) => axios.get(`${API_BASE_URL}/trained_in/physicians/${procedureId}`),
  getExpiringSoonCertifications: (physicianId) => axios.get(`${API_BASE_URL}/trained_in/expiredsooncerti/${physicianId}`),
  updateCertificationExpiry: (physicianId, procedureId, date) => axios.put(`${API_BASE_URL}/trained_in/certificationexpiry/${physicianId}&${procedureId}`, date)
};

// File: src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const services = [
    {
      title: 'Patient Management',
      description: 'Register new patients, update existing records, and manage patient information efficiently.',
      icon: 'fas fa-user-injured',
      link: '/patients'
    },
    {
      title: 'Physician Directory',
      description: 'Browse our qualified physicians, their specialties, and departmental affiliations.',
      icon: 'fas fa-user-md',
      link: '/physicians'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Schedule, reschedule or cancel appointments with our physicians and nurses.',
      icon: 'far fa-calendar-alt',
      link: '/appointments'
    },
    {
      title: 'Department Information',
      description: 'View all departments, their heads, and associated physicians.',
      icon: 'fas fa-hospital',
      link: '/departments'
    },
    {
      title: 'Procedure Catalog',
      description: 'Browse all available procedures, their costs, and qualified physicians.',
      icon: 'fas fa-procedures',
      link: '/procedures'
    },
    {
      title: 'Nursing Staff',
      description: 'View all nurses, their positions, and qualifications.',
      icon: 'fas fa-user-nurse',
      link: '/nurses'
    }
  ];

  return (
    <Container>
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Hospital Management System</h1>
        <p className="lead">
          A comprehensive solution for managing hospital operations, patient records, and staff information.
        </p>
        <hr className="my-4" />
        <p>
          Our system provides tools for patients, physicians, and administrators to streamline healthcare delivery.
        </p>
        <Link to="/patients" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </div>

      <h2 className="text-center mb-4 page-title">Our Services</h2>
      <Row>
        {services.map((service, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="service-card text-center h-100">
              <Card.Body>
                <i className={`${service.icon} service-icon`}></i>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Link to={service.link} className="btn btn-primary">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-5 p-4 bg-light rounded">
        <h2 className="text-center mb-4">Hospital Statistics</h2>
        <Row className="text-center">
          <Col md={3}>
            <div className="p-3">
              <h3 className="text-primary">500+</h3>
              <p>Patients</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-3">
              <h3 className="text-primary">50+</h3>
              <p>Physicians</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-3">
              <h3 className="text-primary">100+</h3>
              <p>Nurses</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-3">
              <h3 className="text-primary">10+</h3>
              <p>Departments</p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Home;

// File: src/pages/Patients.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { patientAPI } from '../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    SSN: '',
    Name: '',
    Address: '',
    Phone: '',
    InsuranceID: '',
    PCP: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAllPatients();
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setFormData({
      SSN: '',
      Name: '',
      Address: '',
      Phone: '',
      InsuranceID: '',
      PCP: ''
    });
  };

  const handleShowModal = (patient = null) => {
    if (patient) {
      setSelectedPatient(patient);
      setFormData({
        SSN: patient.SSN,
        Name: patient.Name,
        Address: patient.Address,
        Phone: patient.Phone,
        InsuranceID: patient.InsuranceID,
        PCP: patient.PCP
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        // Update patient address
        await patientAPI.updateAddress(formData.SSN, { address: formData.Address });
        // Update patient phone
        await patientAPI.updatePhone(formData.SSN, { phone: formData.Phone });
      } else {
        // Add new patient
        await patientAPI.addPatient(formData);
      }
      fetchPatients();
      handleCloseModal();
    } catch (err) {
      setError(selectedPatient ? 'Failed to update patient' : 'Failed to add patient');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading patients...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Patient Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Patient
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>SSN</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Insurance ID</th>
                <th>Primary Care Physician</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.SSN}>
                    <td>{patient.SSN}</td>
                    <td>{patient.Name}</td>
                    <td>{patient.Address}</td>
                    <td>{patient.Phone}</td>
                    <td>{patient.InsuranceID}</td>
                    <td>{patient.PCP}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleShowModal(patient)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPatient ? 'Edit Patient' : 'Add New Patient'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SSN</Form.Label>
                  <Form.Control
                    type="number"
                    name="SSN"
                    value={formData.SSN}
                    onChange={handleInputChange}
                    readOnly={!!selectedPatient}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    readOnly={!!selectedPatient}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Insurance ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="InsuranceID"
                    value={formData.InsuranceID}
                    onChange={handleInputChange}
                    readOnly={!!selectedPatient}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Care Physician (ID)</Form.Label>
                  <Form.Control
                    type="number"
                    name="PCP"
                    value={formData.PCP}
                    onChange={handleInputChange}
                    readOnly={!!selectedPatient}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedPatient ? 'Update Patient' : 'Add Patient'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Patients;

// File: src/pages/Physicians.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { physicianAPI } from '../services/api';

const Physicians = () => {
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [formData, setFormData] = useState({
    EmployeeID: '',
    Name: '',
    Position: '',
    SSN: ''
  });

  useEffect(() => {
    fetchPhysicians();
  }, []);

  const fetchPhysicians = async () => {
    try {
      setLoading(true);
      const response = await physicianAPI.getAllPhysicians();
      setPhysicians(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch physicians');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhysician(null);
    setFormData({
      EmployeeID: '',
      Name: '',
      Position: '',
      SSN: ''
    });
  };

  const handleShowModal = (physician = null) => {
    if (physician) {
      setSelectedPhysician(physician);
      setFormData({
        EmployeeID: physician.EmployeeID,
        Name: physician.Name,
        Position: physician.Position,
        SSN: physician.SSN
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPhysician) {
        // Update physician name
        await physicianAPI.updateName(formData.EmployeeID, { name: formData.Name });
        // Update physician position
        await physicianAPI.updatePosition(formData.Position, formData.EmployeeID);
        // Update physician SSN
        await physicianAPI.updateSSN(formData.EmployeeID, { ssn: formData.SSN });
      } else {
        // Add new physician
        await physicianAPI.addPhysician(formData);
      }
      fetchPhysicians();
      handleCloseModal();
    } catch (err) {
      setError(selectedPhysician ? 'Failed to update physician' : 'Failed to add physician');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading physicians...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Physician Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Physician
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>SSN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {physicians.length > 0 ? (
                physicians.map((physician) => (
                  <tr key={physician.EmployeeID}>
                    <td>{physician.EmployeeID}</td>
                    <td>{physician.Name}</td>
                    <td>{physician.Position}</td>
                    <td>{physician.SSN}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleShowModal(physician)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No physicians found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title