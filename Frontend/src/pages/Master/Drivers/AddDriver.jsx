import React, { useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Adddriver } from "../../../lib/api-driver";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddDriver = () => {
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Drivers-List");
  };
  const user = useSelector((state) => state.auth);



  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [formData, setFormData] = useState({
    name: "",
    address: "",
    permanentAddress: "",
    dateOfBirth: null,
    telephone: "",
    fatherName: "",
    referencedBy: "",
    eyesight: "",
    licenseNo: "",
    licenseType: "",
    remark: "",
    qualification: "",
    mobileno: null,
    joiningDate: null,
    bloodGroup: "",
    renewDate: null,
    expiryDate: null,
    branch: user.branch || null,
  });
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    telephone: "",
    licenseNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Telephone is required";
      valid = false;
    }

    if (!formData.licenseNo.trim()) {
      newErrors.licenseNo = "License No. is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    try {
      if (validateForm()) {
        const response = await Adddriver(formData);
        const message = response.data.message; // Ensure you extract the message from the response
  console.log(message)
        if (message == "Driver  Already Exist!") {
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
          navigate("/Drivers-List");

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
            navigate("/Drivers-List");
         // });
        }
      }
    } catch (error) {
      console.error("Error saving driver:", error);
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
        <h1>Save Driver</h1>
      </Grid>
      <Paper elevation={3} style={{ padding: "16px", width: "100%" }}>
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
            style={{ marginBottom: "16px" }}
          >
            <Grid item xs={4}>
         
              <TextField
                id="title-input"
                variant="outlined"
                label="Name"
                size="small"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={4}>
        
              <TextField
                id="author-input"
                variant="outlined"
                name="address"
                label="Address"
                size="small"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="additional-input"
                name="permanentAddress"
                variant="outlined"
                label="Permanent Address"
                size="small"
                fullWidth
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginBottom: "16px" }}
          >
            <Grid item xs={4}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(date) => handleDateChange("dateOfBirth", date)}
                    placeholder="DOB"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "dateOfBirth",
                        label:"Date of Birth"
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
           
              <TextField
                id="additional-input"
                variant="outlined"
                label="Telephone"
                size="small"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                fullWidth
                error={!!errors.telephone}
                helperText={errors.telephone}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={4}>
        
              <TextField
                id="additional-input"
                variant="outlined"
                name="fatherName"
                label="Father Name"
                size="small"
                value={formData.fatherName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginBottom: "16px" }}
          >
            <Grid item xs={4}>
         
              <TextField
                id="additional-input"
                variant="outlined"
                name="referencedBy"
                label="Referenced By"
                size="small"
                value={formData.referencedBy}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
             
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  labelId="eyesight-selector-label"
                  id="eyesight-selector"
                  name="eyesight"
                  value={formData.eyesight}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? selected : "Select Eyesight"
                  }
                >
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
         
              <TextField
                variant="outlined"
                name="licenseNo"
                label="License No."
                size="small"
                value={formData.licenseNo}
                onChange={handleChange}
                fullWidth
                error={!!errors.licenseNo}
                helperText={errors.licenseNo}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginBottom: "16px" }}
          >
            <Grid item xs={4}>
           
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  labelId="licenseType-selector-label"
                  id="licenseType-selector"
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) => {
                    switch (selected) {
                      case 0:
                        return "Higher-Heavy";
                      case 1:
                        return "Heavy";
                      case 2:
                        return "Non-Heavy";
                      case 3:
                        return "Normal";
                      default:
                        return "Select License Type";
                    }
                  }}
                >
                  <MenuItem value={0}>Higher-Heavy</MenuItem>
                  <MenuItem value={1}>Heavy</MenuItem>
                  <MenuItem value={2}>Non-Heavy</MenuItem>
                  <MenuItem value={3}>Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
        
              <TextField
                id="additional-input"
                variant="outlined"
                name="remark"
                label="Remark"
                size="small"
                value={formData.remark}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
            
              <TextField
                id="additional-input"
                variant="outlined"
                name="qualification"
                label="Qualification"
                size="small"
                value={formData.qualification}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginBottom: "16px" }}
          >
            <Grid item xs={4}>
           
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formData.joiningDate}
                    onChange={(date) => handleDateChange("joiningDate", date)}
                    placeholder="Joining Date"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "joiningDate",
                        label:"Joining Date"
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
         
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  labelId="bloodGroup-selector-label"
                  id="bloodGroup-selector"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? selected : "Select Blood Group"
                  }
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
           
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formData.renewDate}
                    onChange={(date) => handleDateChange("renewDate", date)}
                    placeholder="Renew Date"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "renewDate",
                        label:"Renew Date"
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginBottom: "16px" }}
          >
            <Grid item xs={4}>
        
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formData.expiryDate}
                    onChange={(date) => handleDateChange("expiryDate", date)}
                    placeholder="Expiry Date"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "expiryDate",
                        label:"Expiry Date"
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
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

export default AddDriver;
