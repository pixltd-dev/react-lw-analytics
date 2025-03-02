# 📊 React Analytics Dashboard

A lightweight analytics module for tracking **unique visitors per day** in React applications. Logs visits via a **PHP backend** and displays data in a **graphic dashboard**.

## 📦 Installation

```sh
git clone https://github.com/YOUR_USERNAME/react-lw-analytics.git
```

In your **React project**, link the module:

```json
"dependencies": {
  "react-lw-analytics": "file:../path-to-your-analytics-module"
}
```

Then install dependencies:

```sh
yarn install
# OR
npm install
```

## 🚀 Usage

Import and log visits:

```tsx
import { logVisit } from "react-lw-analytics";
useEffect(() => {
  logVisit();
}, []);
```

Display the dashboard:

```tsx
import AnalyticsDashboard from "react-lw-analytics";
<AnalyticsDashboard isAuthenticated={true} />;
```

## 🖥️ Backend Setup

The backend is included in the package. The only setup required is to create `analytics.json` inside the **public folder** of your React project:

```sh
touch public/analytics.json
chmod 666 public/analytics.json
```

If running locally, start a PHP server in the backend folder:

```sh
cd path-to-your-react-app/public
php -S localhost:8001
```

## 📜 License

GNU GENERAL PUBLIC LICENSE

🚀 Happy Coding!
