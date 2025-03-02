import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PASSWORD = 'admin123'; // Change this to your desired password

// Determine the API base URL depending on environment
const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8001' : '';

export const logVisit = async () => {
  try {
    await fetch(`${API_BASE_URL}/track.php`, { method: 'POST' }); // Calls the PHP script to log visit
  } catch (error) {
    console.error('Failed to log visit:', error);
  }
};

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<{ date: string; visits: number }[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/getAnalytics.php`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchData();
  }, []);

  return authenticated ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f7',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          width: '90%',
          maxWidth: '600px',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#333' }}>
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f7',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h3 style={{ marginBottom: '10px' }}>Enter Password:</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={() => setAuthenticated(password === PASSWORD)}
          style={{
            background: '#007aff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
