import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@mui/material';
import { getAllBranch } from "../../lib/api-branch";
import{ useSelector }from'react-redux';
import { getallEmployee } from "../../lib/api-employee";
const NewUserRegistration = () => {
  const navigate = useNavigate(); 
  const [branch,setBranch]=useState([])
  const [employee,setEmployee]=useState([])
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    selectedBranch: '',
    selectedEmployee: '',
    userType: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  const user = useSelector(state => state.auth);
 
  const handleCancel = () => {
    navigate('/user-registration');
  };
  const getbranch = async () => {
    try {
      const response = await getAllBranch();
      const { data } = response;

      const branchList = data.map((branch) => ({
        branch_id: branch.branch_id,
        branch_name: branch.branch_name,
      }));

      setBranch(branchList);
      const userBranch = branchList.find((b) => b.branch_id == user.branch);
      if (userBranch) {
        setFormData((prevData) => ({
          ...prevData,
          selectedBranch: userBranch.branch_id
        }));
      }
      
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const getemployee = async () => {
    try {
      const response = await getallEmployee();
      const { data } = response;

      const employeeList = data.map((employee) => ({
        emp_id: employee.emp_id,
        employee_name: employee.employee_name,
      }));

      setEmployee(employeeList);
     
      
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const handleBranchChange = (event) => {
    const branchId = event.target.value;
    setSelectedBranch(branchId);
    console.log("Selected Branch ID:", branchId);
  };
  const handleEmployeeChange = (event) => {
    const EmployeeId = event.target.value;
    setSelectedEmployee(EmployeeId);
    console.log("Selected Branch ID:", EmployeeId);
  };
  const handleUserTypeChange = (event) => {
    const userType = event.target.value;
    setUserType(userType);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  useEffect(() => {
    getbranch()
    getemployee()
  }, []);
  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Add form submission logic here
  };
  return (
    <>
      <Grid item xs={12}>
        <h1>Register User</h1>
      </Grid>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20}}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <h2>User Registration</h2>
          </Grid>
          <Grid item xs={3}>
       
            <FormControl fullWidth size='small'>
            <InputLabel htmlFor="option1">Choose Branch:</InputLabel>
            <Select
                name="selectedBranch"
                value={formData.selectedBranch}
                onChange={handleChange}
                label="Choose Branch"
              >
                {branch.map((b) => (
                  <MenuItem key={b.branch_id} value={b.branch_id}>
                    {b.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
          
            <FormControl fullWidth size='small'>
            <InputLabel htmlFor="option2">User Type</InputLabel>
            <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                label="User Type"
              >
                <MenuItem value={0}>Normal User</MenuItem>
                <MenuItem value={1}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} container spacing={2} justifyContent="center">
            <Grid item xs={3}>
         
              <FormControl fullWidth size='small'>
              <InputLabel htmlFor="option3">Select Employee:</InputLabel>
              <Select
                  name="selectedEmployee"
                  value={formData.selectedEmployee}
                  onChange={handleChange}
                  label="Select Employee"
                >
                  {employee.map((e) => (
                    <MenuItem key={e.emp_id} value={e.emp_id}>
                      {e.employee_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              
              <TextField
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                label="User Name"
                fullWidth
                size='small'
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={2} justifyContent="center">
            <Grid item xs={3}>
         
              <TextField
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                size='small'
              />
            </Grid>
            <Grid item xs={3}>
             
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                size='small'
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="center" spacing={2}>
  <Grid item>
    <Button variant="contained" color="primary" onClick={handleSubmit} style={{backgroundColor:'#ffa500'}}>Save</Button>
  </Grid>
  <Grid item>
    <Button variant="contained" color="accent" onClick={handleCancel}>Cancel</Button>
  </Grid>
</Grid>

  

        </Grid>
      </Paper>
    </>
  );
};

export default NewUserRegistration;
