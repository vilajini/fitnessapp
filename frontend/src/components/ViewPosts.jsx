import React, { useState } from 'react';
import { Card, Button, Form, InputGroup, Row, Col, Modal, Image, Carousel } from 'react-bootstrap';
import LikeButton from './LikeButton';
import './ViewPosts.css'; // Import the CSS file

function ViewPosts({ posts, handlePostCommentChange, addPostComment, newComment, addPostLike, deletePostComment }) {
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null); // Define selectedComment state

    const handleCommentButtonClick = (post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
    };

    const handleDeleteComment = () => {
        if (selectedPost && selectedComment) {
            deletePostComment(selectedPost.id, selectedComment.id); // Call deletePostComment with selected comment
            setSelectedComment(null);
        }
    };

    const handleCloseCommentsModal = () => {
        setShowCommentsModal(false);
        setSelectedPost(null);
    };

    return (
        <React.Fragment>
            <Row xs={1} md={2} lg={2} className="post-container">
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map(post => (
                        <Col key={post.id}>
                            <Card className="post-card">
                                <Card.Body>
                                    <Card.Title style={{ textAlign: "center", fontSize: "25px", color: "white" }}>{post.title}</Card.Title>
                                    <Carousel interval={5000}>
                                        {post.mediaUrls.map((imageUrl, index) => (
                                            <Carousel.Item key={index}>
                                                <Image src={imageUrl} alt={`Image ${index}`} fluid />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                    <div className="d-flex align-items-center post-user-info">
                                        <div>
                                            <Card.Text style={{ textAlign: "center", fontSize: "20px", color: "white", marginBottom: "25px" }}>{post.description}</Card.Text>
                                            <Card.Text>{post.createdAt}</Card.Text>
                                        </div>
                                        <br/>
                                    </div>
                                    <Card.Text>{post.caption}</Card.Text>
                                    <LikeButton onClick={() => addPostLike(post.id)} likes={post.likes} />
                                    <div>
                                        <Card.Text style={{ textAlign: "right", fontSize: "20px", color: "white" }}>PostedBy: {post.userName}</Card.Text>
                                        </div>
                                    <InputGroup className="mb-3 comment-input">
                                        <Form.Control
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment[`post_${post.id}`] || ''}
                                            onChange={e => handlePostCommentChange(post.id, e.target.value)}
                                        />
                                        <Button onClick={() => addPostComment(post.id)} className="comment-button">
                                            Comment
                                        </Button>
                                    </InputGroup>
                                    <Button onClick={() => handleCommentButtonClick(post)} className="comment-button">
                                        View Comments
                                    </Button>
                                </Card.Body>
                            </Card>
                            {console.log("User's Name:", post.name)} {/* Log the user's name */}
                        </Col>
                    ))
                ) : (
                    <Col className="d-flex justify-content-center">
                        <p>No posts available.</p>
                    </Col>
                )}
            </Row>
            <Modal show={showCommentsModal} onHide={handleCloseCommentsModal} className="comments-modal">
                <Modal.Header closeButton className="comments-modal-header">
                    <Modal.Title className="comments-modal-title">Comments for "{selectedPost?.title}"</Modal.Title>
                </Modal.Header>
                <Modal.Body className="comments-modal-body">
                    {selectedPost && selectedPost.comments.map(comment => (
    <div key={comment.id}>
        <p>{comment.text}</p>
        <Button onClick={() => { setSelectedComment(comment); handleDeleteComment(); }}>Delete</Button>
    </div>
))}
                </Modal.Body>
                <Modal.Footer className="comments-modal-footer">
                    <Button onClick={handleCloseCommentsModal}>
                        Close
                    </Button>
                    {selectedComment && (
                        <Button onClick={handleDeleteComment}>
                            Confirm Delete
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

export default ViewPosts;