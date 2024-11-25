import React, { useState, useEffect } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getvehicletypebyid, updatevehicletype } from "../../../lib/api-vehicletype"; 

const UpdateVehicleType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ vehicleType: "", tyreQuantity: "" });

  const handleCancel = () => {
    navigate("/Vehicle-Type-List");
  };

  useEffect(() => {
    const fetchVehicleType = async () => {
      try {
        const response = await getvehicletypebyid(id);
        const { vehicle_type, tyre_qty } = response.data[0];
        setFormData({ vehicleType: vehicle_type, tyreQuantity: tyre_qty });
      } catch (error) {
        console.error("Error fetching vehicle type by ID:", error);
      }
    };

    fetchVehicleType();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      await updatevehicletype(id, formData); 
      navigate("/Vehicle-Type-List");
    } catch (error) {
      console.error("Error updating vehicle type:", error);
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
        <h1>Update Vehicle Type</h1>
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
                onChange={handleChange}
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
                onClick={handleCancel}
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

export default UpdateVehicleType;
