import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./navbar";
import Sidebar from "./sidebar"

const AdminLayout = () => (
    <div>
        <Navbar />
        <div style={{ display: "flex" }}>
            <Sidebar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    </div>
);

export default AdminLayout;