import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import {
  SelectBranch,
  getAllPlaces,
  getCustomerbyid,
  UpadteCustomer,
} from "../../../lib/api-customer";

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

const UpdateCustomers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
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

  useEffect(() => {
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
    getbranch();

    const fetchPlaceOptions = async () => {
      try {
        const response = await getAllPlaces();

        const places = response.data.map((place) => ({
          place_id: place.place_id,
          place_name: place.place_name,
        }));

        setPlaceOptions(places);
      } catch (error) {
        console.error("Error fetching place options:", error);
      }
    };

    fetchPlaceOptions();
    const fetchCustomerData = async () => {
      try {
        const response = await getCustomerbyid(id);
        console.log(response);
        const customerData = response.data.customer[0];
        const contactData = response.data.contact;
        setFormValues({
          name: customerData.customer_name,
          address: customerData.address,
          telephone: customerData.telephoneno,
          faxNo: customerData.faxno,
          cstNo: customerData.cst,
          gstNo: customerData.gstno,
          state: customerData.state,
          city: customerData.city,
          email: customerData.emailid,
          vendorCode: customerData.vendor_code,
          vatNo: customerData.vatno,
          eccNo: customerData.eccno,
          branch: customerData.branch,
        });
        setContactPersons(contactData  || []);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleContactPersonAdd = (newContactPerson) => {
    const { id, ...contactPersonWithoutId } = newContactPerson;
    setContactPersons([...contactPersons, contactPersonWithoutId]);
  };

  const handleContactPersonUpdate = (updatedContactPerson) => {
    const updatedContactPersons = contactPersons.map((contact) =>
      contact.cpd_id === updatedContactPerson.cpd_id ? updatedContactPerson : contact
    );
    setContactPersons(updatedContactPersons);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleAutocompleteChange = (event, value, name) => {
    if (name === "branch") {
      const selectedBranch = branches.find(
        (branch) => branch.branch_name === value
      );
      const branchId = selectedBranch ? selectedBranch.branch_id : "";

      console.log("Selected branch ID:", branchId); // Log the branch ID
      setFormValues({ ...formValues, [name]: branchId });
    } else {
      console.log("Other field:", value);
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataWithContactPersons = {
        ...formValues,
        contactPersons: contactPersons,
      };
      console.log("FormData with Contact Persons:", formDataWithContactPersons); // Log formDataWithContactPersons
      await UpadteCustomer(id, formDataWithContactPersons);
      navigate("/Customers-List");
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  

  const handleCancel = () => {
    navigate("/Customers-List");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <h1>Update Customer</h1>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-end"
          style={{ marginBottom: "16px" }}
        >
          <Grid item xs={2}>
            <InputLabel htmlFor="branch-input">Branch:</InputLabel>
            <Autocomplete
              freeSolo
              options={branches}
              getOptionLabel={(option) => option.branch_name}
              value={
                branches.find((type) => type.branch_id == formValues.branch) ||
                null
              }
              onChange={(event, value) => {
                console.log("Autocomplete value:", value); // Log the value here
                handleAutocompleteChange(event, value?.branch_name, "branch");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="branch-input"
                  variant="outlined"
                  placeholder="Search"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>
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
                  id="name-input"
                  name="name"
                  variant="outlined"
                  label="Name"
                  size="small"
                  fullWidth
                  value={formValues.name}
                  onChange={handleChange}
                />
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
                />
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
              
                <Autocomplete
                  freeSolo
                  options={states}
                  value={formValues.state}
                  onChange={(event, value) =>
                    handleAutocompleteChange(event, value, "state")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="state-input"
                      name="state"
                      variant="outlined"
                      label="Select State"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                
                <Autocomplete
                  freeSolo
                  options={placeOptions.map((option) => option.place_name)}
                  value={formValues.city}
                  onChange={(event, value) =>
                    handleAutocompleteChange(event, value, "city")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="city-input"
                      name="city"
                      variant="outlined"
                      label="Select City"
                      size="small"
                      fullWidth
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
            <CustomerForm
              onAddContact={handleContactPersonAdd}
              contactPersons={contactPersons}
              onUpdateContact={handleContactPersonUpdate}
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
        </Paper>
      </Grid>
    </form>
  );
};

export default UpdateCustomers;
