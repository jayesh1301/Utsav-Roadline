import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RouteGuard = ({ children }) => {
  const loggedIn = Cookies.get('logedIn') === 'true';
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RouteGuard;
