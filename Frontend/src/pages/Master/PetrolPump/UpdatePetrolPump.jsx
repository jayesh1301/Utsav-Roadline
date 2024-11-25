import React, { useState, useEffect } from "react";

import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getpetrolpumpbyid, updatepetrolpump } from "../../../lib/api-pertrol-pump";


const UpdatePetrolPump = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    petrolPumpName: "",
    ownerName: "",
    address: "",
    contactNumber: "",
    emailId: "",
  });

  useEffect(() => {
    const fetchPetrolPumpData = async () => {
      try {
        const response = await getpetrolpumpbyid(id);
        const data = response.data[0]; 
        console.log(data);
        setFormData({
          petrolPumpName: data.petrol_pump_name || "",
          ownerName: data.owner_name || "",
          address: data.address || "",
          contactNumber: data.contact_number || "",
          emailId: data.emailid || "",
        });
      } catch (error) {
        console.error('Error fetching petrol pump data:', error);
     
      }
    };

    fetchPetrolPumpData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/Petrol-Pump-List");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatepetrolpump(id, {
        petrol_pump_name: formData.petrolPumpName,
        owner_name: formData.ownerName,
        address: formData.address,
        contact_number: formData.contactNumber,
        emailid: formData.emailId,
      });
      console.log("Petrol pump updated successfully");
      navigate("/Petrol-Pump-List");
    } catch (error) {
      console.error("Error updating petrol pump:", error);
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Update Petrol Pump</h1>
      </Grid>
      <Paper elevation={3} style={{ padding: "16px", width: "100%" }}>
        <form onSubmit={handleSubmit}>
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
                  id="petrolPumpName"
                  name="petrolPumpName"
                  variant="outlined"
                  label="Petrol Pump Name"
                  size="small"
                  fullWidth
                  value={formData.petrolPumpName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={5}>
              
                <TextField
                  id="ownerName"
                  name="ownerName"
                  variant="outlined"
                  label="Owner Name"
                  size="small"
                  fullWidth
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={5} style={{ marginTop: "16px" }}>
            
                <TextField
                  id="address"
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
                  id="contactNumber"
                  name="contactNumber"
                  variant="outlined"
                  label="Contact Number"
                  size="small"
                  fullWidth
                  value={formData.contactNumber}
                  onChange={handleChange}
                  inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                />
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
                />
              </Grid>
              <Grid item xs={5} style={{ marginTop: "16px" }}>              </Grid>
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
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default UpdatePetrolPump;
