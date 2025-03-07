import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { patientAPI, physicianAPI, departmentAPI, appointmentAPI } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    patients: 0,
    physicians: 0,
    nurses: 0,
    departments: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch actual data counts
      const patientResponse = await patientAPI.getAllPatients();
      const physicianResponse = await physicianAPI.getAllPhysicians();
      const departmentResponse = await departmentAPI.getAllDepartments();
      const appointmentResponse = await appointmentAPI.getAllAppointments();

      setStats({
        patients: patientResponse.data.length,
        physicians: physicianResponse.data.length,
        nurses: 100, // Placeholder, replace with actual API call
        departments: departmentResponse.data.length,
        appointments: appointmentResponse.data.length
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch statistics');
      setLoading(false);
      console.error(err);
    }
  };

  const services = [
    {
      title: 'Patient Management',
      description: 'Register new patients, update existing records, and manage patient information efficiently.',
      icon: 'fas fa-user-injured',
      link: '/patients',
      color: 'primary'
    },
    {
      title: 'Physician Directory',
      description: 'Browse our qualified physicians, their specialties, and departmental affiliations.',
      icon: 'fas fa-user-md',
      link: '/physicians',
      color: 'success'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Schedule, reschedule or cancel appointments with our physicians and nurses.',
      icon: 'far fa-calendar-alt',
      link: '/appointments',
      color: 'danger'
    },
    {
      title: 'Department Information',
      description: 'View all departments, their heads, and associated physicians.',
      icon: 'fas fa-hospital',
      link: '/departments',
      color: 'warning'
    },
    {
      title: 'Procedure Catalog',
      description: 'Browse all available procedures, their costs, and qualified physicians.',
      icon: 'fas fa-procedures',
      link: '/procedures',
      color: 'info'
    },
    {
      title: 'Nursing Staff',
      description: 'View all nurses, their positions, and qualifications.',
      icon: 'fas fa-user-nurse',
      link: '/nurses',
      color: 'secondary'
    }
  ];

  const features = [
    {
      image: '/api/placeholder/800/400',
      title: 'Comprehensive Patient Records',
      description: 'Track complete patient history, appointments, and procedures in one place.'
    },
    {
      image: '/api/placeholder/800/400',
      title: 'Physician Specialization Management',
      description: 'Monitor physician certifications and specialized procedure qualifications.'
    },
    {
      image: '/api/placeholder/800/400',
      title: 'Department Analytics & Reporting',
      description: 'Generate reports on department performance, physician distribution, and procedure volumes.'
    }
  ];

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="px-4">
      {/* Hero Section */}
      <div className="jumbotron bg-light p-5 rounded mb-5">
        <Row>
          <Col md={7}>
            <h1 className="display-4 fw-bold">Hospital Management System</h1>
            <p className="lead fs-4">
              A comprehensive solution for managing hospital operations, patient records, and staff information.
            </p>
            <hr className="my-4" />
            <p className="mb-4">
              Our system provides powerful tools for patients, physicians, and administrators to streamline healthcare delivery.
            </p>
            <div className="d-flex gap-3">
              <Link to="/patients" className="btn btn-primary btn-lg">
                <i className="fas fa-user-injured me-2"></i> Patient Management
              </Link>
              <Link to="/appointments" className="btn btn-outline-secondary btn-lg">
                <i className="far fa-calendar-alt me-2"></i> Schedule Appointment
              </Link>
            </div>
          </Col>
          <Col md={5} className="d-flex align-items-center justify-content-center">
            <div className="p-3 bg-white rounded-circle shadow-lg">
              <i className="fas fa-hospital text-primary" style={{ fontSize: '8rem' }}></i>
            </div>
          </Col>
        </Row>
      </div>

      {/* Features Carousel */}
      <div className="mb-5">
        <h2 className="text-center mb-4 page-title">Key Features</h2>
        <Carousel>
          {features.map((feature, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ height: '350px' }}>
                <Row className="w-100 p-5">
                  <Col md={6} className="d-flex justify-content-center align-items-center">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '250px' }}
                    />
                  </Col>
                  <Col md={6} className="d-flex flex-column justify-content-center">
                    <h3>{feature.title}</h3>
                    <p className="fs-5">{feature.description}</p>
                  </Col>
                </Row>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Services Section */}
      <h2 className="text-center mb-4 page-title">Our Services</h2>
      <Row className="mb-5">
        {services.map((service, index) => (
          <Col lg={4} md={6} key={index} className="mb-4">
            <Card className="service-card h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className={`rounded-circle bg-${service.color} bg-opacity-10 p-3 mb-3 mx-auto`} style={{ width: '80px', height: '80px' }}>
                  <i className={`${service.icon} text-${service.color}`} style={{ fontSize: '2.5rem' }}></i>
                </div>
                <Card.Title className="fs-4 mb-3">{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 text-center pb-4">
                <Link to={service.link} className={`btn btn-${service.color}`}>
                  Explore <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Statistics Section */}
      <div className="bg-light rounded p-5 mb-5">
        <h2 className="text-center mb-4">Hospital Statistics</h2>
        {loading ? (
          <div className="text-center">Loading statistics...</div>
        ) : (
          <Row className="text-center">
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 bg-white shadow-sm py-4">
                <Card.Body>
                  <div className="display-4 text-primary mb-2">{stats.patients}+</div>
                  <h4 className="text-muted">Patients</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 bg-white shadow-sm py-4">
                <Card.Body>
                  <div className="display-4 text-success mb-2">{stats.physicians}+</div>
                  <h4 className="text-muted">Physicians</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 bg-white shadow-sm py-4">
                <Card.Body>
                  <div className="display-4 text-danger mb-2">{stats.nurses}+</div>
                  <h4 className="text-muted">Nurses</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="border-0 bg-white shadow-sm py-4">
                <Card.Body>
                  <div className="display-4 text-warning mb-2">{stats.departments}+</div>
                  <h4 className="text-muted">Departments</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-white rounded text-center p-5 mb-5">
        <h2 className="mb-3">Ready to Get Started?</h2>
        <p className="lead mb-4">Experience our comprehensive Hospital Management System today</p>
        <Button variant="light" size="lg" as={Link} to="/patients">
          Explore Patient Management <i className="fas fa-arrow-right ms-2"></i>
        </Button>
      </div>
    </Container>
  );
};

export default Home;
