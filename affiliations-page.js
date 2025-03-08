import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { affiliatedWithAPI, physicianAPI, departmentAPI } from '../services/api';

const Affiliations = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [physiciansByDepartment, setPhysiciansByDepartment] = useState({});
  const [formData, setFormData] = useState({
    Physician: '',
    Department: '',
    PrimaryAffiliation: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [physiciansRes, departmentsRes] = await Promise.all([
        physicianAPI.getAllPhysicians(),
        departmentAPI.getAllDepartments()
      ]);
      
      setPhysicians(physiciansRes.data);
      setDepartments(departmentsRes.data);
      
      // Fetch affiliations for each department
      const affiliationsData = {};
      await Promise.all(
        departmentsRes.data.map(async (dept) => {
          const response = await affiliatedWithAPI.getPhysiciansByDepartment(dept.DepartmentID);
          affiliationsData[dept.DepartmentID] = response.data;
        })
      );
      
      setPhysiciansByDepartment(affiliationsData);
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
      Physician: '',
      Department: '',
      PrimaryAffiliation: false
    });
  };

  const handleShowModal = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        ...formData,
        Department: department.DepartmentID
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
      // Add new affiliation
      await affiliatedWithAPI.addAffiliation({
        physician: formData.Physician,
        department: formData.Department,
        primaryAffiliation: formData.PrimaryAffiliation
      });
      
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError('Failed to add affiliation');
      console.error(err);
    }
  };

  const getPhysicianName = (id) => {
    const physician = physicians.find(p => p.EmployeeID === id);
    return physician ? physician.Name : 'Unknown';
  };

  const getDepartmentName = (id) => {
    const department = departments.find(d => d.DepartmentID === id);
    return department ? department.Name : 'Unknown';
  };

  if (loading) return <div className="text-center">Loading affiliations...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Physician-Department Affiliations</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Affiliation
          </Button>
        </Col>
      </Row>

      {departments.map(department => (
        <Card key={department.DepartmentID} className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{department.Name} Department</h5>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => handleShowModal(department)}
            >
              <i className="fas fa-plus me-1"></i> Add Physician
            </Button>
          </Card.Header>
          <Card.Body>
            {physiciansByDepartment[department.DepartmentID]?.length > 0 ? (
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Physician ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Affiliation</th>
                  </tr>
                </thead>
                <tbody>
                  {physiciansByDepartment[department.DepartmentID]?.map((affiliation) => {
                    const physician = physicians.find(p => p.EmployeeID === affiliation.Physician);
                    return physician ? (
                      <tr key={`${department.DepartmentID}-${affiliation.Physician}`}>
                        <td>{physician.EmployeeID}</td>
                        <td>{physician.Name}</td>
                        <td>{physician.Position}</td>
                        <td>
                          {affiliation.PrimaryAffiliation ? (
                            <Badge bg="primary">Primary</Badge>
                          ) : (
                            <Badge bg="secondary">Secondary</Badge>
                          )}
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </Table>
            ) : (
              <p className="text-center">No affiliated physicians found</p>
            )}
          </Card.Body>
        </Card>
      ))}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Physician Affiliation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                name="Department"
                value={formData.Department}
                onChange={handleInputChange}
                disabled={!!selectedDepartment}
                required
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department.DepartmentID} value={department.DepartmentID}>
                    {department.Name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
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
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="PrimaryAffiliation"
                label="Primary Affiliation"
                checked={formData.PrimaryAffiliation}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Affiliation
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Affiliations;
