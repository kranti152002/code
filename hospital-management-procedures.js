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
                <th>Procedure Code</th>
                <th>Name</th>
                <th>Cost ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {procedures.length > 0 ? (
                procedures.map((procedure) => (
                  <tr key={procedure.Code}>
                    <td>{procedure.Code}</td>
                    <td>{procedure.Name}</td>
                    <td>${procedure.Cost.toFixed(2)}</td>
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
              <Form.Label>Cost ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="Cost"
                value={formData.Cost}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedProcedure ? 'Update Procedure' : 'Add Procedure'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Procedures;
