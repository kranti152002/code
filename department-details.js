import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Alert, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { departmentAPI, physicianAPI } from '../../api';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(null);
  const [departmentHead, setDepartmentHead] = useState(null);
  const [departmentPhysicians, setDepartmentPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchDepartmentData();
  }, [id]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      // Get department details
      const deptResponse = await departmentAPI.getDepartmentById(id);
      setDepartment(deptResponse.data);

      // Get department head details
      if (deptResponse.data.Head) {
        const headResponse = await physicianAPI.getPhysicianById(deptResponse.data.Head);
        setDepartmentHead(headResponse.data);
      }

      // Get physicians in this department
      const physiciansResponse = await departmentAPI.getDepartmentPhysicians(id);
      setDepartmentPhysicians(physiciansResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch department information');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await departmentAPI.deleteDepartment(id);
      navigate('/departments');
    } catch (err) {
      setError('Failed to delete department');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Loading department details...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!department) return <Alert variant="warning">Department not found</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{department.Name} Department</h2>
        <div>
          <Link to={`/departments/${id}/edit`} className="me-2">
            <Button variant="outline-primary">
              <i className="fas fa-edit me-1"></i> Edit
            </Button>
          </Link>
          <Button 
            variant={deleteConfirm ? "danger" : "outline-danger"} 
            onClick={handleDelete}
          >
            {deleteConfirm 
              ? <><i className="fas fa-exclamation-triangle me-1"></i> Confirm Delete</>
              : <><i className="fas fa-trash me-1"></i> Delete</>
            }
          </Button>
        </div>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Department Information</Card.Title>
              <Row className="mb-2">
                <Col xs={4} className="fw-bold">Department ID:</Col>
                <Col xs={8}>{department.DepartmentID}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="fw-bold">Name:</Col>
                <Col xs={8}>{department.Name}</Col>
              </Row>
              <Row>
                <Col xs={4} className="fw-bold">Department Head:</Col>
                <Col xs={8}>
                  {departmentHead ? (
                    <Link to={`/physicians/${departmentHead.EmployeeID}`}>
                      {departmentHead.Name} ({departmentHead.Position})
                    </Link>
                  ) : (
                    <span className="text-muted">Not assigned</span>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Department Statistics</Card.Title>
              <Row className="text-center">
                <Col>
                  <div className="fs-1 fw-bold text-primary">{departmentPhysicians.length}</div>
                  <div className="text-muted">Physicians</div>
                </Col>
                <Col>
                  <div className="fs-1 fw-bold text-success">
                    {/* This would be populated with actual data */}
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-muted">Staff</div>
                </Col>
                <Col>
                  <div className="fs-1 fw-bold text-info">
                    {/* This would be populated with actual data */}
                    {Math.floor(Math.random() * 20) + 5}
                  </div>
                  <div className="text-muted">Rooms</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Card.Title>Department Physicians</Card.Title>
          {departmentPhysicians.length > 0 ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Specialization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentPhysicians.map((physician) => (
                  <tr key={physician.EmployeeID}>
                    <td>{physician.EmployeeID}</td>
                    <td>
                      <Link to={`/physicians/${physician.EmployeeID}`}>
                        {physician.Name}
                      </Link>
                    </td>
                    <td>{physician.Position}</td>
                    <td>{physician.Specialization}</td>
                    <td>
                      <Badge bg={physician.Status === 'Active' ? 'success' : 'secondary'}>
                        {physician.Status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center text-muted my-4">
              No physicians assigned to this department
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DepartmentDetails;
