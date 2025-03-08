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
          <Modal.Title>{selectedPhysician ? 'Edit Physician' : 'Add New Physician'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="EmployeeID"
                    value={formData.EmployeeID}
                    onChange={handleInputChange}
                    readOnly={!!selectedPhysician}
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    as="select"
                    name="Position"
                    value={formData.Position}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Position</option>
                    <option value="Head">Head</option>
                    <option value="Senior">Senior</option>
                    <option value="Attending">Attending</option>
                    <option value="Resident">Resident</option>
                    <option value="Intern">Intern</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SSN</Form.Label>
                  <Form.Control
                    type="number"
                    name="SSN"
                    value={formData.SSN}
                    onChange={handleInputChange}
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
                {selectedPhysician ? 'Update Physician' : 'Add Physician'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Physicians;

// File: src/pages/Departments.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { departmentAPI, physicianAPI } from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    DepartmentID: '',
    Name: '',
    Head: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptResponse, physicianResponse] = await Promise.all([
        departmentAPI.getAllDepartments(),
        physicianAPI.getAllPhysicians()
      ]);
      setDepartments(deptResponse.data);
      setPhysicians(physicianResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
    setFormData({
      DepartmentID: '',
      Name: '',
      Head: ''
    });
  };

  const handleShowModal = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        DepartmentID: department.DepartmentID,
        Name: department.Name,
        Head: department.Head
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
      if (selectedDepartment) {
        // Update department name
        await departmentAPI.updateDepartmentName(formData.DepartmentID, { name: formData.Name });
        // Update department head
        await departmentAPI.updateDepartmentHead(formData.DepartmentID, { headId: formData.Head });
      } else {
        // Add new department
        await departmentAPI.addDepartment(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(selectedDepartment ? 'Failed to update department' : 'Failed to add department');
      console.error(err);
    }
  };

  const getPhysicianName = (headId) => {
    const physician = physicians.find(p => p.EmployeeID === headId);
    return physician ? physician.Name : 'Unknown';
  };

  if (loading) return <div className="text-center">Loading departments...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Department Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Department
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Name</th>
                <th>Head</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <tr key={department.DepartmentID}>
                    <td>{department.DepartmentID}</td>
                    <td>{department.Name}</td>
                    <td>{getPhysicianName(department.Head)}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleShowModal(department)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDepartment ? 'Edit Department' : 'Add New Department'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="DepartmentID"
                    value={formData.DepartmentID}
                    onChange={handleInputChange}
                    readOnly={!!selectedDepartment}
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Department Head</Form.Label>
                  <Form.Control
                    as="select"
                    name="Head"
                    value={formData.Head}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department Head</option>
                    {physicians.map(physician => (
                      <option key={physician.EmployeeID} value={physician.EmployeeID}>
                        {physician.Name} - {physician.Position}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedDepartment ? 'Update Department' : 'Add Department'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Departments;

// File: src/pages/Appointments.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { appointmentAPI, patientAPI, physicianAPI, nurseAPI } from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    AppointmentID: '',
    Patient: '',
    PrepNurse: '',
    Physician: '',
    Start: '',
    End: '',
    ExaminationRoom: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, patientsRes, physiciansRes, nursesRes] = await Promise.all([
        appointmentAPI.getAllAppointments(),
        patientAPI.getAllPatients(),
        physicianAPI.getAllPhysicians(),
        nurseAPI.getAllNurses()
      ]);
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setPhysicians(physiciansRes.data);
      setNurses(nursesRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setFormData({
      AppointmentID: '',
      Patient: '',
      PrepNurse: '',
      Physician: '',
      Start: '',
      End: '',
      ExaminationRoom: ''
    });
  };

  const handleShowModal = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        AppointmentID: appointment.AppointmentID,
        Patient: appointment.Patient,
        PrepNurse: appointment.PrepNurse,
        Physician: appointment.Physician,
        Start: formatDateTimeForInput(appointment.Start),
        End: formatDateTimeForInput(appointment.End),
        ExaminationRoom: appointment.ExaminationRoom
      });
    } else {
      setFormData({
        ...formData,
        Start: formatDateTimeForInput(new Date()),
        End: formatDateTimeForInput(new Date(new Date().getTime() + 30 * 60000)) // 30 minutes later
      });
    }
    setShowModal(true);
  };

  const formatDateTimeForInput = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAppointment) {
        // Only room can be updated for existing appointments
        await appointmentAPI.updateRoom(formData.AppointmentID, { room: formData.ExaminationRoom });
      } else {
        // Add new appointment
        await appointmentAPI.addAppointment(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(selectedAppointment ? 'Failed to update appointment' : 'Failed to add appointment');
      console.error(err);
    }
  };

  const getPatientName = (ssn) => {
    const patient = patients.find(p => p.SSN === ssn);
    return patient ? patient.Name : 'Unknown';
  };

  const getPhysicianName = (id) => {
    const physician = physicians.find(p => p.EmployeeID === id);
    return physician ? physician.Name : 'Unknown';
  };

  const getNurseName = (id) => {
    const nurse = nurses.find(n => n.EmployeeID === id);
    return nurse ? nurse.Name : 'Unknown';
  };

  if (loading) return <div className="text-center">Loading appointments...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Appointment Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Schedule New Appointment
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Physician</th>
                <th>Nurse</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.AppointmentID}>
                    <td>{appointment.AppointmentID}</td>
                    <td>{getPatientName(appointment.Patient)}</td>
                    <td>{getPhysicianName(appointment.Physician)}</td>
                    <td>{getNurseName(appointment.PrepNurse)}</td>
                    <td>{formatDateTime(appointment.Start)}</td>
                    <td>{formatDateTime(appointment.End)}</td>
                    <td>{appointment.ExaminationRoom}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleShowModal(appointment)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!selectedAppointment && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient</Form.Label>
                    <Form.Control
                      as="select"
                      name="Patient"
                      value={formData.Patient}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.SSN} value={patient.SSN}>
                          {patient.Name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Physician</Form.Label>
                    <Form.Control
                      as="select"
                      name="Physician"
                      value={formData.Physician}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Physician</option>
                      {physicians.map(physician => (
                        <option key={physician.EmployeeID} value={physician.EmployeeID}>
                          {physician.Name} - {physician.Position}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            )}
            {!selectedAppointment && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nurse</Form.Label>
                    <Form.Control
                      as="select"
                      name="PrepNurse"
                      value={formData.PrepNurse}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Nurse</option>
                      {nurses.map(nurse => (
                        <option key={nurse.EmployeeID} value={nurse.EmployeeID}>
                          {nurse.Name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Appointment ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="AppointmentID"
                      value={formData.AppointmentID}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            {!selectedAppointment && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="Start"
                      value={formData.Start}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="End"
                      value={formData.End}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Examination Room</Form.Label>
                  <Form.Control
                    type="text"
                    name="ExaminationRoom"
                    value={formData.ExaminationRoom}
                    onChange={handleInputChange}
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
                {selectedAppointment ? 'Update Appointment' : 'Schedule Appointment'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Appointments;

// File: src/pages/Procedures.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { procedureAPI } from '../services/api';

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [formData, setFormData] = useState({
    Code: '',
    Name: '',
    Cost: ''
  });

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const response = await procedureAPI.getAllProcedures();
      setProcedures(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch procedures');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProcedure(null);
    setFormData({
      Code: '',
      Name: '',
      Cost: ''
    });
  };

  const handleShowModal = (procedure = null) => {
    if (procedure) {
      setSelectedProcedure(procedure);
      setFormData({
        Code: procedure.Code,
        Name: procedure.Name,
        Cost: procedure.Cost
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
      if (selectedProcedure) {
        // Update procedure name
        await procedureAPI.updateProcedureName(formData.Code, { name: formData.Name });
        // Update procedure cost
        await procedureAPI.updateProcedureCost(formData.Code, { cost: formData.Cost });
      } else {
        // Add new procedure
        await procedureAPI.addProcedure(formData);
      }
      fetchProcedures();
      handleCloseModal();
    } catch (err) {
      setError(selectedProcedure ? 'Failed to update procedure' : 'Failed to add procedure');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading procedures...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Procedure Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Procedure
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {procedures.length > 0 ? (
                procedures.map((procedure) => (
                  <tr key={procedure.Code}>
                    <td>{procedure.Code}</td>
                    <td>{procedure.Name}</td>
                    <td>${parseFloat(procedure.Cost).toFixed(2)}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleShowModal(procedure)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No procedures found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProcedure ? 'Edit Procedure' : 'Add New Procedure'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Procedure Code</Form.Label>
                  <Form.Control
                    type="number"
                    name="Code"
                    value={formData.Code}
                    onChange={handleInputChange}
                    readOnly={!!selectedProcedure}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    