import React from "react";
import { Navigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

//components
import Navbar from "../../components/admin/layout/navbar";
import Sidebar from "../../components/admin/layout/sidebar";
import TopCard from "../../components/admin/dashboard/TopCard";
import BodyCard from "../../components/admin/dashboard/BodyCard";
import BottomCard from "../../components/admin/dashboard/BottomCard";

//hooks
import { useAuth } from "../../hooks/useAuth";

//Style
import "../../styles/admin/dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const chartData = {
        english: {
            labels: ['Đang học', 'Hoàn thành', 'Bỏ học', 'Khác'],
            data: [60, 20, 5, 15],
            backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9E9E9E'],
        },
        programming: {
            labels: ['Đang học', 'Hoàn thành', 'Bỏ học', 'Khác'],
            data: [45, 40, 10, 5],
            backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9E9E9E'],
        },
        math: {
            labels: ['Đang học', 'Hoàn thành', 'Bỏ học', 'Khác'],
            data: [65, 20, 5, 10],
            backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9E9E9E'],
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: 'Jura'
                    }
                }
            }
        }
    };

    const { isAdmin, isAuthenticated, isLoading, error } = useAuth();

    if (isLoading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">Có lỗi xảy ra: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="home-container">
            <Navbar />
            <div className="content-wrapper">
                <Sidebar />
                <div className="main-content">
                    <div className="top-content">
                        <TopCard />
                    </div>

                    <div className="body-content">
                        <BodyCard chartData={chartData} chartOptions={chartOptions} />
                    </div>

                    <div className="bottom-content">
                        <BottomCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
