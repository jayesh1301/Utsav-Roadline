import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper, Autocomplete, Select, MenuItem, FormControl } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import VechicleFrom from "./VechicleFrom";
import { UpdateVehicleOwener, getVehicleOwenerbyid } from "../../../lib/api-vehicleowner";
import VechicleForm from "./VechicleFrom";
import VechicleFormUpadte from "./VehicleFromUpadte";
const addressOptions = ['Vehicle', 'Garage']; 
const UpdateVehicleOwner = () => {
  const { id } = useParams();
  console.log("iddddddddddddddd",id)
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Vehicle-Owner-List");
  };
  const [vehicleContacts, setVehicleContacts] = useState([
  
  ]);
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
  const [address, setAddress] = useState('');
  const handleVehicleContactsChange = (contacts) => {
    setVehicleContacts(contacts);
  };
  const fetchdata = async () => {
    try {
      const response = await getVehicleOwenerbyid(id);
      const vehicleowener = response.data;
      const contactPersonDataWithIds = vehicleowener.contactPersonData.map((contact, index) => ({
        ...contact,
        id: index + 1,
        ContactPerson: contact.person_name,
        email: contact.emailid,
        phoneNumber:contact.faxno// Include ContactPerson property within the object
      }));
      

      setVehicleContacts(contactPersonDataWithIds); // Assuming you only get one article with the provided ID
    
      if (vehicleowener) {
        setFormData({
          ownerName: vehicleowener.ownerData[0].vehical_owner_name,
          ownerType: vehicleowener.ownerData[0].owner_type,
          address: vehicleowener.ownerData[0].address,
          city: vehicleowener.ownerData[0].city,
          telephone: vehicleowener.ownerData[0].city,
          email: vehicleowener.ownerData[0].emailid,
          pan: vehicleowener.ownerData[0].panno,
          vendorCode: vehicleowener.ownerData[0].vendor_code,
          vat: vehicleowener.ownerData[0].vatnum,
          cst: vehicleowener.ownerData[0].cstnum,
          ecc: vehicleowener.ownerData[0].eccnum,
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
  }, []);
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
  const handleSave = async () => {
    try {
      const combinedData = {
        ...formData,
        vehicleContacts,
      };
      console.log(combinedData)
      const response = await UpdateVehicleOwener(id,combinedData);
      console.log(response.data.message); 
      navigate("/Vehicle-Owner-List")
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
        <h1>Update Vehicle Owner Details</h1>
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
          <VechicleFormUpadte
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

export default UpdateVehicleOwner;
