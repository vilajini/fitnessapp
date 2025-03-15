import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function LikeButton({ onClick, likes }) {
    return (
        <Button variant="link" onClick={onClick} style={{ padding: 0, margin: '0.5rem', fontSize: '1.5rem', color: 'maroon', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: '0.5rem' }} />
            <span>{likes || 0}</span>
        </Button>
    );
}

export default LikeButton;