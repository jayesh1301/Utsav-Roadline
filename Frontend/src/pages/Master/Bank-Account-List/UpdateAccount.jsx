import React, { useState, useEffect } from "react";
import { Grid, TextField, InputLabel, Button, Paper, Select, MenuItem } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import { UpadteBankAcc, SelectBank, getBankAccbyid } from "../../../lib/api-bank-account-list";

const UpdateAccount = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();

  const [account, setAccount] = useState({
    bank: 'SELECT BANK',
    branchCode: '',
    ifsc: '',
    accountType: 'SELECT ACCOUNT TYPE',
    accountHolderName: '',
    customerId: '',
    accountNumber: '',
    openingBalance: ''
  });
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await SelectBank();
        setBanks(response.data.banklist);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    fetchBanks();

    const fetchAccount = async () => {
      try {
        const response = await getBankAccbyid(id); 
        const accountData = response.data[0]; 
        setAccount({
          bank: accountData.bank_id,
          accountType: accountData.account_type,
          ifsc: accountData.ifsc_code,
          accountHolderName: accountData.account_holder_name,
          customerId: accountData.customer_id,
          accountNumber: accountData.account_number,
          openingBalance: accountData.opening_balance,
   
        });
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    };

    fetchAccount();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccount(prevAccount => ({
      ...prevAccount,
      [name]: value
    }));
  
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

  const UpdateData = async () => {
    try {
      const response = await UpadteBankAcc(id,account);
      if (response.status === 200) {
        navigate("/Bank-Account-List");
      } else {
        console.error('Failed to save account:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleCancel = () => {
    navigate("/Bank-Account-List");
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
>
<MenuItem value="SELECT BANK" disabled>Select Bank*</MenuItem>
  {banks.map((bank) => (
    <MenuItem key={bank.bank_id} value={bank.bank_id}>
      {bank.bank_name}
    </MenuItem>
  ))}
</Select>

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
>
<MenuItem value="SELECT ACCOUNT TYPE" disabled>Select Account Type</MenuItem>
  <MenuItem value="CURRENT ACCOUNT">CURRENT ACCOUNT</MenuItem>
  <MenuItem value="SAVING ACCOUNT">SAVING ACCOUNT</MenuItem>
  <MenuItem value="RECURRING ACCOUNT">RECURRING ACCOUNT</MenuItem>
  <MenuItem value="FIXED DEPOSIT">FIXED DEPOSIT/ACCOUNT</MenuItem>
</Select>

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
              />
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
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
           
              <TextField
                id="opening-balance-input"
                variant="outlined"
                label="Opening Balance"
                size="small"
                fullWidth
                value={account.openingBalance}
                onChange={handleChange}
                name="openingBalance"
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>      </Grid>
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
              <Button variant="contained" color="primary" onClick={UpdateData}>
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
  );
};

export default UpdateAccount;
