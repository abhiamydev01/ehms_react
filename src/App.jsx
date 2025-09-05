import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import DashboardLayout from "./pages/dashboardLayout";
import DynamicPage from "./components/dynamicPages";
import { useEffect } from "react";
import * as Validation from "./components/validation"; 
 
import PrivateRoute from "./components/privateRoute";


export default function App() {
  useEffect(() => {
    window.Validation = Validation;
    Validation.enableNumberOnlyValidation();
     Validation.enableLimitedInput();
     Validation.enabledescvalidation();
      Validation.enableNoSpaceInput();

  }, []);

  return (
      <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/:encrypted/*" element={<DashboardLayout />}>
          <Route index element={<DynamicPage />} />
          <Route path=":subEncrypted" element={<DynamicPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

