import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddPost from './components/post/AddPost';
import SignIn from './components/user/SignIn';
import SignUp from './components/user/SignUp';
import Home from './components/Home';
import { UserProvider } from './components/user/UserContext';
import GetUserPosts from './components/post/GetUserPosts';
import Layout from './components/Layout';
import UserProfile from './components/user/UserProfile';
import EditPost from './components/post/EditPost'; // Make sure the import path is correct

function AppRouter() {    
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route element={<Layout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/add-post" element={<AddPost />} />
                        <Route path="/edit-post/:id" element={<EditPost />} /> {/* Make sure the path and component are correctly defined */}
                        <Route path="/user-posts/:userId" element={<GetUserPosts />} />
                        <Route path="/user-profile/:userId" element={<UserProfile />} />
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default AppRouter;