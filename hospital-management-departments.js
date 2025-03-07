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
    fetchDepartments();
    fetchPhysicians();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAllDepartments();
      setDepartments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch departments');
      setLoading(false);
      console.error(err);
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
      fetchDepartments();
      handleCloseModal();
    } catch (err) {
      setError(selectedDepartment ? 'Failed to update department' : 'Failed to add department');
      console.error(err);
    }
  };

  const getPhysicianName = (id) => {
    const physician = physicians.find(p => p.EmployeeID === id);
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
                <th>Department Head</th>
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
            <Form.Group className="mb-3">
              <Form.Label>Department Head</Form.Label>
              <Form.Select
                name="Head"
                value={formData.Head}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department Head</option>
                {physicians.map((physician) => (
                  <option key={physician.EmployeeID} value={physician.EmployeeID}>
                    {physician.Name} - {physician.Position}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
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
