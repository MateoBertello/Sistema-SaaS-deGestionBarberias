import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/login/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ClientLayout } from "./components/client/ClientLayout";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { BookingWizard } from "./components/client/BookingWizard";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { StaffManagement } from "./components/admin/StaffManagement";
import { ServicesManagement } from "./components/admin/ServicesManagement";
import { BranchManagement } from "./components/admin/BranchManagement";
import { ScheduleConfig } from "./components/admin/ScheduleConfig";
import { BarberLayout } from "./components/barber/BarberLayout";
import { BarberDashboard } from "./components/barber/BarberDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    element: <ProtectedRoute allowedRoles={['CLIENTE']} />,
    children: [
      { path: "/client", element: <ClientLayout />, children: [
          { index: true, element: <ClientDashboard /> },
          { path: "booking", element: <BookingWizard /> },
      ]}
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={['DUEÑO']} />,
    children: [
      { path: "/admin", element: <AdminLayout />, children: [
          { index: true, element: <AdminDashboard /> },
          { path: "staff", element: <StaffManagement /> },
          { path: "services", element: <ServicesManagement /> },
          { path: "branches", element: <BranchManagement /> },
          { path: "schedules", element: <ScheduleConfig /> },
      ]}
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={['BARBERO']} />,
    children: [
      { path: "/barber", element: <BarberLayout />, children: [
          { index: true, element: <BarberDashboard /> },
      ]}
    ]
  }
]);