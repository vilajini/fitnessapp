import React, { useState } from 'react';
import { Dropdown, Button, Modal } from 'react-bootstrap';

function CommentsDropdown({ postId, comments, onUpdate, onDelete }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    const handleTextClick = (commentId, commentText) => {
        setSelectedComment({ id: commentId, text: commentText });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <React.Fragment>
            <Dropdown>
                <Dropdown.Toggle variant="info" id={`dropdown-comments-${postId}`} style={{ padding: '0.5rem 1rem' }}>
                    View Comments
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '200px', padding: '0.5rem 1rem' }}>
                    {comments.map((comment, index) => (
                        <Dropdown.Item key={index}>
                            <strong onClick={() => handleTextClick(comment.id, comment.text)}></strong> {comment.text}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Comment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Comment:</strong> {selectedComment?.text}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

export default CommentsDropdown;