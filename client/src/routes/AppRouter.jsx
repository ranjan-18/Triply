import { Routes, Route } from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

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
    </Routes>
  );
};

export default AppRouter;