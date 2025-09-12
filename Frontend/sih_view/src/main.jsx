import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import LandingPage from "./components/Landing/LandingPage";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import WindowsSolution from "./components/Solutions/WindowsSolution";
import LinuxSolution from "./components/Solutions/LinuxSolution";
import History from "./components/History/History";
import Certificates from "./components/Certificates/Certificates";
import Register from "./components/Auth/Register";
import { AuthProvider } from "./context/AuthContext"; // ✅ import provider

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/solutions/windows", element: <WindowsSolution /> },
  { path: "/solutions/linux", element: <LinuxSolution /> },
  { path: "/history", element: <History /> },
  { path: "/certificates", element: <Certificates /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
       <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </StrictMode>
);
