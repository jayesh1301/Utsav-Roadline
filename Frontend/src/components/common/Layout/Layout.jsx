// src/components/layout/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import classes from './Layout.module.css';
import Header from '../header/Header';
import CustomRoutes from '../../../routes/routes';
import Navigation from '../Navigation/Navigation';
import Footer from '../footer/Footer';
import Login from '../Login/Login';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      {!isLoginPage && <Navigation />}
      <main className={isLoginPage ? '' : classes.main_content}>
        {isLoginPage ? <Login /> : <CustomRoutes />}
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
};

export default Layout;
