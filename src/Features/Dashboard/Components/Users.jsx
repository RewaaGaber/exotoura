import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useAuthStore } from "../../Auth/index.js";
import {
  FiRefreshCw,
  FiAlertCircle,
  FiUsers,
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import UserAvatar from "../../../Components/ui/UserAvarar";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Users = () => {
  const [chartData, setChartData] = useState(null);
  const [disabilityData, setDisabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(1000);
  const [totalUsers, setTotalUsers] = useState(0);

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

  const fetchUsers = async (page = 1, limit = rowsPerPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });

      const { data } = response;
      setUsers(data.data.users);
      setTotalUsers(data.total);

      // Process data for charts
      processChartData(data.data.users);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Unauthorized: Please login again"
          : err.response?.status === 403
          ? "Forbidden: You don't have permission"
          : "Failed to fetch user data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (usersData) => {
    // Initialize counts
    const counts = {
      USER: { total: 0, disabilities: {} },
      ADMIN: { total: 0, disabilities: {} },
      ORGANIZER: { total: 0, disabilities: {} },
      HOSTER: { total: 0, disabilities: {} },
      VOLUNTEER: { total: 0, disabilities: {} },
    };

    const disabilityTypes = [
      "Mobility Disability",
      "Visual Disability",
      "Hearing Disability",
      "Speech and Communication Disability",
    ];

    // Initialize disability counts
    Object.keys(counts).forEach((role) => {
      disabilityTypes.forEach((disability) => {
        counts[role].disabilities[disability] = 0;
      });
    });

    // Process users
    usersData.forEach((user) => {
      if (!user.role || !Array.isArray(user.role)) return;
      user.role.forEach((role) => {
        if (counts[role]) {
          counts[role].total += 1;
          if (user.disabilities && Array.isArray(user.disabilities)) {
            user.disabilities.forEach((disability) => {
              if (
                disability.name &&
                counts[role].disabilities[disability.name] !== undefined
              ) {
                counts[role].disabilities[disability.name] += 1;
              }
            });
          }
        }
      });
    });

    // Prepare role chart data (excluding ADMIN)
    const rolesToShow = Object.keys(counts).filter((role) => role !== "ADMIN");
    const roleChartData = {
      labels: rolesToShow,
      datasets: [
        {
          label: "Users by Role",
          data: rolesToShow.map((role) => counts[role].total),
          backgroundColor: [
            colorScheme.primary,
            colorScheme.secondary,
            colorScheme.accent,
            colorScheme.warning,
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.7,
        },
      ],
    };

    // Prepare disability chart data
    const disabilityTotals = disabilityTypes.map((disability) => ({
      disability,
      count: Object.values(counts).reduce(
        (sum, role) => sum + role.disabilities[disability],
        0
      ),
    }));

    const disabilityChartData = {
      labels: disabilityTypes.map((d) => d.split(" ")[0]),
      datasets: [
        {
          label: "Users by Disability",
          data: disabilityTotals.map((d) => d.count),
          backgroundColor: [
            colorScheme.primary,
            colorScheme.secondary,
            colorScheme.accent,
            colorScheme.purple,
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };

    setChartData(roleChartData);
    setDisabilityData(disabilityChartData);
  };

  useEffect(() => {
    if (token) {
      fetchUsers(currentPage);
    } else {
      setError("Authentication required. Please login.");
      setLoading(false);
    }
  }, [token, currentPage]);

  // Filter users based on search term and selected roles
  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchTerm
      ? user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesRoles =
      selectedRoles.length > 0
        ? user.role?.some((role) => selectedRoles.includes(role))
        : true;

    return matchesSearch && matchesRoles;
  });

  // Role options for filtering
  const roleOptions = [
    { label: "User", value: "USER" },
    { label: "Organizer", value: "ORGANIZER" },
    { label: "Hoster", value: "HOSTER" },
    { label: "Volunteer", value: "VOLUNTEER" },
  ];

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const getVisiblePages = () => {
    const totalPages = Math.ceil(totalUsers / rowsPerPage);
    const visiblePages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      visiblePages.push(1);

      if (start > 2) {
        visiblePages.push("...");
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }

      if (end < totalPages - 1) {
        visiblePages.push("...");
      }

      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  // Chart options (same as before)
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
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} users`,
        },
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
            const percentage = Math.round((context.raw / total) * 100);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colorScheme.primary }}
        ></div>
        <p className="text-lg font-medium text-gray-600">Loading user data...</p>
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
          onClick={() => fetchUsers(currentPage)}
          className="flex items-center px-4 py-2 rounded-lg transition"
          style={{ background: colorScheme.primary, color: "white" }}
        >
          <FiRefreshCw className="mr-2" />
          Retry
        </button>
      </motion.div>
    );
  }

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
            <FiUsers className="mr-2" style={{ color: colorScheme.primary }} />
            User Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {users.length} of {totalUsers} users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers(currentPage)}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
          <div className="relative h-72">
            {chartData && <Bar data={chartData} options={barChartOptions} />}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Users by Disability
          </h3>
          <div className="relative h-72">
            {disabilityData && <Pie data={disabilityData} options={pieChartOptions} />}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  setSelectedRoles((prev) =>
                    prev.includes(role.value)
                      ? prev.filter((r) => r !== role.value)
                      : [...prev, role.value]
                  );
                }}
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedRoles.includes(role.value)
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disabilities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserAvatar profilePicture={user.profilePicture} size={40} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName?.firstName} {user.fullName?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.role?.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              background:
                                role === "ADMIN"
                                  ? colorScheme.danger
                                  : role === "ORGANIZER"
                                  ? colorScheme.warning
                                  : role === "HOSTER"
                                  ? colorScheme.info
                                  : role === "VOLUNTEER"
                                  ? colorScheme.success
                                  : colorScheme.dark,
                              color: "white",
                            }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.disabilities?.length > 0 ? (
                          user.disabilities.map((d) => (
                            <span
                              key={d.name}
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                background: colorScheme.info,
                                color: "white",
                              }}
                            >
                              {d.name.split(" ")[0]}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          background:
                            user.emailStatus === "verified"
                              ? colorScheme.success
                              : colorScheme.warning,
                          color: "white",
                        }}
                      >
                        {user.emailStatus === "verified" ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalUsers > rowsPerPage && (
          <div className="flex justify-center my-6">
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center items-center">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200 text-sm sm:text-base flex items-center gap-1 shadow-sm"
              >
                <FiChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {getVisiblePages().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-amber-500 text-white border border-amber-500 shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(Math.ceil(totalUsers / rowsPerPage), currentPage + 1)
                  )
                }
                disabled={currentPage === Math.ceil(totalUsers / rowsPerPage)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200 disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200 text-sm sm:text-base flex items-center gap-1 shadow-sm"
              >
                Next
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Users;
