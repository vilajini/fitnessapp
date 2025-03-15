import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SignUp() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/signup', userData);
            console.log(response.data);
            alert('Registration successful');
            // Redirect to login or another appropriate page
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center align-items-center">
            <Card style={{ width: '400px', color: "white" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Sign Up</Card.Title>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group controlId="formBasicName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100">
                            Sign Up
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        Already have an account? <Link to="/">Sign In</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignUp;