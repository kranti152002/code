import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { nurseAPI } from '../services/api';

const Nurses = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [formData, setFormData] = useState({
    EmployeeID: '',
    Name: '',
    Position: '',
    Registered: false,
    SSN: ''
  });

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      const response = await nurseAPI.getAllNurses();
      setNurses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch nurses');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNurse(null);
    setFormData({
      EmployeeID: '',
      Name: '',
      Position: '',
      Registered: false,
      SSN: ''
    });
  };

  const handleShowModal = (nurse = null) => {
    if (nurse) {
      setSelectedNurse(nurse);
      setFormData({
        EmployeeID: nurse.EmployeeID,
        Name: nurse.Name,
        Position: nurse.Position,
        Registered: nurse.Registered === 1,
        SSN: nurse.SSN
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedNurse) {
        // Update nurse registration status
        await nurseAPI.updateRegistrationStatus(formData.EmployeeID, { status: formData.Registered ? 1 : 0 });
        // Update nurse SSN
        await nurseAPI.updateSSN(formData.EmployeeID, { ssn: formData.SSN });
      } else {
        // Add new nurse
        await nurseAPI.addNurse({
          ...formData,
          Registered: formData.Registered ? 1 : 0
        });
      }
      fetchNurses();
      handleCloseModal();
    } catch (err) {
      setError(selectedNurse ? 'Failed to update nurse' : 'Failed to add nurse');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading nurses...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Nurse Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Nurse
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
                <th>Registered</th>
                <th>SSN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nurses.length > 0 ? (
                nurses.map((nurse) => (
                  <tr key={nurse.EmployeeID}>
                    <td>{nurse.EmployeeID}</td>
                    <td>{nurse.Name}</td>
                    <td>{nurse.Position}</td>
                    <td>
                      {nurse.Registered === 1 ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>{nurse.SSN}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => handleShowModal(nurse)} className="me-2">
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <i className="fas fa-info-circle"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No nurses found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNurse ? 'Edit Nurse' : 'Add New Nurse'}</Modal.Title>
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
                    readOnly={!!selectedNurse}
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
                    readOnly={!!selectedNurse}
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
                    type="text"
                    name="Position"
                    value={formData.Position}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SSN</Form.Label>
                  <Form.Control
                    type="text"
                    name="SSN"
                    value={formData.SSN}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Registered Nurse"
                name="Registered"
                checked={formData.Registered}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedNurse ? 'Update Nurse' : 'Add Nurse'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Nurses;
