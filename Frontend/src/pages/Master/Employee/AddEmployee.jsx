import React, { useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AddEmployees } from "../../../lib/api-employee";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const bloodGroups = {
  0: "A+",
  1: "A-",
  2: "B+",
  3: "B-",
  4: "O+",
  5: "O-",
  6: "AB+",
  7: "AB-",
};

const AddEmployee = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [formData, setFormData] = useState({
    employeeName: "",
    correspAddress: "",
    permanentAddress: "",
    dateOfBirth: null,
    mobileNo: "",
    emailId: "",
    joiningDate: null,
    qualification: "",
    bloodGroup: "",
    designation: "",
    branch: user.branch || null,
  });
  const [formErrors, setFormErrors] = useState({
    employeeName: "",
    correspAddress: "",
    mobileNo: "",
    emailId: "",
    joiningDate: "",
    designation: "",
  });


  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handalCancel = () => {
    navigate("/Employees-List");
  };
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "employeeName":
        errorMessage = value.trim() === "" ? "Employee Name is required" : "";
        break;
      case "correspAddress":
        errorMessage = value.trim() === "" ? "Corresp Address is required" : "";
        break;
      case "mobileNo":
        errorMessage = value.trim() === "" ? "Mobile No is required" : "";
        break;
      case "emailId":
        errorMessage = !value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
          ? "Invalid Email Address"
          : "";
        break;
      case "joiningDate":
        errorMessage = !value ? "Joining Date is required" : "";
        break;
      case "designation":
        errorMessage = value.trim() === "" ? "Designation is required" : "";
        break;
      default:
        break;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));

    return errorMessage === "";
  };

  const handleSave = async () => {
    let isValid = true;
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        isValid = validateField(key, formData[key]) && isValid;
      }
    }
  
    if (isValid) {
      try {
        const response = await AddEmployees(formData);
        const message = response.data.message; // Ensure you extract the message from the response
  
        if (message == "Employee Already Exist!") {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('error')
    
          // Swal.fire({
          //   title: 'Success!',
          //   text: message,
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // }).then(() => {
           
          //});
        } else if (response.status == 200) {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('success')
          navigate("/Employees-List");
          // Swal.fire({
          //   title: 'Error!',
          //   text: message,
          //   icon: 'error',
          //   confirmButtonText: 'OK'
          // });
        } else {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('error')
          // Swal.fire({
          //   text: message,
          //   confirmButtonText: 'OK'
          // }).then(() => {
            navigate("/Employees-List");
         // });
        }
      } catch (error) {
        console.error("Error saving driver:", error);
      }
    }
  };
  
  return (
    <>
    <CustomSnackbar
     open={isConfirmationopen}
     message={confirmmessage}
     onClose = {()=> setConfirmationopen(false)}
     color={color}
     />
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Save Employee</h1>
      </Grid>
      <Paper elevation={3} style={{ padding: "10px"}}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Grid item xs={5}>
     
              <TextField
                id="employeeName"
                name="employeeName"
                variant="outlined"
                label="Employee Name"
                size="small"
                fullWidth
                value={formData.employeeName}
                onChange={handleChange}
                error={!!formErrors.employeeName}
              />
              {formErrors.employeeName && (
                <FormHelperText error>{formErrors.employeeName}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={5}>
            
              <TextField
                id="correspAddress"
                name="correspAddress"
                variant="outlined"
                label="Corresp Address"
                size="small"
                fullWidth
                value={formData.correspAddress}
                onChange={handleChange}
                error={!!formErrors.correspAddress}
              />
              {formErrors.correspAddress && (
                <FormHelperText error>
                  {formErrors.correspAddress}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
       
              <TextField
                id="permanentAddress"
                name="permanentAddress"
                variant="outlined"
                label="Permanant Address"
                size="small"
                fullWidth
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
         
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(date) => handleDateChange("dateOfBirth", date)}
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label:"Date Of Birth"
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
          
              <TextField
                id="mobileNo"
                name="mobileNo"
                variant="outlined"
                label="Mobile No"
                size="small"
                fullWidth
                value={formData.mobileNo}
                onChange={handleChange}
                error={!!formErrors.mobileNo}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
              {formErrors.mobileNo && (
                <FormHelperText error>{formErrors.mobileNo}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
        
              <TextField
                id="emailId"
                name="emailId"
                variant="outlined"
                label="Email Id"
                size="small"
                fullWidth
                value={formData.emailId}
                onChange={handleChange}
                error={!!formErrors.emailId}
              />{" "}
              {formErrors.emailId && (
                <FormHelperText error>{formErrors.emailId}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
        
              <FormControl fullWidth error={!!formErrors.joiningDate}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="joiningDate"
                    value={formData.joiningDate}
                    onChange={(date) => handleDateChange("joiningDate", date)}
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label:"Joining Date"
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
              {formErrors.joiningDate && (
                <FormHelperText error>{formErrors.joiningDate}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
           
              <TextField
                id="qualification"
                name="qualification"
                variant="outlined"
                label="Qualification"
                size="small"
                fullWidth
                value={formData.qualification}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
       
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  labelId="bloodGroup"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? bloodGroups[selected] : "Blood Group"
                  }
                >
                  <MenuItem value="">Select Blood Group</MenuItem>
                  <MenuItem value={0}>A+</MenuItem>
                  <MenuItem value={1}>A-</MenuItem>
                  <MenuItem value={2}>B+</MenuItem>
                  <MenuItem value={3}>B-</MenuItem>
                  <MenuItem value={4}>O+</MenuItem>
                  <MenuItem value={5}>O-</MenuItem>
                  <MenuItem value={6}>AB+</MenuItem>
                  <MenuItem value={7}>AB-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
             
              <TextField
                id="designation"
                name="designation"
                variant="outlined"
                label="Designation"
                size="small"
                fullWidth
                value={formData.designation}
                onChange={handleChange}
                error={!!formErrors.designation}
              />{" "}
              {formErrors.designation && (
                <FormHelperText error>{formErrors.designation}</FormHelperText>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "16px" }}
          >
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSave} style={{backgroundColor:'#ffa500'}}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="accent"
                onClick={handalCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
    </>
  );
};

export default AddEmployee;
