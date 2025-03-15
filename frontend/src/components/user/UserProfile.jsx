/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import UserProfileDetails from './UserProfileDetails';
import UserProfilePosts from './UserProfilePosts';

function UserProfile() {
    const [posts, setPosts] = useState([]);
    const [newComment, setNewComment] = useState({});
    const { userId, name } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        console.log("User ID:", userId);
        console.log("User Name:", name);
    }, [userId, name]);

    useEffect(() => {
        setLoading(false); // Set loading to false once userId is fetched
    }, [userId]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const addPostLike = async (postId) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/like`);
            fetchPosts(); // Refresh posts to show updated likes
        } catch (error) {
            console.error('Error adding post like:', error);
        }
    };

    const handlePostCommentChange = (postId, text) => {
        setNewComment({ ...newComment, [`post_${postId}`]: text });
    };

    const addPostComment = async (postId) => {
        if (newComment[`post_${postId}`]) {
            try {
                await axios.post(`http://localhost:8080/api/posts/${postId}/comment`, { text: newComment[`post_${postId}`] });
                fetchPosts();
                setNewComment({ ...newComment, [`post_${postId}`]: '' });
            } catch (error) {
                console.error('Error adding post comment:', error);
            }
        }
    };

    return (
        <div style={{width: "1040px", border: "#cf1111",borderRadius: "8px"}}>
            <UserProfileDetails userId={userId} name={name} />
            <UserProfilePosts
                posts={posts}
                addPostLike={addPostLike}
                addPostComment={addPostComment}
                handlePostCommentChange={handlePostCommentChange}
                newComment={newComment}
            />
        </div>
    );
}

export default UserProfile;