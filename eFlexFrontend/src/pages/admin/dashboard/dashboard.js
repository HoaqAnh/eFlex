import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TopCard from "../../../components/admin/dashboard/TopCard";
import BodyCard from "../../../components/admin/dashboard/BodyCard";
import "../../../styles/admin/dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
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

    return (
        <div className="home-container">
            <div className="content-wrapper">
                <div className="main-content">
                    <div className="top-content">
                        <TopCard />
                    </div>

                    <div className="body-content">
                        <BodyCard chartData={chartData} chartOptions={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
