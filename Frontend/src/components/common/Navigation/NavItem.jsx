import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classes from './Navigation.module.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const NavItem = ({ label, menuKey, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <li ref={dropdownRef} className={classes.dropdown}>
      <button className={classes.dropdownButton} onClick={handleMenuClick}>
        {label} <ArrowDropDownIcon style={{color:'white'}} />
      </button>
      {isOpen && (
        <ul className={classes.dropdownMenu}>
          {links.map((link, index) => (
            <li key={index}>
              <Link to={link.to} className={classes.link} onClick={handleLinkClick}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
