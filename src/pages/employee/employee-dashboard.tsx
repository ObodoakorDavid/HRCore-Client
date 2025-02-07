import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function EmployeeDashboard() {
  const tasksCompletedData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [8, 15, 12, 18, 10, 20],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const departmentDistributionData = {
    labels: ["Engineering", "Sales", "HR", "Marketing", "Support"],
    datasets: [
      {
        data: [25, 20, 10, 15, 30],
        backgroundColor: [
          "#f87171",
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#a78bfa",
        ],
      },
    ],
  };

  return <div></div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Card */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Performance Summary
          </h2>
          <Bar data={tasksCompletedData} />
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Department Distribution
          </h2>
          <Pie data={departmentDistributionData} />
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          Recent Tasks
        </h2>
        <ul className="space-y-2">
          {[
            "Complete financial report",
            "Prepare presentation for Q2",
            "Update team meeting notes",
            "Review code changes",
          ].map((task, index) => (
            <li
              key={index}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
