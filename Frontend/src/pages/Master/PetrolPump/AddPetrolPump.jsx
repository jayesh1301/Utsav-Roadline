import React, { useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { insertpetrolpump } from "../../../lib/api-pertrol-pump";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";


const AddPetrolPump = () => {
  const navigate = useNavigate();

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    address: "",
    contactNumber: "",
    emailId: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', 
    }));
  };

  const handleSubmit = async () => {
    let validationErrors = {};

    if (!formData.name) {
      validationErrors.name = "Petrol Pump Name is required";
    }
    if (!formData.ownerName) {
      validationErrors.ownerName = "Owner Name is required";
    }
    if (!formData.contactNumber) {
      validationErrors.contactNumber = "Contact Number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      validationErrors.contactNumber = "Contact Number should be 10 digits";
    }
    if (!formData.emailId) {
      validationErrors.emailId = "Email Id is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      validationErrors.emailId = "Email Id is not valid";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
      const responce=  await insertpetrolpump(formData);
      const message = responce.data.message; 
      if (message == "Petrol Pump  Already Exist!") {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
       
        // Swal.fire({
        //   title: 'Error!',
        //   text: message,
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
      } else if (responce.status == 200) {
      
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('success')
       
        // Swal.fire({
        //   title: 'Success!',
        //   text: message,
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // }).then(() => {
          navigate("/Petrol-Pump-List");
      }
      



      } catch (error) {
        console.error("Failed to add petrol pump", error);
        // Handle error
      }
    }
  };

  const handleCancel = () => {
    navigate("/Petrol-Pump-List");
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
        <h1>Save Petrol Pump</h1>
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
                id="name-input"
                name="name"
                variant="outlined"
                label="Name"
                size="small"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={5}>
      
              <TextField
                id="ownerName-input"
                name="ownerName"
                variant="outlined"
                label="Owner Name"
                size="small"
                fullWidth
                value={formData.ownerName}
                onChange={handleChange}
                error={!!errors.ownerName}
                helperText={errors.ownerName}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
             
              <TextField
                id="address-input"
                name="address"
                variant="outlined"
                label="Address"
                size="small"
                fullWidth
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
          
              <TextField
                id="contactNumber-input"
                name="contactNumber"
                variant="outlined"
                label="Contact Number"
                size="small"
                fullWidth
                value={formData.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
           
              <TextField
                id="emailId-input"
                name="emailId"
                variant="outlined"
                label="Email Id"
                size="small"
                fullWidth
                value={formData.emailId}
                onChange={handleChange}
                error={!!errors.emailId}
                helperText={errors.emailId}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>          </Grid>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{backgroundColor:'#ffa500'}}
              >
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="accent"
                onClick={handleCancel}
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

export default AddPetrolPump;
