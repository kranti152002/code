import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { trainedInAPI, physicianAPI, procedureAPI } from '../services/api';

const TrainedIn = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [physicians, setPhysicians] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [formData, setFormData] = useState({
    Physician: '',
    Treatment: '',
    CertificationDate: '',
    CertificationExpires: ''
  });

  useEffect(() => {
    fetchPhysiciansAndProcedures();
  }, []);

  const fetchPhysiciansAndProcedures = async () => {
    try {
      setLoading(true);
      const [physiciansResponse, proceduresResponse] = await Promise.all([
        physicianAPI.getAllPhysicians(),
        procedureAPI.getAllProcedures()
      ]);
      setPhysicians(physiciansResponse.data);
      setProcedures(proceduresResponse.data);
      
      // Default to first physician
      if (physiciansResponse.data.length > 0) {
        const firstPhysicianId = physiciansResponse.data[0].EmployeeID;
        setSelectedPhysician(firstPhysicianId);
        fetchCertificationsByPhysician(firstPhysicianId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchCertificationsByPhysician = async (physicianId) => {
    try {
      setLoadingCertifications(true);
      const response = await trainedInAPI.getTreatmentsByPhysician(physicianId);
      
      // Format the data with procedure details
      const certificationData = response.data.map(cert => {
        const procedure = procedures.find(p => p.Code === cert.Treatment);
        return {
          ...cert,
          ProcedureName: procedure ? procedure.Name : 'Unknown Procedure',
          PhysicianName: physicians.find(p => p.EmployeeID === physicianId)?.Name || 'Unknown'
        };
      });
      
      setCertifications(certificationData);
      setLoadingCertifications(false);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch certifications');
      setLoadingCertifications(false);
      setLoading(false);
      console.error(err);
    }
  };

  const handlePhysicianChange = (e) => {
    const physicianId = e.target.value;
    setSelectedPhysician(physicianId);
    fetchCertificationsByPhysician(physicianId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      Physician: selectedPhysician,
      Treatment: '',
      CertificationDate: formatDateForInput(new Date()),
      CertificationExpires: formatDateForInput(new Date(new Date().setFullYear(new Date().getFullYear() + 2)))
    });
  };

  const handleShowModal = () => {
    setFormData({
      Physician: selectedPhysician,
      Treatment: '',
      CertificationDate: formatDateForInput(new Date()),
      CertificationExpires: formatDateForInput(new Date(new Date().setFullYear(new Date().getFullYear() + 2)))
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trainedInAPI.addCertification(formData);
      fetchCertificationsByPhysician(selectedPhysician);
      handleCloseModal();
    } catch (err) {
      setError('Failed to add certification');
      console.error(err);
    }
  };

  const handleUpdateExpiry = async (physicianId, procedureId, expiryDate) => {
    try {
      await trainedInAPI.updateCertificationExpiry(physicianId, procedureId, { date: expiryDate });
      fetchCertificationsByPhysician(selectedPhysician);
    } catch (err) {
      setError('Failed to update certification expiry');
      console.error(err);
    }
  };

  const isCertificationExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const isCertificationExpiringSoon = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    
    return expiry > now && expiry < threeMonthsFromNow;
  };

  const getCertificationStatus = (expiryDate) => {
    if (isCertificationExpired(expiryDate)) {
      return <Badge bg="danger">Expired</Badge>;
    } else if (isCertificationExpiringSoon(expiryDate)) {
      return <Badge bg="warning" text="dark">Expiring Soon</Badge>;
    } else {
      return <Badge bg="success">Valid</Badge>;
    }
  };

  if (loading) return <div className="text-center">Loading certification data...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">Physician Certifications</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>Add New Certification
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label><strong>Select Physician:</strong></Form.Label>
            <Form.Select 
              value={selectedPhysician} 
              onChange={handlePhysicianChange}
              disabled={loadingCertifications}
            >
              {physicians.map(physician => (
                <option key={physician.EmployeeID} value={physician.EmployeeID}>
                  {physician.Name} ({physician.Position})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h4>Procedure Certifications</h4>
          {loadingCertifications ? (
            <div className="text-center my-4">Loading certifications...</div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Procedure Code</th>
                  <th>Procedure Name</th>
                  <th>Certification Date</th>
                  <th>Expiration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.length > 0 ? (
                  certifications.map((cert) => (
                    <tr key={`${cert.Physician}-${cert.Treatment}`}>
                      <td>{cert.Treatment}</td>
                      <td>{cert.ProcedureName}</td>
                      <td>{formatDateForDisplay(cert.CertificationDate)}</td>
                      <td>{formatDateForDisplay(cert.CertificationExpires)}</td>
                      <td>{getCertificationStatus(cert.CertificationExpires)}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            // Open modal to extend certification
                            const extendedDate = new Date(cert.CertificationExpires);
                            extendedDate.setFullYear(extendedDate.getFullYear() + 2);
                            handleUpdateExpiry(
                              cert.Physician,
                              cert.Treatment,
                              formatDateForInput(extendedDate)
                            );
                          }}
                        >
                          Extend
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No certifications found for this physician
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
          <Modal.Title>Add New Certification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Physician</Form.Label>
              <Form.Select
                name="Physician"
                value={formData.Physician}
                onChange={handleInputChange}
                required
              >
                {physicians.map(physician => (
                  <option key={physician.EmployeeID} value={physician.EmployeeID}>
                    {physician.Name} ({physician.Position})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Procedure</Form.Label>
              <Form.Select
                name="Treatment"
                value={formData.Treatment}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Procedure</option>
                {procedures.map(procedure => (
                  <option key={procedure.Code} value={procedure.Code}>
                    {procedure.Name} (${procedure.Cost.toFixed(2)})
                  </option>
                ))}
              </Form.Select>
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

export default TrainedIn;
