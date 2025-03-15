import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewPosts from './ViewPosts';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        fetchPosts();
        console.log("User ID:", localStorage.getItem("userId"));
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const addPostLike = async (postId) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/like`);
            fetchPosts();
        } catch (error) {
            console.error('Error adding post like:', error);
        }
    };

    const deletePostComment = async (postId, commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/posts/${postId}/comments/${commentId}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post comment:', error);
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
        <ViewPosts
    posts={posts}
    handlePostCommentChange={handlePostCommentChange}
    addPostComment={addPostComment}
    newComment={newComment}
    addPostLike={addPostLike}
    deletePostComment={deletePostComment}
/>
    );
}

export default HomePage;