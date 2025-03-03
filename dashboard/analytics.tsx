import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Determine the API base URL depending on environment
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001/backend"
    : "/backend";

export const logVisit = async () => {
  try {
    await fetch(`${API_BASE_URL}/track.php`, { method: "POST" }); // Calls the PHP script to log visit
  } catch (error) {
    console.error("Failed to log visit:", error);
  }
};

interface AnalyticsDashboardProps {
  isAuthenticated: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  isAuthenticated,
}) => {
  const [data, setData] = useState<{ date: string; visits: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const handleNext = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getAnalytics.php`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      setCurrentPage(totalPages - 1);
    }
  }, [data]);

  // Function to slice the data so the first page may be shorter
  // and the last page is always full (if data length > itemsPerPage)
  const getDisplayedData = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (totalPages <= 1) {
      return data; // Only one page, no re-chunking needed
    }
    const remainder = data.length % itemsPerPage;
    // If there's no remainder, normal segmentation
    if (remainder === 0) {
      const start = currentPage * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    }
    // Otherwise, first page gets the leftover, last pages are full
    if (currentPage === 0) {
      return data.slice(0, remainder);
    } else {
      // For subsequent pages, offset by remainder
      const offset = remainder + (currentPage - 1) * itemsPerPage;
      return data.slice(offset, offset + itemsPerPage);
    }
  };

  const displayedData = getDisplayedData();

  return isAuthenticated ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f7",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: "600px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>
          Analytics Dashboard
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayedData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#007aff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <button
            onClick={handlePrevious}
            style={{
              backgroundColor: "#007aff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            style={{
              backgroundColor: "#007aff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Access Denied: Please Authenticate</h3>
    </div>
  );
};

export default AnalyticsDashboard;
