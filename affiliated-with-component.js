import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { affiliatedWithAPI, physicianAPI, departmentAPI } from '../services/api';

const AffiliatedWith = () => {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [loadingDeptPhysicians, setLoadingDeptPhysicians] = useState(false);
  const [formData, setFormData] = useState({
    Physician: '',
    Department: '',
    PrimaryAffiliation: false
  });

  useEffect(() => {
    fetchDepartmentsAndPhysicians();
  }, []);

  const fetchDepartmentsAndPhysicians = async () => {
    try {
      setLoading(true);
      const [deptsResponse, physiciansResponse] = await Promise.all([
        departmentAPI.getAllDepartments(),
        physicianAPI.getAllPhysicians()
      ]);
      setDepartments(deptsResponse.data);
      setPhysicians(physiciansResponse.data);
      
      // Default to first department
      if (deptsResponse.data.length > 0) {
        const firstDeptId = deptsResponse.data[0].DepartmentID;
        setSelectedDeptId(firstDeptId);
        fetchPhysiciansByDepartment(firstDeptId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchPhysiciansByDepartment = async (deptId) => {
    try {
      setLoadingDeptPhysicians(true);
      const response = await affiliatedWithAPI.getPhysiciansByDepartment(deptId);
      
      // Map the physician IDs to full physician objects
      const affiliationData = response.data.map(physicianId => {
        const physician = physicians.find(p => p.EmployeeID === physicianId);
        
        return {
          Physician: physicianId,
          PhysicianName: physician ? physician.Name : 'Unknown',
          Department: deptId,
          DepartmentName: departments.find(d => d.DepartmentID === deptId)?.Name || 'Unknown',
          PrimaryAffiliation: false // We'll update this with a separate call if needed
        };
      });
      
      setAffiliations(affiliationData);
      setLoadingDeptPhysicians(false);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch physicians for department');
      setLoadingDeptPhysicians(false);
      setLoading(false);
      console.error(err);
    }
  };

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    fetchPhysiciansByDepartment(deptId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      Physician: '',
      Department: selectedDeptId,
      PrimaryAffiliation: false
    });
  };

  const handleShowModal = () => {
    setFormData({
      Physician: '',
      Department: selectedDeptId,
      PrimaryAffiliation: false
    });
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
      await affiliatedWithAPI.addAffiliation({
        ...formData,
        PrimaryAffiliation: formData.PrimaryAffiliation ? 1 : 0
      });
      
      // Refresh the list
      fetchPhysiciansByDepartment(selectedDeptId);
      handleCloseModal();
    } catch (err) {
      setError('Failed to add affiliation');
      console.error(err);
    }
  };

  const handleUpdatePrimary = async (physicianId) => {
    try {
      await affiliatedWithAPI.updatePrimaryAffiliation(physicianId);
      
      // Refresh the list
      fetchPhysiciansByDepartment(selectedDeptId);
    } catch (err) {
      setError('Failed to update primary affiliation');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading affiliations data...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Physician Department Affiliations</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>Add New Affiliation
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label><strong>Select Department:</strong></Form.Label>
            <Form.Select 
              value={selectedDeptId} 
              onChange={handleDepartmentChange}
              disabled={loadingDeptPhysicians}
            >
              {departments.map(dept => (
                <option key={dept.DepartmentID} value={dept.DepartmentID}>
                  {dept.Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h4>Affiliated Physicians</h4>
          {loadingDeptPhysicians ? (
            <div className="text-center my-4">Loading physicians...</div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Physician ID</th>
                  <th>Physician Name</th>
                  <th>Department</th>
                  <th>Primary Affiliation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliations.length > 0 ? (
                  affiliations.map((affiliation, index) => (
                    <tr key={`${affiliation.Physician}-${affiliation.Department}`}>
                      <td>{affiliation.Physician}</td>
                      <td>{affiliation.PhysicianName}</td>
                      <td>{affiliation.DepartmentName}</td>
                      <td>
                        {affiliation.PrimaryAffiliation ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-secondary">No</span>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleUpdatePrimary(affiliation.Physician)}
                          disabled={affiliation.PrimaryAffiliation}
                        >
                          Set as Primary
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No physicians affiliated with this department
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Affiliation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="Department"
                value={formData.Department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Physician</Form.Label>
              <Form.Select
                name="Physician"
                value={formData.Physician}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Physician</option>
                {physicians.map(physician => (
                  <option key={physician.EmployeeID} value={physician.EmployeeID}>
                    {physician.Name} ({physician.Position})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Primary Affiliation"
                name="PrimaryAffiliation"
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

export default AffiliatedWith;
