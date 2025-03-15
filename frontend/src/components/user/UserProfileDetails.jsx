import React, { useState } from 'react';
import { Card, Button, Image } from 'react-bootstrap';

function UserProfileDetails({ userId, name }) {
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = () => {
        if (isFollowing) {
            setFollowersCount(prevCount => prevCount - 1);
            setIsFollowing(false);
        } else {
            setFollowersCount(prevCount => prevCount + 1);
            setIsFollowing(true);
        }
    };

    return (
        <Card className="shadow" style={{marginBottom: "25px"}}>
            <Card.Body className="text-center">
                <Card.Title><h4>{name}</h4></Card.Title>
            </Card.Body>
        </Card>
    );
}

export default UserProfileDetails;