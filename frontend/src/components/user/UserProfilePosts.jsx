/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Carousel } from 'react-bootstrap';
import LikeButton from '../LikeButton';
import CommentsDropdown from '../CommentsDropdown';
import './UserProfilePosts.css';

function UserProfilePosts({ posts, addPostLike, addPostComment, handlePostCommentChange, newComment }) {
    return (
        <Container className="user-profile-posts-container">
            <Row xs={1} md={2} lg={2} className="g-4">
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map(post => (
                        <Col key={post.id}>
                            <Card className="user-profile-post-card">
                                <Card.Body className="user-profile-post-body">
                                    <Card.Title className="user-profile-post-title">{post.title}</Card.Title>
                                    <Carousel interval={5000} className="user-profile-post-carousel">
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
                                    <Card.Text className="user-profile-post-description">{post.description}</Card.Text>
                                    <LikeButton onClick={() => addPostLike(post.id)} likes={post.likes} className="user-profile-like-button" />
                                    <div>
                                        <Card.Text style={{ textAlign: "right", fontSize: "20px", color: "white" }}>PostedBy: {post.userName}</Card.Text>
                                        </div>
                                    <CommentsDropdown postId={post.id} comments={post.comments} className="user-profile-comments-dropdown" />
                                    <InputGroup className="user-profile-comment-input-group">
                                        <Form.Control
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment[`post_${post.id}`] || ''}
                                            onChange={e => handlePostCommentChange(post.id, e.target.value)}
                                            className="user-profile-comment-input"
                                        />
                                        <Button onClick={() => addPostComment(post.id)} className="user-profile-comment-button">
                                            Comment
                                        </Button>
                                    </InputGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="d-flex justify-content-center">
                        <p>No posts available.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default UserProfilePosts;