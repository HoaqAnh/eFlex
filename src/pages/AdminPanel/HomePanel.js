import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PanelStyles/HomePanel.css";
import Navbar from "../../components/AdminPanel/Navbar";
import Sidebar from "../../components/AdminPanel/Sidebar";
import "../../styles//Navbar.css";
import "../../styles/Sidebar.css";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function HomePanel() {
    const navigate = useNavigate();
    const username = "Admin";
    const token = localStorage.getItem("token");

    /*
    //Logic total students
    const [totalStudents, setTotalStudents] = useState(0);
    useEffect(() => {
        const fetchTotalStudents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/students/total`);
                const data = await response.json();
                setTotalStudents(data.total);
            } catch (error) {
                console.error("Error fetching total students:", error);
            }
        };
        fetchTotalStudents();
    }, []);
    */
    const totalStudents = 9800100;
    const newStudents = 1910;

    const englishData = {
        labels: ['Đang học', 'Hoàn thành', 'Bỏ học', 'Khác'],
        data: [60, 20, 5, 15],
        backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9E9E9E'],
    };

    const programmingData = {
        labels: ['Đang học', 'Hoàn thành', 'Bỏ học', 'Khác'],
        data: [45, 40, 10, 5],
        backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9E9E9E'],
    };

    const mathData = {
        labels: ['Đang học', 'Hoàn thành', 'Bỏ học', 'Khác'],
        data: [65, 20, 5, 10],
        backgroundColor: ['#4CAF50', '#2196F3', '#F44336', '#9E9E9E'],
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

    const createChartData = (data) => ({
        labels: data.labels,
        datasets: [{
            data: data.data,
            backgroundColor: data.backgroundColor,
            borderWidth: 0
        }]
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        if (token == null)
            navigate("/login");
    }, [token, navigate]);

    return (
        <div className="home-container">
            <Navbar username={username} onlogout={handleLogout} />
            <div className="content-wrapper">
                <Sidebar />
                <div className="main-content">
                    <div className="top-content">
                        <div className="top-card">
                            <div className="top-card-left">
                                <h2>Học viên</h2>
                            </div>
                            <div className="top-card-right">
                                <h4>Tổng số học viên: {totalStudents}</h4>
                                <h4>Đăng ký mới trong tháng: {newStudents}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="body-content">
                        <div className="body-card">
                            <div className="body-card-header">
                                <h2>Thống kê tiến độ học tập</h2>
                            </div>
                            <div className="body-card-body">
                                <div className="charts-container">
                                    <div className="chart-item">
                                        <h4>Tiếng anh</h4>
                                        <div className="chart-wrapper">
                                            <Pie data={createChartData(englishData)} options={chartOptions} />
                                        </div>
                                    </div>
                                    <div className="chart-item">
                                        <h4>Kỹ thuật lập trình</h4>
                                        <div className="chart-wrapper">
                                            <Pie data={createChartData(programmingData)} options={chartOptions} />
                                        </div>
                                    </div>
                                    <div className="chart-item">
                                        <h4>Giải tích</h4>
                                        <div className="chart-wrapper">
                                            <Pie data={createChartData(mathData)} options={chartOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-content">
                        <div className="bottom-card">
                            <div className="bottom-card-header">
                                <h2>Lịch sử hoạt động</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePanel;
