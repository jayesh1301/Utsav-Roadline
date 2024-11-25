import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper, Autocomplete } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SupplierFrom from "./SupplierFrom";
import { gettyresupplierbyid, updatetyresuppliers } from "../../../lib/api-tyresupplier";
import SupplierFromUpdate from "./SupplierFromUpdate";

const UpdateTyreSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Tyre-Supplier-List");
  };
  const [tyresupplierContacts, setTyreSupplierContacts] = useState([]);
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
    ecc: ""
  });
  const fetchdata = async () => {
    try {
      const response = await gettyresupplierbyid(id);
      const vehicleowener = response.data;
      console.log(vehicleowener)
      const contactPersonDataWithIds = vehicleowener.contactPersonData.map((contact, index) => ({
        ...contact,
        id: index + 1,
        ContactPerson: contact.person_name,
        email: contact.emailid,
        phoneNumber:contact.faxno
      }));
      

      setTyreSupplierContacts(contactPersonDataWithIds); // Assuming you only get one article with the provided ID
    
      if (vehicleowener) {
        setFormData({
          supplierName: vehicleowener.Data[0].supplier_name,
          address: vehicleowener.Data[0].address,
          city: vehicleowener.Data[0].city,
          telephone: vehicleowener.Data[0].city,
          email: vehicleowener.Data[0].emailid,
          pan: vehicleowener.Data[0].panno,
          vendorCode: vehicleowener.Data[0].vendor_code,
          vat: vehicleowener.Data[0].vat,
          cst: vehicleowener.Data[0].cst,
          ecc: vehicleowener.Data[0].ecc,
        })
      } else {
        // Handle the case where article data is null or undefined
        console.log("Place data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (id) {
      console.log("hiiii", id);
      fetchdata();
    }
  }, [])
  const handleTyreSupplierContactsChange = (contacts) => {
    setTyreSupplierContacts(contacts);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSave = async () => {
    try {
      const combinedData = {
        ...formData,
        tyresupplierContacts,
      };
      console.log(combinedData)
      const response = await updatetyresuppliers(id,combinedData);
      console.log(response.data.message); 
      navigate("/Tyre-Supplier-List")
    } catch (error) {
      console.error("Error saving article:", error);
      // Handle error
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
        <h1>Update Tyre Supplier</h1>
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
            <Grid item xs={4}>
           
            </Grid>
            <Grid item xs={4}>
           
            </Grid>
           
          </Grid>
          <SupplierFromUpdate
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
              <Button variant="contained" color="primary" onClick={handleSave}>
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

export default UpdateTyreSupplier;
