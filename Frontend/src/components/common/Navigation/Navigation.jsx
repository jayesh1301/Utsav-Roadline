import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Navigation.module.css';
import NavItem from './NavItem';

const Navigation = () => {
  const navItems = [
    { label: 'Users', menuKey: 'users', links: [
      { label: 'User Registration', to: '/user-registration' },
      { label: 'User Permissions', to: '/user-permissions' },
      
    ] },
    { label: 'Master', menuKey: 'master', links: [
      { label: 'Articles', to: '/Articles-List' },
      { label: 'Places', to: '/Place-List' },
      { label: 'Branches', to: '/Branches-List' },
      //{ label: 'Bank List', to: '/Bank-List' },
     // { label: 'Bank Account List', to: '/Bank-Account-List' },
      { label: 'Customers', to: '/Customers-List' },
      { label: 'Customers Emails' ,to:'/CustomerEmail-List' },
      { label: 'Drivers', to: '/Drivers-List' },
      { label: 'Employees', to: '/Employees-List' },
      { label: 'Vehicle', to: '/Vehicle-List' },
     // { label: 'Rate Master List', to: '/Rate-Master-List' },
      { label: 'Vehicle Owner', to: '/Vehicle-Owner-List' },
      { label: 'Vehicle Type', to: '/Vehicle-Type-List' },
      //{ label: 'Tyre Supplier', to: '/Tyre-Supplier-List' },
     // { label: 'Petrol Pump', to: '/Petrol-Pump-List' },
      //{ label: 'Profile', to: '/Profile' }
    ] },
    { label: 'Transactions', menuKey: 'transactions', links: [
      { label: 'Lorry Recipt ', to: '/LR' },
      { label: 'Loading Trip List', to: '/loading_trip' },
      { label: 'Bill List', to: '/Bill-List' },
      // { label: 'Payment Advice Vehicle ', to: '/Payment-Advice-Vehicle' },
      // { label: 'Delivery Status ', to: '/delivery-status' },
    ] },
    { label: 'Reports', menuKey: 'reports', links: [
      { label: 'Pending LR Status', to: '/reports/Pending-LR-Status' },
      { label: 'Lorry Receipt Register', to: '/reports/Lorry-Receipt-Register' },
      { label: 'Loading Trip Register', to: '/reports/Loading-Trip-Register' },
      { label: 'Bill Register', to: '/reports/Bill-Register' },
      // { label: 'Not Billed LR Status', to: '/reports/Not-Billed-LR-Status' },
      // { label: 'Delivery Status Report', to: '/reports/Delivery-Status-Report' },
      // { label: 'Vehicle Pay Advice Report', to: '/reports/Vehicle-Pay-Advice-Report' },
 
    ] }
  
  ];

  return (
    <nav className={classes.nav}>
      <ul>
        {navItems.map((item, index) => (
          <NavItem key={index} label={item.label} menuKey={item.menuKey} links={item.links} />
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
