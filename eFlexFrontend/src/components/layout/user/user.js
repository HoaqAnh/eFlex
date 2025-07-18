import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/layout/style.css"

const UserLayout = () => {
    const { checkAuth } = useAuth();
    const authCheck = checkAuth();
    if (!authCheck.shouldRender) {
        return authCheck.component;
    }
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

export default UserLayout;