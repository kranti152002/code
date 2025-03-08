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
        Registered: nurse.Registered,
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
        // Update registration status
        await nurseAPI.updateRegistrationStatus(formData.EmployeeID, { registered: formData.Registered });
        // Update SSN
        await nurseAPI.updateSSN(formData.EmployeeID, { ssn: formData.SSN });
      } else {
        // Add new nurse
        await nurseAPI.addNurse(formData);
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
                