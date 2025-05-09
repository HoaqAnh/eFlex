import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';
import "../../../styles/layout/style.css"

const AdminLayout = () => {
    return (
        <div className="eflex">
            <Navbar />
            <div className="eflex-container">
                <Sidebar />
                <main className="eflex-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;