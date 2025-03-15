/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPost.css'; // Import the CSS file for custom styles

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingMediaUrls, setExistingMediaUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
      const { description, mediaUrls } = response.data;
      setTitle(description); // Fixed: Use description to set title
      setDescription(description);
      setExistingMediaUrls(mediaUrls);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate title and description
    if (title.length < 5 || title.length > 50) {
      setErrorMessage('Title must be between 5 and 50 characters.');
      return;
    }
    if (description.length < 10 || description.length > 200) {
      setErrorMessage('Description must be between 10 and 200 characters.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Post updated:', response.data);
      setTitle('');
      setDescription('');
      setFiles([]);
      setErrorMessage('');
      navigate(`/user-posts/${response.data.userId}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setErrorMessage('Failed to update post. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="update-post-card">
        <Card.Body>
          <Card.Title className="update-post-title">Update Post</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title:</Form.Label>
              <Form.Control type="text" value={title} onChange={handleTitleChange} />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea" value={description} onChange={handleDescriptionChange} />
            </Form.Group>
            <Form.Group controlId="files">
              <Form.Label>New Media Files:</Form.Label>
              <Form.Control type="file" accept="image/*, video/*" multiple onChange={handleFileChange} />
            </Form.Group>
            <Button className="update-post-button" type="submit">
              Update Post
            </Button>
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
          </Form>
          {existingMediaUrls.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Existing Media Files:</h3>
              <Card.Group>
                {existingMediaUrls.map((url, index) => (
                  <Card key={index}>
                    <Card.Img variant="top" src={url} />
                    <Card.Body>
                      <Card.Text>{url}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Group>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditPost;