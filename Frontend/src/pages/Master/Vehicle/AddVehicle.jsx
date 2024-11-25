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
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getallvehicletype, getallvehicletypes } from "../../../lib/api-vehicletype";
import { getallVehicleOwener } from "../../../lib/api-vehicleowner";
import { AddVehicles } from "../../../lib/api-vehicle";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [vehicletype, setVehicleType] = useState([]);
  const [vehicleowner, setVehicleOwner] = useState([]);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const handalCancel = () => {
    navigate("/Vehicle-List");
  };
  const user = useSelector((state) => state.auth);

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

  const [errors, setErrors] = useState({
    vehicleOwnerName: "",
    vehicleNo: "",
  });
  const handleChange = (event) => {
    //console.log(name, value)
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAutocompleteChange = (event, value) => {
    const selectedType = vehicletype.find(
      (type) => type.vehicle_type === value
    );

    if (selectedType) {
      setFormData({
        ...formData,
        vehicleType: selectedType.vt_id,
      });
    } else {
      setFormData({
        ...formData,
        vehicleType: "",
      });
    }
  };
  const handleAutocompleteChangeVehicle = (event, value) => {
    console.log(value);
    const selectedType = vehicleowner.find(
      (type) => type.vehical_owner_name == value.name
    );

    if (selectedType) {
      setFormData({
        ...formData,
        vehicleOwnerName: selectedType.id,
      });
    } else {
      setFormData({
        ...formData,
        vehicleOwnerName: "",
      });
    }
  };
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };
  const getvehicletypes = async () => {
    try {
      const response = await getallvehicletype();
      const { data } = response;
      console.log("data",data);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleOwnerName) {
      newErrors.vehicleOwnerName = "Vehicle Owner Name is required.";
    }
    if (!formData.vehicleNo) {
      newErrors.vehicleNo = "Vehicle No is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    try {
      if (validateForm()) {
        const response = await AddVehicles(formData);
        const message = response.data.message; 
  
        if (message == "Vehicle  Already Exist!") {
     
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
          navigate("/Vehicle-List");
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
            navigate("/Vehicle-List");
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
        <h1>Save Vehicle</h1>
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
                options={
                  vehicleowner
                    ? vehicleowner.map((type) => ({
                        id: type.id,
                        name: type.vehical_owner_name,
                      }))
                    : []
                }
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="vehicleOwnerName"
                    variant="outlined"
                    label="Vehicle Owner Name"
                    size="small"
                    fullWidth
                    error={!!errors.vehicleOwnerName}
                    helperText={errors.vehicleOwnerName}
                  />
                )}
                onChange={(event, value) =>
                  handleAutocompleteChangeVehicle(event, value)
                }
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                id="vehicleType"
                options={
                  vehicletype
                    ? vehicletype.map((type) => type.vehicle_type)
                    : []
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
                onChange={(event, value) =>
                  handleAutocompleteChange(event, value)
                }
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
                error={!!errors.vehicleNo}
                helperText={errors.vehicleNo}
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
                    value={formData.regDate}
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
                    value={formData.expDate}
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
                    value={formData.pucExpDate}
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

export default AddVehicle;
