import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { trainedInAPI, physicianAPI, procedureAPI } from '../services/api';

const Certifications = () => {
  const [physicians, setPhysicians] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [certificationsByPhysician, setCertificationsByPhysician] = useState({});
  const [formData, setFormData] = useState({
    Physician: '',
    Treatment: '',
    CertificationDate: '',
    CertificationExpires: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [physiciansRes, proceduresRes] = await Promise.all([
        physicianAPI.getAllPhysicians(),
        procedureAPI.getAllProcedures()
      ]);
      
      setPhysicians(physiciansRes.data);
      setProcedures(proceduresRes.data);
      
      // Fetch certifications for each physician
      const certificationsData = {};
      await Promise.all(
        physiciansRes.data.map(async (physician) => {
          try {
            const response = await trainedInAPI.getTreatmentsByPhysician(physician.EmployeeID);
            certificationsData[physician.EmployeeID] = response.data;
          } catch (err) {
            console.error(`Failed to fetch certifications for physician ${physician.EmployeeID}`, err);
            certificationsData[physician.EmployeeID] = [];
          }
        })
      );
      
      setCertificationsByPhysician(certificationsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhysician(null);
    setFormData({
      Physician: '',
      Treatment: '',
      CertificationDate: formatDateForInput(new Date()),
      CertificationExpires: formatDateForInput(new Date(new Date().setFullYear(new Date().getFullYear() + 2)))
    });
  };

  const handleShowModal = (physician = null) => {
    if (physician) {
      setSelectedPhysician(physician);
      setFormData({
        ...formData,
        Physician: physician.EmployeeID,
        CertificationDate: formatDateForInput(new Date()),
        CertificationExpires: formatDateForInput(new Date(new Date().setFullYear(new Date().getFullYear() + 2)))
      });
    }
    setShowModal(true);
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add new certification
      await trainedInAPI.addCertification({
        physician: formData.Physician,
        treatment: formData.Treatment,
        certificationDate: formData.CertificationDate,
        certificationExpires: formData.CertificationExpires
      });
      
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError('Failed to add certification');
      console.error(err);
    }
  };

  const handleUpdateExpiry = async (physicianId, procedureId, newDate) => {
    try {
      await trainedInAPI.updateCertificationExpiry(physicianId, procedureId, { expiryDate: newDate });
      fetchData();
    } catch (err) {
      setError('Failed to update certification expiry');
      console.error(err);
    }
  };

  const getProcedureName = (code) => {
    const procedure = procedures.find(p => p.Code === code);
    return procedure ? procedure.Name : 'Unknown';
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const monthsDiff = (expiry.getFullYear() - today.getFullYear()) * 12 + 
                        (expiry.getMonth() - today.getMonth());
    return monthsDiff <= 3 && expiry > today;
  };

  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  if (loading) return <div className="text-center">Loading certifications...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Physician Certifications</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()}>
            <i className="fas fa-plus me-2"></i>Add New Certification
          </Button>
        </Col>
      </Row>

      {physicians.map(physician => (
        <Card key={physician.EmployeeID} className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{physician.Name} - {physician.Position}</h5>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => handleShowModal(physician)}
            >
              <i className="fas fa-plus me-1"></i> Add Certification
            </Button>
          </Card.Header>
          <Card.Body>
            {certificationsByPhysician[physician.EmployeeID]?.length > 0 ? (
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Procedure</th>
                    <th>Certification Date</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificationsByPhysician[physician.EmployeeID]?.map((cert) => (
                    <tr key={`${physician.EmployeeID}-${cert.Treatment}`}>
                      <td>{getProcedureName(cert.Treatment)}</td>
                      <td>{formatDate(cert.CertificationDate)}</td>
                      <td>{formatDate(cert.CertificationExpires)}</td>
                      <td>
                        {isExpired(cert.CertificationExpires) ? (
                          <Badge bg="danger">Expired</Badge>
                        ) : isExpiringSoon(cert.CertificationExpires) ? (
                          <Badge bg="warning">Expiring Soon</Badge>
                        ) : (
                          <Badge bg="success">Valid</Badge>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => {
                            const newDate = prompt("Enter new expiry date (YYYY-MM-DD):", 
                              formatDateForInput(new Date(new Date().setFullYear(new Date().getFullYear() + 2))));
                            if (newDate) {
                              handleUpdateExpiry(physician.EmployeeID, cert.Treatment, newDate);
                            }
                          }}
                        >
                          <i className="fas fa-clock"></i> Extend
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center">No certifications found</p>
            )}
          </Card.Body>
        </Card>
      ))}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Certification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Physician</Form.Label>
              <Form.Control
                as="select"
                name="Physician"
                value={formData.Physician}
                onChange={handleInputChange}
                disabled={!!selectedPhysician}
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
              <Form.Label>Procedure</Form.Label>
              <Form.Control
                as="select"
                name="Treatment"
                value={formData.Treatment}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Procedure</option>
                {procedures.map(procedure => (
                  <option key={procedure.Code} value={procedure.Code}>
                    {procedure.Name} - ${parseFloat(procedure.Cost).toFixed(2)}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Certification Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="CertificationDate"
                    value={formData.CertificationDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="CertificationExpires"
                    value={formData.CertificationExpires}
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
                Add Certification
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Certifications;
