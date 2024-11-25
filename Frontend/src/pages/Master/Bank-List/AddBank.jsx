import React, { useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addbank } from "../../../lib/api-bank";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddBank = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bankName: "",
    branch: "",
    branchCode: "",
    address: "",
    ifscCode: "",
    micrCode: "",
    telephone: "",
    email: "",
  });

  const [ifscCodeError, setIfscCodeError] = useState("");
  const [micrCodeError, setMicrCodeError] = useState("");
  const [telephoneError, setTelephoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    switch (name) {
      case "ifscCode":
        if (value.trim() === "") {
          setIfscCodeError("IFSC Code is required");
        } else {
          setIfscCodeError("");
        }
        break;
      case "micrCode":
        if (value.trim() === "") {
          setMicrCodeError("MICR Code is required");
        } else {
          setMicrCodeError("");
        }
        break;
      case "telephone":
        if (!/^\d+$/.test(value)) {
          setTelephoneError("Invalid telephone number");
        } else if (value.length !== 10) {
          setTelephoneError("Telephone number must be 10 digits");
        } else {
          setTelephoneError("");
        }
        break;
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          setEmailError("Invalid email address");
        } else {
          setEmailError("");
        }
        break;
      default:
        break;
    }
  };
  const handleSave = async () => {
    if (formData.ifscCode.trim() === "") {
      setIfscCodeError("IFSC Code is required");
      return;
    }

    if (formData.micrCode.trim() === "") {
      setMicrCodeError("MICR Code is required");
      return;
    }

    if (!/^\d+$/.test(formData.telephone) || formData.telephone.length !== 10) {
      setTelephoneError("Telephone number must be 10 digits");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setEmailError("Invalid email address");
      return;
    }

    try {
      const response = await addbank(formData);
      console.log(response.data.message);

       if(response.data.message == 'Bank  Already Exist!'){
        setConfirmmessage(response.data.message);
        setConfirmationopen(true);
        setColor('error')
      }else if(response.status == 200){
        setConfirmmessage(response.data.message);
        setConfirmationopen(true);
        setColor('success')
        navigate("/Bank-List");
      }
    
    } catch (error) {
      console.error("Error saving bank details:", error);
    }
  };

  const handalCancel = () => {
    navigate("/Bank-List");
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
                id="bankName-input"
                name="bankName"
                variant="outlined"
                label="Bank Name"
                size="small"
                fullWidth
                value={formData.bankName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5}>
         
              <TextField
                id="branch-input"
                name="branch"
                variant="outlined"
                label="Branch"
                size="small"
                fullWidth
                value={formData.branch}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              
              <TextField
                id="branchCode-input"
                name="branchCode"
                variant="outlined"
                label="Branch Code"
                size="small"
                fullWidth
                value={formData.branchCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
             
              <TextField
                id="address-input"
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
                id="ifscCode-input"
                name="ifscCode"
                variant="outlined"
                label="IFSC Code"
                size="small"
                fullWidth
                value={formData.ifscCode}
                onChange={handleChange}
                error={!!ifscCodeError}
                helperText={ifscCodeError}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
       
              <TextField
                id="micrCode-input"
                name="micrCode"
                variant="outlined"
                label="MICR Code"
                size="small"
                fullWidth
                value={formData.micrCode}
                onChange={handleChange}
                error={!!micrCodeError}
                helperText={micrCodeError}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
         
              <TextField
                id="telephone-input"
                name="telephone"
                type="tel"
                variant="outlined"
                label="Telephone"
                size="small"
                fullWidth
                value={formData.telephone}
                onChange={handleChange}
                error={!!telephoneError}
                helperText={telephoneError}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
         
              <TextField
                id="email-input"
                name="email"
                type="email"
                variant="outlined"
                label="Email"
                size="small"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
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

export default AddBank;
