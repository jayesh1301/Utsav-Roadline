import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector } from "react-redux";
import { getDriverbyid, updatedrivers } from "../../../lib/api-driver";
import dayjs from "dayjs";
const UpdateDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handalCancel = () => {
    navigate("/Drivers-List");
  };
 
  const user = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    driver_name: "",
    corresp_address: "",
    permanat_address: "",
    date_of_birth: null,
    telephoneno: "",
    father_name: "",
    referenceby: "",
    eyesight: "",
    licenseno: "",
    license_type: "",
    remarks: "",
    qualification: "",
    mobileno:null,
    joining_date: null,
    blood_group: "",
    renewdate: null,
    expiry: null,
    branch:user.branch || null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    console.log(name,date)
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };
  const fetchdata = async () => {
    try {
      const response = await getDriverbyid(id);
      const driver = response.data[0];
      console.log(driver);
      if (driver) {
        setFormData({
          driver_name: driver.driver_name,
          corresp_address: driver.corresp_address,
          permanat_address: driver.permanat_address,
         date_of_birth:driver.date_of_birth,
          telephoneno: driver.telephoneno,
          father_name: driver.father_name,
          referenceby: driver.referenceby,
          eyesight: driver.eyesight,
          licenseno: driver.licenseno,
          license_type: driver.license_type,
          remarks: driver.remarks,
          qualification: driver.qualification,
         joining_date:driver.joining_date,
          blood_group: driver.blood_group,
         renewdate: driver.renewdate,
          expiry: driver.expiry,
          branch: driver.branch
        });
      } else {
       
        console.log("Driver data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updatedrivers(id, formData);
      console.log("Place updated successfully:", response.data);
      navigate("/Drivers-List");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("hiiii", id);
      fetchdata();
    }
  }, []);
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Update Driver</h1>
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
                name="driver_name"
                value={formData.driver_name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
          
              <TextField
                id="author-input"
                variant="outlined"
                name="corresp_address"
                label="Address"
                size="small"
                fullWidth
                value={formData.corresp_address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
           
              <TextField
                id="additional-input"
                name="permanat_address"
                variant="outlined"
                label="Permanent Address"
                size="small"
                fullWidth
                value={formData.permanat_address}
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
                    value={dayjs(formData.date_of_birth)}
                    onChange={(date) => handleDateChange("date_of_birth", date)}
                    label="DOB"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "dateOfBirth",
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
                 name="telephoneno"
                 value={formData.telephoneno}
                onChange={handleChange}
                fullWidth
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={4}>
          
              <TextField
                id="additional-input"
                variant="outlined"
                 name="father_name"
                label="Father Name"
                size="small"
                value={formData.father_name}
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
                  name="referenceby"
                label="Referenced By"
                size="small"
                value={formData.referenceby}
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
                 name="licenseno"
                 label="License No."
                 size="small"
                
                 value={formData.licenseno}
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
          
<FormControl fullWidth variant="outlined" size="small">
  <Select
    labelId="licenseType-selector-label"
    id="licenseType-selector"
    name="license_type"
    value={formData.license_type}
    onChange={handleChange}
    displayEmpty
    renderValue={(selected) => {
      switch (selected) {
        case '0':
          return "Higher-Heavy";
        case '1':
          return "Heavy";
        case '2':
          return "Non-Heavy";
        case '3':
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
                 name="remarks"
                label="Remark"
                size="small"
                value={formData.remarks}
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
                    value={dayjs(formData.joining_date)}
                    onChange={(date) => handleDateChange("joining_date", date)}
                    label="Joining Date"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "joiningDate",
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
                  name="blood_group"
                  value={formData.blood_group}
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
                    value={dayjs(formData.renewdate) || null}
                    onChange={(date) => handleDateChange("renewdate", date)}
                    label="Renew Date"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "renewdate",
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
                    value={dayjs(formData.expiry) || null}
                    onChange={(date) => handleDateChange("expiry", date)}
                    label="Expiry Date"
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "expiry",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
          
            </Grid>
                <Grid item xs={4}>
            
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
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handalCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default UpdateDriver;
