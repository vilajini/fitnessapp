import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { Container, Card, Form, FormControl, Button } from 'react-bootstrap';
import './AddPost.css'; // Import the CSS file for custom styles

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            alert('Please log in to create a post.');
            return;
        }

        // Validate description length
        if (description.length < 10 || description.length > 200) {
            alert('Description must be between 10 and 200 characters.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        for (const file of files) {
            formData.append('files', file);
        }
        formData.append('userId', user.id);

        try {
            await axios.post('http://localhost:8080/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Post created successfully!');
            navigate('/home');
        } catch (error) {
            console.error('Error uploading post:', error);
            alert('Failed to create post.');
        }
    };

    return (
        <Container className="container">
            <Card className="add-post-card">
                <Card.Body>
                    <Card.Title className="add-post-title">Create a New Post</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title:</Form.Label>
                            <FormControl
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description:</Form.Label>
                            <FormControl
                                as="textarea"
                                value={description}
                                onChange={handleDescriptionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="files">
                            <Form.Label>Upload Files:</Form.Label>``
                            <FormControl
                                type="file"
                                accept="image/*, video/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Button className="add-post-button" type="submit">
                            Submit Post
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddPost;