import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import classes from './Header.module.css';
import { userLogout } from '../../../redux/authentication/actionCreator';
import { useDispatch } from 'react-redux';

// Import your logo image
import logoImage from './RajeshTransport Logo.png'; 
import dayjs from 'dayjs';

const Header = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const handleLogout = async() => {
    const logout = await dispatch(userLogout());
    
    if(logout.type === 'LOGOUT_SUCCESS') {
      navigate('/login');
    }
  };
  const formattedDate = dayjs().format('DD-MM-YYYY');

  return (
    <header className={classes.header}>
      <div className={classes.logoContainer}>
        {/* <img src={logoImage} alt="Logo" className={classes.logo} /> */}
        <div>
<Typography variant='h6' style={{ margin: 0 ,fontFamily:'Poppins',fontWeight:'bolder',letterSpacing:'1px', fontSize:'24px'}}>
<span id="icon">UTSAV ROADLINE</span>

</Typography>

          {/* <h2 className={classes.headerTitle} >RAJESH TRANSPORT SERVICES */}
           <Typography variant='body2' style={{ margin: 0 , fontFamily:'Poppins'}}>
           <span id="icons" style={{textAlign:"left"}}>
           Pune-Nashik Road, Post - Chimbli, Tal. Khed, Dist. Pune. 410501.
            </span>

           </Typography>
          {/* <p style={{ textAlign: 'left' }}>
            GURURAMDAS WAREHOUSING, GAT NO. 2347,
            OPP.PARIJAT DHADA, PUNE NAGAR ROAD, WAGHOLI, PUNE 412 207. PH.:
            46781371, PH.: (020)60508083
          </p> */}
          {/* </h2> */}
        </div>
      </div>
      <div className={`${classes.userInfo} spaced-elements`}>
        <h4>Welcome, superadmin  Date: {formattedDate}</h4>
        {/* <h4>Date: {formattedDate}</h4> */}
        <Button
          variant="text"
          color="primary"
          startIcon={<LogoutIcon />}
          style={{ color: '#b4bcc8' }}
          onClick={handleLogout} 
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
