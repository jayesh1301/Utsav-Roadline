import React, { useState, useEffect } from "react";
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
import dayjs from "dayjs";
import { UpdateVehicles, getVehiclebyid } from "../../../lib/api-vehicle";
import { useSelector } from "react-redux";
import { getallvehicletype, getallvehicletypes } from "../../../lib/api-vehicletype";
import { getallVehicleOwener } from "../../../lib/api-vehicleowner";
const options = ["Option 1", "Option 2", "Option 3"];
const UpdateVechicle = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  console.log("hiihihii", user.branch);
  const [vehicletype, setVehicleType] = useState([]);
  const [vehicleowner, setVehicleOwner] = useState([]);
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Vehicle-List");
  };

  const [formData, setFormData] = useState({
    vehicleOwnerName: "",
    vehicleType: "",
    vehicleNo: "",
    capacity: "",
    make: "",
    description: "",
    regDate: null,
    expDate: null,
    engineNo: "",
    chasisNo: "",
    pucNo: "",
    pucExpDate: null,
    body: "",
    branch: user.branch || null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };
  const fetchdata = async () => {
    try {
      const response = await getVehiclebyid(id);
      const vehicle = response.data[0];
      console.log(vehicle);
      if (vehicle) {
        setFormData({
          vehicleOwnerName: vehicle.vod_id,
          vehicleType: vehicle.vt_id,
          vehicleNo: vehicle.vehicleno,
          capacity: vehicle.capacity,
          make: vehicle.make,
          description: vehicle.description,
          regDate: vehicle.reg_date,
          expDate: vehicle.vehicleexpdate,
          engineNo: vehicle.engineno,
          chasisNo: vehicle.chasisno,
          pucNo: vehicle.pucno,
          pucExpDate: vehicle.pucexpdate,
          body: vehicle.body,
          branch: vehicle.branch,
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
      const response = await UpdateVehicles(id, formData, user.branch);
      console.log("Place updated successfully:", response.data);
      navigate("/Vehicle-List");
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
  const getvehicletypes = async () => {
    try {
      const response = await getallvehicletype();
      const { data } = response;
      console.log(data);
      const vehicletypes = data.map((vehicletypes) => ({
        vt_id: vehicletypes.vt_id,
        vehicle_type: vehicletypes.vehicle_type,
      }));

      setVehicleType(vehicletypes);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const getvehicleowener = async () => {
    try {
      const response = await getallVehicleOwener();
      const { data } = response;

      const uniqueOwnerNames = new Set();
      const vehicleowener = [];

      data.forEach((vehicleOwner) => {
        if (!uniqueOwnerNames.has(vehicleOwner.vehical_owner_name)) {
          uniqueOwnerNames.add(vehicleOwner.vehical_owner_name);
          vehicleowener.push({
            id: vehicleOwner.vod_id,
            vehical_owner_name: vehicleOwner.vehical_owner_name,
          });
        }
      });

      setVehicleOwner(vehicleowener);
    } catch (error) {
      console.error("Error fetching vehicle owners:", error);
    }
  };

  useEffect(() => {
    getvehicletypes();
    getvehicleowener();
  }, []);
  const handleAutocompleteChangeVehicleOwner = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      vehicleOwnerName: value ? value.id : "",
    }));
  };

  const handleAutocompleteChangeVehicleType = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      vehicleType: value ? value.vt_id : "",
    }));
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
        <h1>Update Vehicle</h1>
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
            
              <Autocomplete
                id="vehicleOwnerName"
                options={vehicleowner}
                getOptionLabel={(option) => option.vehical_owner_name}
                value={
                  vehicleowner.find(
                    (owner) => owner.id === formData.vehicleOwnerName
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="vehicleOwnerName"
                    variant="outlined"
                    label="Vehicle Owner Name"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={handleAutocompleteChangeVehicleOwner}
              />
            </Grid>
            <Grid item xs={4}>
             
              <Autocomplete
                id="vehicleType"
                options={vehicletype.map((type) => type)}
                getOptionLabel={(option) => option.vehicle_type}
                value={
                  vehicletype.find(
                    (type) => type.vt_id === formData.vehicleType
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="vehicleType"
                    variant="outlined"
                    label="Vehicle Type"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={handleAutocompleteChangeVehicleType}
              />
            </Grid>
            <Grid item xs={4}>
            
              <TextField
                id="vehicleNo"
                name="vehicleNo"
                variant="outlined"
                label="Vehicle No"
                size="small"
                fullWidth
                value={formData.vehicleNo}
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
                id="capacity"
                name="capacity"
                variant="outlined"
                label="Capacity"
                size="small"
                value={formData.capacity}
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
          
              <TextField
                id="make"
                name="make"
                variant="outlined"
                label="Make"
                size="small"
                fullWidth
                value={formData.make}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
          
              <TextField
                id="description"
                name="description"
                variant="outlined"
                label="Description"
                size="small"
                value={formData.description}
                fullWidth
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
                    id="regDate"
                    name="regDate"
                    label="Reg. Date"
                    format="MM-DD-YYYY"
                    value={dayjs(formData.regDate) || null}
                    onChange={(date) => handleDateChange("regDate", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "regDate",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

            <Grid item xs={4}>

              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="expDate"
                    name="expDate"
                    label="Exp. Date"
                    format="MM-DD-YYYY"
                    value={dayjs(formData.expDate) || null}
                    onChange={(date) => handleDateChange("expDate", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "expDate",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
            
              <TextField
                id="engineNo"
                name="engineNo"
                variant="outlined"
                label="Engine No"
                size="small"
                value={formData.engineNo}
                fullWidth
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
                id="chasisNo"
                name="chasisNo"
                variant="outlined"
                label="Chasis No"
                size="small"
                value={formData.chasisNo}
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
            
              <TextField
                id="pucNo"
                name="pucNo"
                variant="outlined"
                label="PUC No"
                size="small"
                value={formData.pucNo}
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
        
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="pucExpDate"
                    name="pucExpDate"
                    label="PUC Exp. Date"
                    format="MM-DD-YYYY"
                    value={dayjs(formData.pucExpDate) || null}
                    onChange={(date) => handleDateChange("pucExpDate", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                        name: "pucExpDate",
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
        
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  labelId="body-label"
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? selected : "Select Body"
                  }
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Close">Close</MenuItem>
                </Select>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
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

export default UpdateVechicle;
