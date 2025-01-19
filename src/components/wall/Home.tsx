import { useEffect, useRef } from "react";
import profile_icon from '../../assets/icon/profile_icon.png';
import '../../css/components/Home.css';
import { useSelector } from "react-redux";
import { Staff } from "../../model/Staff.ts";
import { Vehicle } from "../../model/Vehicle.ts";
import { Field } from "../../model/Field.ts";
import { Equ } from "../../model/Equ.ts";
import { Crop } from "../../model/Crop.ts";
import { PieController, ArcElement, Tooltip, Legend, Title, DoughnutController } from 'chart.js';
import Chart from 'chart.js/auto';
import { Chart as ChartJS } from 'chart.js';
ChartJS.register(PieController, ArcElement, Tooltip, Legend, Title, DoughnutController);


const Home = () => {
    const staff = useSelector((state: { staff: Staff[] }) => state.staff);
    const vehicle = useSelector((state: { vehicle: Vehicle[] }) => state.vehicle);
    const field = useSelector((state: { field: Field[] }) => state.field);
    const equipment = useSelector((state: { equ: Equ[] }) => state.equ || []);
    const crop = useSelector((state: { crop: Crop[] }) => state.crop);

    const vehicleChartRef = useRef<HTMLCanvasElement | null>(null);
    const equipmentChartRef = useRef<HTMLCanvasElement | null>(null);
    const vehicleChartInstance = useRef<Chart | null>(null);
    const equipmentChartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        // Cleanup previous instances of vehicleChart
        if (vehicleChartInstance.current) {
            vehicleChartInstance.current.destroy();
        }

        if (vehicleChartRef.current) {
            const ctx = vehicleChartRef.current.getContext("2d");
            if (ctx) {
                const availableVehicles = vehicle.filter(v => v.assignedDriver !== "").length;
                const unavailableVehicles = vehicle.length - availableVehicles;

                vehicleChartInstance.current = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: ["Available Vehicles", "Unavailable Vehicles"],
                        datasets: [
                            {
                                data: [availableVehicles, unavailableVehicles],
                                backgroundColor: ["rgba(116,234,120,0.8)", "rgba(248,120,131,0.8)"],
                                borderColor: ["rgba(116,234,120,1)", "rgba(248,120,131,1)"],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        const label = tooltipItem.label || "";
                                        const value = tooltipItem.raw as number;
                                        const total = tooltipItem.dataset.data.reduce((acc, val) => acc + (val as number), 0);
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        return `${label}: ${value} (${percentage}%)`;
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
    }, [vehicle]);

    useEffect(() => {
        // Cleanup previous instances of equipmentChart
        if (equipmentChartInstance.current) {
            equipmentChartInstance.current.destroy();
        }

        if (equipmentChartRef.current) {
            const ctx = equipmentChartRef.current.getContext("2d");
            if (ctx) {
                const availableEquipment = equipment.filter(e => e.assignStaff !== "").length;
                const unavailableEquipment = equipment.length - availableEquipment;

                equipmentChartInstance.current = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: ["Available Equipment", "Unavailable Equipment"],
                        datasets: [
                            {
                                data: [availableEquipment, unavailableEquipment],
                                backgroundColor: ["rgba(116,234,120,0.8)", "rgba(248,120,131,0.8)"],
                                borderColor: ["rgba(116,234,120,0.8)", "rgba(248,120,131,0.8)"],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        const label = tooltipItem.label || "";
                                        const value = tooltipItem.raw as number;
                                        const total = tooltipItem.dataset.data.reduce((acc, val) => acc + (val as number), 0);
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        return `${label}: ${value} (${percentage}%)`;
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
    }, [equipment]);

    return (
        <div className="p-5 bg-transparent w-100" id="home-page">
            <div className="dashboard-header d-flex justify-content-between">
                <div>
                    <h1>Hi, User</h1>
                    <p>Welcome back & Let's work together</p>
                </div>
                <img className="profile-img" src={profile_icon} alt="Profile" />
            </div>
            <div className="d-flex w-100 justify-content-between count-set mt-4">
                <div className="staff-count">
                    <h4>Staff Count</h4>
                    <h1>{staff?.length}</h1>
                </div>
                <div className="vehicle-count">
                    <h4>Vehicle Count</h4>
                    <h1>{vehicle?.length}</h1>
                </div>
                <div className="field-count">
                    <h4>Field Count</h4>
                    <h1>{field?.length}</h1>
                </div>
                <div className="equipment-count">
                    <h4>Equipment Count</h4>
                    <h1>{equipment?.length}</h1>
                </div>
                <div className="crop-count">
                    <h4>Crop Count</h4>
                    <h1>{crop?.length}</h1>
                </div>
            </div>
            <div className="charts w-100 d-grid">
                {/* Vehicle Pie Chart */}
                <div className="mt-4">
                    <canvas ref={vehicleChartRef} id="vehicleChart" style={ { width : "1px !import" } }></canvas>
                </div>

                {/* Equipment Donut Chart */}
                <div className="mt-4">
                    <canvas ref={equipmentChartRef} id="equipmentChart" width={680} height={541} ></canvas>
                </div>
            </div>
        </div>
    );
};

export default Home;
