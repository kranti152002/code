import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { departmentAPI, physicianAPI } from '../../api';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getPhysicianName = (id) => {
    const physician = physicians.find(p => p.EmployeeID === id);
    return physician ? physician.Name : 'Unknown';
  };

  if (loading) return <div className="text-center">Loading departments...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Departments</h3>
          <Link to="/departments/new">
            <Button variant="primary">
              <i className="fas fa-plus me-2"></i>Add New Department
            </Button>
          </Link>
        </div>
        
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
                    <Link to={`/departments/${department.DepartmentID}`} className="me-2">
                      <Button variant="outline-info" size="sm">
                        <i className="fas fa-eye"></i>
                      </Button>
                    </Link>
                    <Link to={`/departments/${department.DepartmentID}/edit`}>
                      <Button variant="outline-primary" size="sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
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
  );
};

export default DepartmentList;
