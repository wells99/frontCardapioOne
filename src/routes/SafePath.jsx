// src/components/SafePaths.jsx
import { Navigate } from 'react-router-dom'; // Use 'react-router-dom' para o Navigate
import { useAuth } from '../AuthContext';

const SafePaths = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default SafePaths;