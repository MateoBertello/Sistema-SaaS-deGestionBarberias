import { Navigate, Outlet } from 'react-router';

interface Props { allowedRoles: string[]; }

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem('token');
  const userRol = localStorage.getItem('rol');

  if (!token) return <Navigate to="/" replace />;

  if (userRol && !allowedRoles.includes(userRol)) {
    if (userRol === 'CLIENTE') return <Navigate to="/client" replace />;
    if (userRol === 'BARBERO') return <Navigate to="/barber" replace />;
    if (userRol === 'DUEÑO') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};