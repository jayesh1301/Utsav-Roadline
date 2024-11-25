import React, { useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SupplierFrom from "./SupplierFrom";
import { addtyresupplier } from "../../../lib/api-tyresupplier";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";
const AddTyreSupplier = () => {
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Tyre-Supplier-List");
  };
  const [tyresupplierContacts, setTyreSupplierContacts] = useState([]);
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')
  const [formData, setFormData] = useState({
    supplierName: "",
    address: "",
    city: "",
    telephone: "",
    email: "",
    pan: "",
    vendorCode: "",
    vat: "",
    cst: "",
    ecc: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleTyreSupplierContactsChange = (contacts) => {
    setTyreSupplierContacts(contacts);
  };

  const handleSave = async () => {
    let validationErrors = {};

    if (!formData.supplierName) {
      validationErrors.supplierName = "Supplier Name is required";
    }
    if (!formData.telephone) {
      validationErrors.telephone = "Telephone No is required";
    }
    if (!formData.email) {
      validationErrors.email = "Email ID is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const combinedData = {
          ...formData,
          tyresupplierContacts,
        };
        const response = await addtyresupplier(combinedData);
        console.log(response)
        const message = response.data.message; 
    
        if (message.includes("Customer Added Successfully")) {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('Success')
         
          // Swal.fire({
          //   title: 'Success!',
          //   text: message,
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // }).then(() => {
            navigate("/Vehicle-Owner-List");
          //});
        } else if (message.includes("Customer Already Exists")) {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('error')
         
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
            navigate("/Tyre-Supplier-List");
          //});
        }
      } catch (error) {
        console.error("Error saving driver:", error);
        // Handle error
      }
    }};

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
        <h1>Save Tyre Supplier</h1>
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
                id="supplierName"
                name="supplierName"
                variant="outlined"
                label="Supplier Name"
                size="small"
                fullWidth
                value={formData.supplierName}
                onChange={handleChange}
                error={!!errors.supplierName}
                helperText={errors.supplierName}
              />
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
              />
            </Grid>
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
                id="telephone"
                name="telephone"
                variant="outlined"
                label="Telephone No"
                size="small"
                fullWidth
                value={formData.telephone}
                onChange={handleChange}
                error={!!errors.telephone}
                helperText={errors.telephone}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
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
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
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
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          <SupplierFrom
            tyresuspplierContacts={tyresupplierContacts}
            setTyreSupplierContacts={handleTyreSupplierContactsChange}
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

export default AddTyreSupplier;
