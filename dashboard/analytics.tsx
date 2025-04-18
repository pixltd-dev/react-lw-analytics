import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./analytics.css";
import "./pixltd-grid.css";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001/backend"
    : "./backend";

export const logVisit = async () => {
  try {
    await fetch(`${API_BASE_URL}/track.php`, { method: "POST" });
  } catch (error) {
    console.error("Failed to log visit:", error);
  }
};

interface DataEntry {
  date: string;
  visits: number;
}

interface AnalyticsDashboardProps {
  isAuthenticated: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  isAuthenticated,
}) => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7; // one week = 7 days

  const computeTotalPages = () => {
    if (data.length === 0) return 0;
    const latestDate = new Date(data[0].date);
    const earliestDate = new Date(data[data.length - 1].date);
    const diffTime = Math.abs(latestDate.getTime() - earliestDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(diffDays / itemsPerPage);
  };

  const handleNext = () => {
    const totalPages = computeTotalPages();
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
        json.reverse();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const totalPages = computeTotalPages();
      setCurrentPage(totalPages - 1);
    }
  }, [data]);

  const getDisplayedData = () => {
    if (data.length === 0) return [];
    const totalPages = computeTotalPages();

    const latestDate = new Date(data[0].date);

    const day = latestDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const latestMonday = new Date(latestDate);
    latestMonday.setDate(latestDate.getDate() + diff + 1); // Move to the latest Monday
    latestMonday.setHours(0, 0, 0, 0);

    const weekOffset = totalPages - 1 - currentPage;
    const weekStart = new Date(latestMonday);
    weekStart.setDate(latestMonday.getDate() - weekOffset * 7);

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const dayData = data.find(
        (entry: DataEntry) => entry.date === dateString
      );
      return {
        date: dateString,
        visits: dayData ? dayData.visits : 0,
      };
    });

    console.log("Week Data:", weekData);
    console.log("Current Page:", currentPage);
    console.log("Week Start:", weekStart.toISOString().split("T")[0]);
    return weekData;
  };

  const displayedData = getDisplayedData();

  const getTotalVisitors = () => {
    return data.reduce((acc, { visits }) => acc + visits, 0);
  };

  const getThisWeekVisitors = () => {
    return displayedData.reduce((acc, { visits }) => acc + visits, 0);
  };

  const canMoveNext = () => {
    return currentPage < computeTotalPages() - 1;
  };

  const getHtmlTitle = () => {
    return document.querySelector("title")?.textContent;
  };

  return isAuthenticated ? (
    <div className="mainBox">
      <div className="top-bar">
        <div className="col-min">
          <h3>{getHtmlTitle()} - analytics</h3>
        </div>
      </div>
      <div className="sv-32"></div>
      <div className="row ar-center-h p-16" style={{ maxWidth: "600px" }}>
        <div className="col ac-left">
          <div className="analytics-card small">
            <h2 className="analytics-title small">Total</h2>
            <h1 className="analytics-number">{getTotalVisitors()}</h1>
          </div>
        </div>
        <div className="col ac-right">
          <div className="analytics-card small">
            <h2 className="analytics-title small">Weekly</h2>
            <h1 className="analytics-number">{getThisWeekVisitors()}</h1>
          </div>
        </div>
      </div>
      <div className="row ar-center-h p-16" style={{ maxWidth: "600px" }}>
        <div className="col ac-center-h">
          <div className="analytics-card">
            <h2 className="analytics-title small">Daily</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={displayedData}
                margin={{ top: 10, right: 20, left: -30, bottom: 10 }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={(dateString) => {
                    const dateObj = new Date(dateString);
                    return new Intl.DateTimeFormat(undefined, {
                      day: "numeric",
                      month: "short",
                    }).format(dateObj);
                  }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(dateString) => {
                    const dateObj = new Date(dateString);
                    return new Intl.DateTimeFormat(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(dateObj);
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#007aff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="button-container">
              <button onClick={handlePrevious} className="nav-button">
                ←
              </button>
              {canMoveNext() && (
                <button
                  onClick={handleNext}
                  disabled={!canMoveNext()}
                  className="nav-button"
                >
                  →
                </button>
              )}
            </div>
          </div>
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
