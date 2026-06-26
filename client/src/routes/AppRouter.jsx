import {
  Routes,
  Route,
} from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

import PrivateRoute from "./PrivateRoute";
import TripDetailsPage from "../pages/TripDetailsPage";
import GlobalExpensesPage from "../pages/dashboard/GlobalExpensesPage";
import GlobalSettlementsPage from "../pages/dashboard/GlobalSettlementsPage";
import FriendsPage from "../pages/dashboard/FriendsPage";
import ReportsPage from "../pages/dashboard/ReportsPage";
import NotificationsPage from "../pages/dashboard/NotificationsPage";
import SettingsPage from "../pages/dashboard/SettingsPage";
import MyTripsPage from "../pages/dashboard/MyTripsPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<RegisterPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/trips/:tripId"
        element={
          <PrivateRoute>
            <TripDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/trips"
        element={
          <PrivateRoute>
            <MyTripsPage />
          </PrivateRoute>
        }
      />
      <Route path="/dashboard/expenses" element={<PrivateRoute><GlobalExpensesPage /></PrivateRoute>} />
      <Route path="/dashboard/settlements" element={<PrivateRoute><GlobalSettlementsPage /></PrivateRoute>} />
      <Route path="/dashboard/friends" element={<PrivateRoute><FriendsPage /></PrivateRoute>} />
      <Route path="/dashboard/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
      <Route path="/dashboard/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
      <Route path="/dashboard/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      
      <Route
        path="*"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;