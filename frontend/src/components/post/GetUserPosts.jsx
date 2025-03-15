/* eslint-disable jsx-a11y/img-redundant-alt */
// In GetUserPosts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Button, Row, Col, Carousel, Spinner } from 'react-bootstrap';
import { useUser } from '../user/UserContext';
import './GetUserPosts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function GetUserPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user || !user.id) {
                console.error('User ID is undefined!');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/user/${user.id}`);
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [user]);

    const handleUpdatePost = async (postId) => {
        navigate(`/edit-post/${postId}`); // Pass post ID to the edit post page
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/${postId}`);
            setPosts(posts.filter(post => post._id !== postId)); // Adjust the filter condition
            alert("Deleted successfully")
            window.location.reload()
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <Container style={{ width: "1050px" }}>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Row xs={1} md={2} lg={2}>
                    {posts.map(post => (
                        <Col key={post._id}>
                            <Card className="card">
                                <Card.Body className="card-body">
                                    <Card.Title className="card-title">{post.title}</Card.Title>
                                    <Carousel interval={5000} pause={false} className="carousel">
                                        {post.mediaUrls.map((imageUrl, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={imageUrl}
                                                    alt={`Image ${index}`}
                                                    className="img-fluid"
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                    <Card.Text className="card-description">{post.description}</Card.Text>
                                    <div>
                                        <Card.Text style={{ textAlign: "right", fontSize: "20px", color: "white" }}>PostedBy: {post.userName}</Card.Text>
                                        </div>
                                    <div className="mt-2">
                                        <Button variant="primary" className="btn-primary" onClick={() => handleUpdatePost(post.id)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="danger" className="btn-danger ms-2" onClick={() => handleDeletePost(post.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default GetUserPosts;