import React, { useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper, Autocomplete, Select, MenuItem, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VechicleFrom from "./VechicleFrom";
import VechicleForm from "./VechicleFrom";
import { AddVehicleOwener } from "../../../lib/api-vehicleowner";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const addressOptions = { 0: 'Vehicle', 1: 'Garage' }; 
const AddVehicleOwner = () => {
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Vehicle-Owner-List");
  };
  const [vehicleContacts, setVehicleContacts] = useState([
  
  ]);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')



  const [formData, setFormData] = useState({
    ownerName: '',
    ownerType: '',
    address: '',
    city: '',
    telephone: '',
    email: '',
    pan: '',
    vendorCode: '',
    vat: '',
    cst: '',
    ecc: ''
  });

  const [errors, setErrors] = useState({
    ownerName: '',
    address: '',
    telephone: '',
    pan: ''
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSelectChange = (event) => {
    setFormData({
      ...formData,
      ownerType: Object.keys(addressOptions).find(key => addressOptions[key] === event.target.value)
    });
  };
  const handleVehicleContactsChange = (contacts) => {
    setVehicleContacts(contacts);
  };
  
  const handleSave = async () => {
    // Reset errors
    setErrors({
      ownerName: '',
      address: '',
      telephone: '',
      pan: ''
    });
  
    // Validate required fields
    const { ownerName, address, telephone, pan } = formData;
    let hasError = false;
    const newErrors = {};
  
    if (!ownerName) {
      newErrors.ownerName = 'Vehicle Owner Name is required';
      hasError = true;
    }
    if (!address) {
      newErrors.address = 'Address is required';
      hasError = true;
    }
    if (!telephone) {
      newErrors.telephone = 'Telephone No is required';
      hasError = true;
    }
    if (!pan) {
      newErrors.pan = 'PAN No is required';
      hasError = true;
    }
  
    if (hasError) {
      setErrors(newErrors);
      return; // Exit the function if validation fails
    }
  
    try {
      const combinedData = {
        ...formData,
        vehicleContacts,
      };
      const response = await AddVehicleOwener(combinedData);
      console.log(response)
      const message = response.data.message; 
  
      if (message == 'Vehical Owner  Already Exist!') {
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
        setColor('Success')
        navigate("/Vehicle-Owner-List");
        // Swal.fire({
        //   title: 'Error!',
        //   text: message,
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
      } else {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('success')

        // Swal.fire({
        //   text: message,
        //   confirmButtonText: 'OK'
        // }).then(() => {
          navigate("/Vehicle-Owner-List");
       // });
      }
    } catch (error) {
      console.error("Error saving driver:", error);
      // Handle error
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
        <h1>Vehicle Owner Details</h1>
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
                id="ownerName"
                name="ownerName"
                variant="outlined"
                label="Vehicle Owner Name"
                size="small"
                fullWidth
                value={formData.ownerName}
                onChange={handleChange}
                error={!!errors.ownerName}
                helperText={errors.ownerName}
              />
            </Grid>
            <Grid item xs={4}>
           
            <FormControl variant="outlined" fullWidth size="small">
            <InputLabel id="ownerType-label">Select Owner Type</InputLabel>
                <Select
                  id="ownerType"
                  name="ownerType"
                  value={addressOptions[formData.ownerType] || ''}
                  onChange={handleSelectChange}
                    label="Select Owner Type"
                  
                >
                    
                  {Object.values(addressOptions).map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
    </Grid>
            <Grid item xs={4}>
           
              <TextField
                id="address"
                name="address"
                variant="outlined"
                label="Address"
                size="small"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
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
                id="city"
                name="city"
                variant="outlined"
                label="City"
                size="small"
                fullWidth
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
            
              <TextField
                id="telephone"
                name="telephone"
                variant="outlined"
                label="Telephone No"
                size="small"
                fullWidth
                value={formData.telephone}
                onChange={handleChange}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                error={!!errors.telephone}
                helperText={errors.telephone}
              />
            </Grid>
            <Grid item xs={4}>
           
              <TextField
                id="email"
                name="email"
                variant="outlined"
                label="Email ID"
                size="small"
                fullWidth
                value={formData.email}
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

  <TextField
                id="pan"
                name="pan"
                variant="outlined"
                label="PAN No"
                size="small"
                fullWidth
                value={formData.pan}
                onChange={handleChange}
                error={!!errors.pan}
                helperText={errors.pan}
              />
</Grid>

            <Grid item xs={4}>
          
            <TextField
                id="vendorCode"
                name="vendorCode"
                variant="outlined"
                label="Vendor Code"
                size="small"
                fullWidth
                value={formData.vendorCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
        
              <TextField
                id="vat"
                name="vat"
                variant="outlined"
                label="VAT No"
                size="small"
                fullWidth
                value={formData.vat}
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
           
              <TextField
                id="cst"
                name="cst"
                variant="outlined"
                label="CST No"
                size="small"
                fullWidth
                value={formData.cst}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
         
              <TextField
                id="ecc"
                name="ecc"
                variant="outlined"
                label="ECC Number"
                size="small"
                fullWidth
                value={formData.ecc}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
            </Grid>
           
          </Grid>
          <VechicleForm
            vehicleContacts={vehicleContacts}
            setVehicleContacts={handleVehicleContactsChange}
          />
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

export default AddVehicleOwner;
