import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import classes from "./Login.module.css";
import loginImage from "../../../assets/URLOGO.png";
import topLeftImage from "../../../assets/TNB_Logo1.png"; // Add your top-left image path here
import web from "../../../assets/web.png";
import { userLoginAction } from '../../../redux/authentication/actionCreator';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loginAction = await dispatch(userLoginAction(formData));
      if (loginAction.type === "LOGIN_SUCCESS") {
        navigate("/home");
      } else if (loginAction.type === "LOGIN_ERR") {
        console.error("Login error:", loginAction.err);
        setError(loginAction.err);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <>

      <section className={classes.loginPage}>
        <img src={topLeftImage} alt="Top Left" className={classes.topLeftImage} />
        <div className={classes.manageAccount}>
          <h1>Welcome to the Transporter NoteBook Digital ERP System</h1>
          <h2 className={classes.underline}>Facilitating Transport, Enabling Growth</h2>
          <p>
            Economic growth critically depends on efficient transportation systems. TNB makes all the data and processes in multiple branches across India, completely digital, safe, and accessible from anywhere
          </p>
        </div>
        <div className={classes.loginContainer}>
          <div className={classes.loginForm}>
            <img src={loginImage} alt="Login Illustration" className={classes.loginImage} />
            <div className={classes.space}></div>
            <form onSubmit={handleSubmit}>
              <div className={classes.formGroup}>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Username or Email ID"
                  required
                />
              </div>
              <div className={classes.formGroup}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  placeholder="PASSWORD"
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className={classes.error}>{error}</p>}
              <button type="submit" className={classes.loginButton}>
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer placed outside of the loginPage section */}
      <footer className={classes.footer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={web} 
            alt="Transporter NoteBook Website"  
            style={{ maxWidth: '100%', height: 'auto', marginRight: '8px' }}
          />
          <a href="https://transporternotebook.com/" target="_blank" rel="noreferrer">
            Transporter Note Book
          </a>
        </div>
        <div>
          Powered by: <a href="https://vspace.in">Vspace Software</a> 
        </div>
        <div>
          Email <a href="mailto:tnb@vspace.co.in">tnb@vspace.co.in</a>
        </div>
      </footer>
    
  </>
  );
};

export default Login;
