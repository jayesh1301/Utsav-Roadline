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
import { UpadteBank, getBankbyid } from "../../../lib/api-bank";

const UpdateBank = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handalCancel = () => {
    navigate("/Bank-List");
  };
  const [formData, setFormData] = useState({
    bank_name: "",
    branch_name: "",
    branch_code: "",
    address: "",
    ifsc_code: "",
    micr_code: "",
    telephone: "",
    emailid: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const fetchdata = async () => {
    try {
      const response = await getBankbyid(id);
      const bank = response.data[0]; 
      console.log(bank);
      if (bank) {
        setFormData(bank);
      } else {
        
        console.log("Place data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await UpadteBank(id, formData);
      console.log("Place updated successfully:", response.data);
      navigate("/Bank-List");
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
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Bank Details</h1>
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
                id="bankName"
                name="bank_name"
                variant="outlined"
                label="Bank"
                size="small"
                fullWidth
                value={formData.bank_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5}>
         
              <TextField
                id="branch"
                name="branch_name"
                variant="outlined"
                label="Branch"
                size="small"
                fullWidth
                value={formData.branch_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
       
              <TextField
                id="branchCode"
                name="branch_code"
                variant="outlined"
                label="Branch Code"
                size="small"
                fullWidth
                value={formData.branch_code}
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
                id="ifscCode"
                name="ifsc_code"
                variant="outlined"
                label="IFSC Code"
                size="small"
                fullWidth
                value={formData.ifsc_code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
       
              <TextField
                id="micrCode"
                name="micr_code"
                variant="outlined"
                label="MICR Code"
                size="small"
                fullWidth
                value={formData.micr_code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
     
              <TextField
                id="telephone"
                name="telephone"
                type="number"
                variant="outlined"
                label="Telephone"
                size="small"
                fullWidth
                value={formData.telephone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="email"
                name="emailid"
                type="email"
                variant="outlined"
                label="Email"
                size="small"
                fullWidth
                value={formData.emailid}
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

export default UpdateBank;
