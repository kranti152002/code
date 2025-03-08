import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { departmentAPI, physicianAPI } from '../../api';

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    DepartmentID: '',
    Name: '',
    Head: ''
  });
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPhysicians();
    if (isEditing) {
      fetchDepartment();
    }
  }, [id]);

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getDepartmentById(id);
      setFormData({
        DepartmentID: response.data.DepartmentID,
        Name: response.data.Name,
        Head: response.data.Head
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch department details');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchPhysicians = async () => {
    try {
      const response = await physicianAPI.getAllPhysicians();
      setPhysicians(response.data);
    } catch (err) {
      setError('Failed to fetch physicians');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        // Update department name
        await departmentAPI.updateDepartmentName(formData.DepartmentID, { name: formData.Name });
        // Update department head
        await departmentAPI.updateDepartmentHead(formData.DepartmentID, { headId: formData.Head });
        setSuccess('Department updated successfully!');
      } else {
        // Add new department
        await departmentAPI.addDepartment(formData);
        setSuccess('Department added successfully!');
      }
      setTimeout(() => {
        navigate('/departments');
      }, 1500);
    } catch (err) {
      setError(isEditing ? 'Failed to update department' : 'Failed to add department');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  if (loading && isEditing) return <div className="text-center">Loading department...</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{isEditing ? 'Edit Department' : 'Add New Department'}</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Department ID</Form.Label>
            <Form.Control
              type="number"
              name="DepartmentID"
              value={formData.DepartmentID}
              onChange={handleInputChange}
              readOnly={isEditing}
              required
            />
            {!isEditing && (
              <Form.Text className="text-muted">
                Enter a unique department ID
              </Form.Text>
            )}
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
          
          <Row className="mt-4">
            <Col>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col className="text-end">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Department' : 'Add Department')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DepartmentForm;
