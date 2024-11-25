import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { AddCustomer, SelectBranch, getAllPlaces } from "../../../lib/api-customer";
import AddCustomerForm from "./AddCustomerForm";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Chandigarh(UT)",
  "Dadra And Nagar Haveli(UT)",
  "Daman And Diu",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep(UT)",
  "Delhi",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry(UT)",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];



const AddCustomers = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [formValues, setFormValues] = useState({
    branch: "",
    name: "",
    address: "",
    telephone: "",
    faxNo: "",
    cstNo: "",
    gstNo: "",
    state: "",
    city: "",
    email: "",
    vendorCode: "",
    vatNo: "",
    eccNo: "",
  });
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [gstNoError, setGstNoError] = useState("");
  const [stateError, setStateError] = useState("");

  const getbranch = async () => {
    try {
      const response = await SelectBranch();
      const { data } = response;

      const branchList = data.map((branch) => ({
        branch_id: branch.branch_id,
        branch_name: branch.branch_name,
      }));

      setBranches(branchList);

  
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };


  const fetchPlaceOptions = async () => {
    try {
      const response = await getAllPlaces();
      console.log(response);
      setPlaceOptions(response.data);
    } catch (error) {
      console.error("Error fetching place options:", error);
    }
  };

  useEffect(() => {
    getbranch();
    fetchPlaceOptions();
  }, []);

  const handleContactPersonAdd = (newContactPerson) => {
  
    const { id, ...contactPersonWithoutId } = newContactPerson;

    setContactPersons([...contactPersons, contactPersonWithoutId]);
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    // Allow only numeric values for telephone input and limit to 10 digits
    if (name === "telephone" && !/^\d{0,10}$/.test(value)) {
      return;
    }
  
    setFormValues({ ...formValues, [name]: value });
  
    // Clear previous errors
    switch (name) {
      case "name":
        setNameError("");
        break;
      case "address":
        setAddressError("");
        break;
      case "gstNo":
        setGstNoError("");
        break;
      case "state":
        setStateError("");
        break;
      case "telephone":
        setTelephoneError("");
        break;
      default:
        break;
    }
  };
  
  const handleAutocompleteChange = (event, value, name) => {
    if (name === 'branch') {
    
      const selectedBranch = branches.find(branch => branch.branch_name === value);
    
      const branchId = selectedBranch ? selectedBranch.branch_id : '';
      setFormValues({ ...formValues, [name]: branchId });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    let valid = true;
    
    if (!formValues.name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError(""); // Clear error if valid
    }
    
    if (!formValues.address.trim()) {
      setAddressError("Address is required");
      valid = false;
    } else {
      setAddressError(""); // Clear error if valid
    }
    
    if (!formValues.gstNo.trim()) {
      setGstNoError("GST No. is required");
      valid = false;
    } else {
      setGstNoError(""); // Clear error if valid
    }
    
    if (!formValues.state.trim()) {
      setStateError("Select State is required");
      valid = false;
    } else {
      setStateError(""); // Clear error if valid
    }
  
    if (!valid) {
      // If validation fails, show a warning and stop form submission
      setConfirmmessage('Please fill out all required fields.');
      setConfirmationopen(true);
      setColor('warning')

      // Swal.fire({
      //   title: 'Validation Error',
      //   text: 'Please fill out all required fields.',
      //   icon: 'warning',
      //   confirmButtonText: 'OK'
      // });
      return;
    }
    
    try {
      const formDataWithContactPersons = {
        ...formValues,
        contactPersons: contactPersons
      };
  
      // Make the API call to add the customer
      const response = await AddCustomer(formDataWithContactPersons);
      const message = response.data.message;
 
    // Display appropriate SweetAlert message based on the response
    if (message == "Customer  Already Exist!") {
      setConfirmmessage(message);
      setConfirmationopen(true);
      setColor('error');
      // Swal.fire({
      //   title: 'Success!',
      //   text: message,
      //   icon: 'success',
      //   confirmButtonText: 'OK'
      // }).then(() => {
      //   navigate("/Customers-List");
      // });
    } else if (response.status == 200) {

      setConfirmmessage(message);
      setConfirmationopen(true);
      setColor('success');
      navigate("/Customers-List");
      // Swal.fire({
      //   title: 'Error!',
      //   text: message,
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // });
    } else {
      setConfirmmessage(message);
      setConfirmationopen(true);
      setColor('error');

      // Swal.fire({
      //   text: message,
      //   confirmButtonText: 'OK'
      // }).then(() => {
        //navigate("/Customers-List");
      //});
    }
  } catch (error) {
    setConfirmmessage('Error adding customer. Please try again.');
    setConfirmationopen(true);
    setColor('error');

    // Swal.fire({
    //   title: 'Error!',
    //   text: 'Error adding customer. Please try again.',
    //   icon: 'error',
    //   confirmButtonText: 'OK'
    // });
    console.error("Error adding customer:", error);
  }
};;
  

  const handalCancel = () => {
    navigate("/Customers-List");
  };

  return (
    <>
    <CustomSnackbar
     open={isConfirmationopen}
     message={confirmmessage}
     onClose = {()=> setConfirmationopen(false)}
     color={color}
     />
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
    
      >
        <Grid item>
          <h1>Save Customers</h1>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-end"
          style={{ marginBottom: "5px" }}
        >
          <Grid item xs={2}>
  
            <Autocomplete
              freeSolo
              options={branches}
              getOptionLabel={(option) => option.branch_name}
              onChange={(event, value) => handleAutocompleteChange(event, value?.branch_name, 'branch')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="branch-input"
                  variant="outlined"
                  label="Branch"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
        <Paper elevation={3} style={{ padding: "10px", width: "100%" }}>
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
                  id="name-input"
                  name="name"
                  variant="outlined"
                  label="Name"
                  size="small"
                  fullWidth
                  value={formValues.name}
                  onChange={handleChange}
                  error={!!nameError}
                />
                   {nameError && (
                  <Typography variant="caption" color="error">
                    {nameError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={4}>
               
                <TextField
                  id="address-input"
                  name="address"
                  variant="outlined"
                  label="Address"
                  size="small"
                  fullWidth
                  value={formValues.address}
                  onChange={handleChange}
                  error={!!addressError}
                  />
                  {addressError && (
                    <Typography variant="caption" color="error">
                      {addressError}
                    </Typography>
                  )}
              </Grid>
              <Grid item xs={4}>
            
                <TextField
                  id="telephone-input"
                  name="telephone"
                  variant="outlined"
                  label="Telephone"
                  size="small"
                  fullWidth
                  value={formValues.telephone}
                  onChange={handleChange}
                  inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
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
                  id="faxNo-input"
                  name="faxNo"
                  variant="outlined"
                  label="Fax No"
                  size="small"
                  fullWidth
                  value={formValues.faxNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
               
                <TextField
                  id="cstNo-input"
                  name="cstNo"
                  variant="outlined"
                  label="CST No."
                  size="small"
                  fullWidth
                  value={formValues.cstNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
           
                <TextField
                  id="gstNo-input"
                  name="gstNo"
                  variant="outlined"
                  label="GST No."
                  size="small"
                  fullWidth
                  value={formValues.gstNo}
                  onChange={handleChange}
                  error={!!gstNoError}
                  />
                  {gstNoError && (
                    <Typography variant="caption" color="error">
                      {gstNoError}
                    </Typography>
                  )}
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
                <Autocomplete

                  options={states}
                  onChange={(event, value) => handleAutocompleteChange(event, value, 'state')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="state-input"
                      name="state"
                      variant="outlined"
                      label="Select State"
                      size="small"
                      fullWidth
                      value={formValues.state}
                      error={!!stateError}
                    />
                  )}
                />
                  {stateError && (
                  <Typography variant="caption" color="error">
                    {stateError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={4}>
               
                <Autocomplete
                  options={placeOptions}
                  getOptionLabel={(option) => option.place_name}
                  onChange={(event, value) => handleAutocompleteChange(event, value?.place_name, 'city')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="city-input"
                      name="city"
                      variant="outlined"
                      label="Select City"
                      size="small"
                      fullWidth
                      value={formValues.city}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
             
                <TextField
                  id="email-input"
                  name="email"
                  variant="outlined"
                  label="Email"
                  size="small"
                  fullWidth
                  value={formValues.email}
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
                  id="vendorCode-input"
                  name="vendorCode"
                  variant="outlined"
                  label="Vendor Code"
                  size="small"
                  fullWidth
                  value={formValues.vendorCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
            
                <TextField
                  id="vatNo-input"
                  name="vatNo"
                  variant="outlined"
                  label="VAT No"
                  size="small"
                  fullWidth
                  value={formValues.vatNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
          
                <TextField
                  id="eccNo-input"
                  name="eccNo"
                  variant="outlined"
                  label="ECC No"
                  size="small"
                  fullWidth
                  value={formValues.eccNo}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <AddCustomerForm onAddContact={handleContactPersonAdd} />
            <Grid
              item
              container
              direction="row"
              spacing={2}
              justifyContent="center"
              style={{ marginTop: "16px" }}
            >
              <Grid item>
                <Button type="submit" variant="contained" color="primary" style={{backgroundColor:'#ffa500'}}>
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
    </form>
    </>
  );
};

export default AddCustomers;

