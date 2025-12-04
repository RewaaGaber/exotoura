import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useAuthStore } from "../../Auth/index.js";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const EventsStatistics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  // Color scheme
  const colorScheme = {
    primary: "#6366F1",
    secondary: "#EC4899",
    accent: "#14B8A6",
    dark: "#64748B",
    light: "#F1F5F9",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    purple: "#8B5CF6",
  };

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/event/statistics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(response.data.data);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Unauthorized: Please login again"
          : err.response?.status === 403
          ? "Forbidden: You don't have permission"
          : "Failed to fetch event statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStatistics();
    } else {
      setError("Authentication required. Please login.");
      setLoading(false);
    }
  }, [token]);

  // Prepare data for charts
  const prepareChartData = (field, label, backgroundColor) => {
    return {
      labels: stats.map((item) => item.type),
      datasets: [
        {
          label,
          data: stats.map((item) => item[field]),
          backgroundColor: backgroundColor || colorScheme.primary,
          borderColor: "#ffffff",
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.7,
        },
      ],
    };
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#F8FAFC",
        bodyColor: "#F8FAFC",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748B" } },
      y: { beginAtZero: true, grid: { color: "#E2E8F0" }, ticks: { color: "#64748B" } },
    },
  };

  const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#334155",
        font: { size: 12 },
        padding: 16,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      backgroundColor: "#1E293B",
      titleColor: "#F8FAFC",
      bodyColor: "#F8FAFC",
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 14, weight: "600" },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((context.raw / total) * 100); // Fixed the missing parenthesis
          return `${context.label}: ${context.raw} (${percentage}%)`;
        },
      },
    },
  },
};

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#F8FAFC",
        bodyColor: "#F8FAFC",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748B" } },
      y: { beginAtZero: true, grid: { color: "#E2E8F0" }, ticks: { color: "#64748B" } },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colorScheme.primary }}
        ></div>
        <p className="text-lg font-medium text-gray-600">Loading event statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-96 space-y-4 p-6 bg-red-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FiAlertCircle className="text-red-500 text-4xl" />
        <p className="text-lg font-medium text-red-600 text-center">{error}</p>
        <button
          onClick={fetchStatistics}
          className="flex items-center px-4 py-2 rounded-lg transition"
          style={{ background: colorScheme.primary, color: "white" }}
        >
          <FiRefreshCw className="mr-2" />
          Retry
        </button>
      </motion.div>
    );
  }

  // Calculate totals for summary cards
  const totals = stats.reduce(
    (acc, item) => ({
      totalEvents: acc.totalEvents + item.totalEvents,
      totalAttendees: acc.totalAttendees + item.totalAttendees,
      totalVolunteers: acc.totalVolunteers + item.totalVolunteers,
      totalRevenueEstimate: acc.totalRevenueEstimate + item.totalRevenueEstimate,
      totalAccessibilityFeatures: acc.totalAccessibilityFeatures + item.totalAccessibilityFeatures,
    }),
    {
      totalEvents: 0,
      totalAttendees: 0,
      totalVolunteers: 0,
      totalRevenueEstimate: 0,
      totalAccessibilityFeatures: 0,
    }
  );

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiCalendar className="mr-2" style={{ color: colorScheme.primary }} />
            Event Statistics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive analytics for all event types
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStatistics}
            className="flex items-center px-3 py-1.5 text-sm rounded-lg transition"
            style={{
              background: colorScheme.light,
              color: colorScheme.primary,
            }}
          >
            <FiRefreshCw className="mr-1.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <h3 className="text-2xl font-bold mt-1">{totals.totalEvents}</h3>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: `${colorScheme.primary}20` }}
            >
              <FiCalendar
                className="text-xl"
                style={{ color: colorScheme.primary }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Attendees</p>
              <h3 className="text-2xl font-bold mt-1">{totals.totalAttendees}</h3>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: `${colorScheme.success}20` }}
            >
              <FiUsers
                className="text-xl"
                style={{ color: colorScheme.success }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Volunteers</p>
              <h3 className="text-2xl font-bold mt-1">{totals.totalVolunteers}</h3>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: `${colorScheme.info}20` }}
            >
              <FiAward
                className="text-xl"
                style={{ color: colorScheme.info }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">${totals.totalRevenueEstimate}</h3>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: `${colorScheme.warning}20` }}
            >
              <FiDollarSign
                className="text-xl"
                style={{ color: colorScheme.warning }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Accessibility Features</p>
              <h3 className="text-2xl font-bold mt-1">{totals.totalAccessibilityFeatures}</h3>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ background: `${colorScheme.accent}20` }}
            >
              <FiTrendingUp
                className="text-xl"
                style={{ color: colorScheme.accent }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Events by Type</h3>
          <div className="relative h-72">
            <Bar
              data={prepareChartData("totalEvents", "Total Events", [
                colorScheme.primary,
                colorScheme.secondary,
                colorScheme.accent,
                colorScheme.warning,
                colorScheme.purple,
              ])}
              options={barChartOptions}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Type Distribution</h3>
          <div className="relative h-72">
            <Pie
              data={prepareChartData("totalEvents", "Total Events", [
                colorScheme.primary,
                colorScheme.secondary,
                colorScheme.accent,
                colorScheme.warning,
                colorScheme.purple,
              ])}
              options={pieChartOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Price by Event Type</h3>
          <div className="relative h-72">
            <Bar
              data={prepareChartData("averagePrice", "Average Price ($)", colorScheme.info)}
              options={barChartOptions}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Estimate by Event Type</h3>
          <div className="relative h-72">
            <Line
              data={prepareChartData("totalRevenueEstimate", "Revenue Estimate ($)", colorScheme.success)}
              options={lineChartOptions}
            />
          </div>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Event Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accessibility Features
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.totalEvents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.totalAttendees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.totalVolunteers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${stat.averagePrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${stat.totalRevenueEstimate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.totalAccessibilityFeatures}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default EventsStatistics;