import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useUser } from './UserContext';

function SignIn() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/signin', credentials);
            updateUser(response.data);
            localStorage.setItem('userId', response.data.id);
            navigate('/home');
        } catch (error) {
            console.error('Sign-in failed:', error);
            alert('Sign in failed');
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center align-items-center">
            <Card style={{ width: '400px', color: "white" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Sign In</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="w-100">
                            Sign In
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        Don't have an account? <a href="/signup">Sign up</a>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignIn;