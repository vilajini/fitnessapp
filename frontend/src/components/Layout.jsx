import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="main-content">
                <Outlet /> {/* This is where nested routes will be rendered */}
            </div>
        </div>
    );
}

export default Layout;