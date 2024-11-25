import React, { useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddVehicleType } from '../../../lib/api-vehicletype';
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddVehicleTypeComponent = () => {
  const user = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ vehicleType: "", tyreQuantity: "" });
  const [errors, setErrors] = useState({});


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const handalCancel = () => {
    navigate("/Vehicle-Type-List");
  };

  const handleSave = async () => {
    let validationErrors = {};
  
    if (!formData.vehicleType) {
      validationErrors.vehicleType = "Vehicle Type is required";
    }
    if (!formData.tyreQuantity) {
      validationErrors.tyreQuantity = "Tyre Quantity is required";
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await AddVehicleType(formData);
   
        const message = response.data.message; 
    
        if (message == "Vehicle Type Already Exist!") {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('error')
         
          // Swal.fire({
          //   title: 'Error!',
          //   text: message,
          //   icon: 'error',
          //   confirmButtonText: 'OK'
          // });
        } else if (response.status == 200) {
        
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('success')
         
          // Swal.fire({
          //   title: 'Success!',
          //   text: message,
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // }).then(() => {
            navigate("/Vehicle-Type-List");
        } else {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('success')
         
          // Swal.fire({
          //   text: message,
          //   confirmButtonText: 'OK'
          // }).then(() => {
            navigate("/Vehicle-Type-List");
          //});
        }
      } catch (error) {
        console.error("Error saving driver:", error);
        // Handle error
      }
    }};
    
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: '',
    }));
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
        <h1>Save Vehicle Type</h1>
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
          >
            <Grid item xs={5}>
           
              <TextField
                id="title-input"
                name="vehicleType"
                variant="outlined"
                label="Vehicle Type"
                size="small"
                fullWidth
                value={formData.vehicleType}
                onChange={handleInputChange}
                error={!!errors.vehicleType}
                helperText={errors.vehicleType}
              />
            </Grid>
            <Grid item xs={5}>
             
              <TextField
                id="author-input"
                name="tyreQuantity"
                variant="outlined"
                label="Tyre Quantity"
                size="small"
                fullWidth
                value={formData.tyreQuantity}
                onChange={handleInputChange}
    error={!!errors.tyreQuantity}
    helperText={errors.tyreQuantity}
              />
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

export default AddVehicleTypeComponent;
