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
          <LineChart data={data}>
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
      </div>
    </div>
  ) : (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Access Denied: Please Authenticate</h3>
    </div>
  );
};

export default AnalyticsDashboard;
