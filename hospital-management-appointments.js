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
    Starto: '',
    Endo: '',
    ExaminationRoom: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchPhysicians();
    fetchNurses();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAllAppointments();
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAllPatients();
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  const fetchPhysicians = async () => {
    try {
      const response = await physicianAPI.getAllPhysicians();
      setPhysicians(response.data);
    } catch (err) {
      console.error('Failed to fetch physicians', err);
    }
  };

  const fetchNurses = async () => {
    try {
      const response = await nurseAPI.getAllNurses();
      setNurses(response.data);
    } catch (err) {
      console.error('Failed to fetch nurses', err);
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
      Starto: '',
      Endo: '',
      ExaminationRoom: ''
    });
  };

  const handleShowModal = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        AppointmentID: appointment.AppointmentID,
        Patient: appointment.Patient,
        PrepNurse: appointment.PrepNurse || '',
        Physician: appointment.Physician,
        Starto: formatDateForInput(appointment.Starto),
        Endo: formatDateForInput(appointment.Endo),
        ExaminationRoom: appointment.ExaminationRoom
      });
    }
    setShowModal(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAppointment) {
        // Update appointment room
        await appointmentAPI.updateRoom(formData.AppointmentID, { room: formData.ExaminationRoom });
      } else {
        // Add new appointment
        await appointmentAPI.addAppointment(formData);
      }
      fetchAppointments();
      handleCloseModal();
    } catch (err) {
      setError(selectedAppointment ? 'Failed to update appointment' : 'Failed to add appointment');
      console.error(err);
    }
  };

  const getPatientName = (id) => {
    const patient = patients.find(p => p.SSN === id);
    return patient ? patient.Name : 'Unknown';
  };

  const getPhysicianName = (id) => {
    const physician = physicians.find(p => p.EmployeeID === id);
    return physician ? physician.Name : 'Unknown';
  };

  const getNurseName = (id) => {
    if (!id) return 'None';
    const nurse = nurses.find(n => n.EmployeeID === id);
    return nurse ? nurse.Name : 'Unknown';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
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
            <i className="fas fa-plus me-2"></i>Add New Appointment
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
                    <td>{formatDateTime(appointment.Starto)}</td>
                    <td>{formatDateTime(appointment.Endo)}</td>
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
          <Modal.Title>{selectedAppointment ? 'Edit Appointment' : 'Add New Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Appointment ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="AppointmentID"
                    value={formData.AppointmentID}
                    onChange={handleInputChange}
                    readOnly={!!selectedAppointment}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient</Form.Label>
                  <Form.Select
                    name="Patient"
                    value={formData.Patient}
                    onChange={handleInputChange}
                    disabled={!!selectedAppointment}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.SSN} value={patient.SSN}>
                        {patient.Name} - SSN: {patient.SSN}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Physician</Form.Label>
                  <Form.Select
                    name="Physician"
                    value={formData.Physician}
                    onChange={handleInputChange}
                    disabled={!!selectedAppointment}
                    required
                  >
                    <option value="">Select Physician</option>
                    {physicians.map((physician) => (
                      <option key={physician.EmployeeID} value={physician.EmployeeID}>
                        {physician.Name} - {physician.Position}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prep Nurse (Optional)</Form.Label>
                  <Form.Select
                    name="PrepNurse"
                    value={formData.PrepNurse}
                    onChange={handleInputChange}
                  >
                    <option value="">No Nurse</option>
                    {nurses.map((nurse) => (
                      <option key={nurse.EmployeeID} value={nurse.EmployeeID}>
                        {nurse.Name} - {nurse.Position}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="Starto"
                    value={formData.Starto}
                    onChange={handleInputChange}
                    disabled={!!selectedAppointment}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="Endo"
                    value={formData.Endo}
                    onChange={handleInputChange}
                    disabled={!!selectedAppointment}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
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
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedAppointment ? 'Update Appointment' : 'Add Appointment'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Appointments;
