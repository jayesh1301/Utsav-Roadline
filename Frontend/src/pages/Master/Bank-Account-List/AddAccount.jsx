import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddBankacc, SelectBank } from "../../../lib/api-bank-account-list";
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddAccount = () => {
  const navigate = useNavigate();

  const [account, setAccount] = useState({
    bank: "SELECT BANK",
    branchCode: "",
    ifsc: "",
    accountType: "SELECT ACCOUNT TYPE",
    accountHolderName: "",
    customerId: "",
    accountNumber: "",
    openingBalance: "",
  });

  const [banks, setBanks] = useState([]);
  const [bankError, setBankError] = useState("");
  const [accountTypeError, setAccountTypeError] = useState("");

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [accountHolderNameError, setAccountHolderNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await SelectBank();
        setBanks(response.data.banklist);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));

    // Clear previous errors
    switch (name) {
      case "bank":
        setBankError("");
        break;
      case "accountType":
        setAccountTypeError("");
        break;
      case "accountHolderName":
        setAccountHolderNameError("");
        break;
      case "accountNumber":
        setAccountNumberError("");
        break;
      default:
        break;
    }
      
    if (name === 'bank') {
      const bankDetails = banks.find(bank => bank.bank_id === parseInt(value));
      if (bankDetails) {
        setAccount(prevAccount => ({
          ...prevAccount,
          ifsc: bankDetails.ifsc_code
        }));
      } else {
        setAccount(prevAccount => ({
          ...prevAccount,
          ifsc: ''
        }));
      }
    }
  };

  const handleSave = async () => {
    // Validate Bank selection
    if (!account.bank || account.bank === "SELECT BANK") {
      setBankError("Select a bank");
      return;
    } else {
      setBankError("");
    }

    // Validate Account Type
    if (!account.accountType || account.accountType === "SELECT ACCOUNT TYPE") {
      setAccountTypeError("Select an account type");
      return;
    } else {
      setAccountTypeError("");
    }

    // Validate Account Holder Name
    if (!account.accountHolderName.trim()) {
      setAccountHolderNameError("Account holder name is required");
      return;
    } else {
      setAccountHolderNameError("");
    }

    // Validate Account Number
    if (!account.accountNumber.trim()) {
      setAccountNumberError("Account number is required");
      return;
    } else {
      setAccountNumberError("");
    }

    try {
      const response = await AddBankacc(account);
      const message = response.data.message;

      // Display appropriate SweetAlert message based on the response
      if (message == "Bank Account Already Exist!") {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   title: 'Success!',
        //   text: message,
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // }).then(() => {
          
        // });
      } else if (response.status == 200) {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('success')
        navigate("/Bank-Account-List");
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
          navigate("/Bank-Account-List");
        //});
      }
    } catch (error) {
      setConfirmmessage('Error adding customer. Please try again.');
        setConfirmationopen(true);
        setColor('error')
      // Swal.fire({
      //   title: 'Error!',
      //   text: 'Error adding customer. Please try again.',
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // });
      console.error("Error adding customer:", error);
    }
  };

  const handleCancel = () => {
    navigate("/Bank-Account-List");
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
        <h1>Add Account</h1>
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
              <Select
                labelId="bank-selector-label"
                id="bank-selector"
                name="bank"
                value={account.bank}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                size="small"
                error={!!bankError}
              >
                <MenuItem value="SELECT BANK" disabled>Select Bank*</MenuItem>
                {banks.map((bank) => (
                  <MenuItem key={bank.bank_id} value={bank.bank_id}>
                    {bank.bank_name}
                  </MenuItem>
                ))}
              </Select>
              {bankError && (
                <Typography variant="caption" color="error">
                  {bankError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5}>
             
              <TextField
                id="ifsc-input"
                variant="outlined"
                label="IFSC"
                size="small"
                fullWidth
                disabled
                value={account.ifsc}
                onChange={handleChange}
                name="ifsc"
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <Select
                labelId="account-type-selector-label"
                id="account-type-selector"
                name="accountType"
                value={account.accountType}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                size="small"
                error={!!accountTypeError}
              >
                <MenuItem value="SELECT ACCOUNT TYPE" disabled>Select Account Type</MenuItem>
                <MenuItem value="CURRENT ACCOUNT">CURRENT ACCOUNT</MenuItem>
                <MenuItem value="SAVING ACCOUNT">SAVING ACCOUNT</MenuItem>
                <MenuItem value="RECURRING ACCOUNT">
                  RECURRING ACCOUNT
                </MenuItem>
                <MenuItem value="FIXED DEPOSIT">FIXED DEPOSIT/ACCOUNT</MenuItem>
              </Select>
              {accountTypeError && (
                <Typography variant="caption" color="error">
                  {accountTypeError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="account-holder-name-input"
                variant="outlined"
                label="Account Holder Name"
                size="small"
                fullWidth
                value={account.accountHolderName}
                onChange={handleChange}
                name="accountHolderName"
                error={!!accountHolderNameError}
              />
              {accountHolderNameError && (
                <Typography variant="caption" color="error">
                  {accountHolderNameError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="customer-id-input"
                variant="outlined"
                label="Customer ID"
                size="small"
                fullWidth
                value={account.customerId}
                onChange={handleChange}
                name="customerId"
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="account-number-input"
                variant="outlined"
                label="Account Number"
                size="small"
                fullWidth
                value={account.accountNumber}
                onChange={handleChange}
                name="accountNumber"
                error={!!accountNumberError}
              />
              {accountNumberError && (
                <Typography variant="caption" color="error">
                  {accountNumberError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
             
              <TextField
                id="opening-balance-input"
                variant="outlined"
                label="Opening Balance"
                size="small"
                fullWidth
                    type="number"
                value={account.openingBalance}
                onChange={handleChange}
                name="openingBalance"
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>  </Grid>
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
                onClick={handleCancel}
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

export default AddAccount;
