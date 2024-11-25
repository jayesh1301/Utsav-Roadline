import React from "react";
import { Grid, Select, MenuItem, InputLabel, TextField, Button, Paper, IconButton, Checkbox, Autocomplete, FormControl } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const NotBilledLRStatus = () => {
  const navigate = useNavigate();


  const rows = [
    { id: 1, lrNo: '001', date: '2023-01-01', consigner: 'John Doe', from: 'City A', consignee: 'Jane Doe', to: 'City B', payMode: 'Cash', modeGrandTotal: 1000, status: 'Pending' },
    { id: 2, lrNo: '002', date: '2023-01-02', consigner: 'Alice', from: 'City C', consignee: 'Bob', to: 'City D', payMode: 'Credit', modeGrandTotal: 2000, status: 'Completed' },
  ];

  const columns = [
    { field: 'id', headerName: 'SrNo', flex: 1 },
    { field: 'Consign No', headerName: 'Consign No', flex: 1 },
    { field: 'Date', headerName: 'Date', flex: 1 },
    { field: 'Consigner Name', headerName: 'Consigner Name', flex: 1 },
    { field: 'Consignee Name', headerName: 'Consignee Name', flex: 1 },
    { field: 'Amount', headerName: 'Amount', flex: 1 },
    { field: 'Memo No.', headerName: 'Memo No.', flex: 1 },
  ];


  
  return (
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={6}>
        <InputLabel id="bank-selector-label">Branch:</InputLabel>
        <Select label="Selector" style={{ width: "30%" }} size="small">
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <MenuItem value={3}>Option 3</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={6}>
        <h1>Not Billed Lorry Receipt Status</h1>
      </Grid>

      <Grid container item xs={12} alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: "30px" }}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}>
            <Grid container spacing={2} alignItems="center">     <Grid item xs={6}>
                <InputLabel id="lr-selector-label">From</InputLabel>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      placeholder="DOB"
                      format="MMM-DD-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          name: "dob",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <InputLabel id="lr-selector-label">To</InputLabel>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      placeholder="DOB"
                      format="MMM-DD-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          name: "dob",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <InputLabel id="customer-name-label">Customer Name</InputLabel>
                <Autocomplete
                  freeSolo
                  options={[]} // Provide your options array here
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Customer Name"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" fullWidth color="accent">Search</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* TextField */}
      <Grid item xs={12} style={{ marginTop: "20px", textAlign: "right" }}>
        <TextField placeholder="Search" variant="outlined" size="small" />
      </Grid>

      {/* DataGrid */}
      <Grid item xs={12}>
        <DataGrid
          density="compact"
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}  
        />
      </Grid>

      {/* Buttons */}
      <Grid container item xs={12} justifyContent="flex-start">
        <Button variant="contained" color="accent" style={{marginLeft:'5px'}} >Export To Excell</Button>
        <Button variant="contained" color="accent" style={{marginLeft:'5px'}}>Export To PDF</Button>
      </Grid>
    </Grid>
  );
};

export default NotBilledLRStatus;
