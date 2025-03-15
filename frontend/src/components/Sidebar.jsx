import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useUser } from './user/UserContext';
import { BiPlus } from 'react-icons/bi'; // Import BiPlus icon from react-icons
import { BsPerson, BsCardText, BsBoxArrowRight } from 'react-icons/bs'; // Import other icons
import './Sidebar.css';

function Sidebar() {
    const { user, userId, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('name');
        if (storedUserId) {
            setUser({ id: storedUserId });
            console.log("Header userID: " + storedUserId);
            console.log("Header Name: " + storedName);
        }
    }, [setUser]);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <NavLink to="/home" className="nav-link" style={{ color: "white" }}>
                <span className="ms-2" style={{ color: "white", fontSize: "35px" }}>Fitness App</span>
                </NavLink>
            </div>
            <Nav className="flex-column">
                <Nav.Item style={{ backgroundColor: "maroon", color: "white", marginTop: "25px", borderRadius: "25px" }}>
                    <NavLink to="/add-post" className="nav-link" style={{ color: "white" }}>
                        <BiPlus style={{ marginRight: "10px" }} /> Create Post
                    </NavLink>
                </Nav.Item>
                {user ? (
                    <>
                        <Nav.Item style={{ backgroundColor: "maroon", color: "white", marginTop: "25px", borderRadius: "25px" }}>
                            <NavLink to={`/user-profile/${userId}`} className="nav-link" style={{ color: "white" }}>
                                <BsPerson style={{ marginRight: "10px" }} /> My Profile
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item style={{ backgroundColor: "maroon", color: "white", marginTop: "25px", borderRadius: "25px" }}>
                            <NavLink to={`/user-posts/${userId}`} className="nav-link" style={{ color: "white" }}>
                                <BsCardText style={{ marginRight: "10px" }} /> My Posts
                            </NavLink>
                        </Nav.Item>
                        <Nav.Item style={{ backgroundColor: "maroon", color: "white", marginTop: "25px", borderRadius: "25px" }}>
                            <Nav.Link onClick={handleLogout} style={{ color: "white" }}>
                                <BsBoxArrowRight style={{ marginRight: "10px" }} /> Logout
                            </Nav.Link>
                        </Nav.Item>
                    </>
                ) : (
                    <Nav.Item style={{ backgroundColor: "maroon", color: "white", marginTop: "25px", borderRadius: "25px" }}>
                        <NavLink to="/" className="nav-link" style={{ color: "white" }}>Sign In</NavLink>
                    </Nav.Item>
                )}
            </Nav>
        </div>
    );
}

export default Sidebar;