import React from "react";
import {
  Grid, Select, MenuItem, InputLabel, TextField, Button, Paper, IconButton, Checkbox,
  Autocomplete, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const PaymentAdviceVehicle = () => {
  const navigate = useNavigate();

  const handleShow = () => {
 
  };

  const handalClose = () => {
    navigate("/home");
  };

  const handleDelete = (id) => {
    console.log(`Delete ${id}`);
  };

  const handleView = (id) => {
    console.log(`View ${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/edit-Bill/${id}`);
  };

  const rows = [
    { id: 1, billNo: '001', date: '2023-01-01', customer: 'John Doe', billAmount: 1000 },
    { id: 2, billNo: '002', date: '2023-01-02', customer: 'Jane Doe', billAmount: 2000 },
  ];
  const columns = [
    { field: 'id', headerName: 'SrNo' },
    { field: 'billNo', headerName: 'T.H.C. No' },
    { field: 'date', headerName: 'Date' },
    { field: 'customer', headerName: 'Description' },
    { field: 'billAmount', headerName: 'Total Amount' },
    { field: 'amountPaid', headerName: 'Remain' },
    { field: 'paid', headerName: 'paid' },
    { field: 'hamali', headerName: 'Hamali' },
    { field: 'OtherCharges', headerName: 'Other Charges' },
    { field: 'paymentMode', headerName: 'Vehicle Number' },
  ];

  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={4}>
        <InputLabel id="bank-selector-label">Branch:</InputLabel>
        <Select label="Selector" style={{ width: "50%" }} size="small">
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <MenuItem value={3}>Option 3</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={6}>
        <h1>Payment Advice Vehicle</h1>
      </Grid>

      <Grid container item xs={12} alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: "30px" }}>
        <Grid item xs={8}>
          <Paper elevation={3} style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <InputLabel id="customer-name-label">Supplier Name</InputLabel>
                <Autocomplete
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Supplier Name"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel id="customer-name-label">Vehicle Number</InputLabel>
                <Autocomplete
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Vehicle Number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={1}>
          <Button variant="contained" color="primary" onClick={handleShow}>Show Bills</Button>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px", marginLeft: '10px' }}>
        <Grid elevation={3} style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
          <h1>Bill Details</h1>
          <TextField placeholder="Search" variant="outlined" size="small" />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={10}>
          <TableContainer component={Paper} className="table-container">
  <Table size="small">
    <TableHead className="table-header">
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.field} className="table-cell">{column.headerName}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id} className="table-row">
          {columns.map((column) => (
            <TableCell key={column.field} className="table-cell">
              {column.field === 'paid' || column.field === 'OtherCharges' || column.field === 'hamali' ? (
                <input
                  type="number"
                  value={row[column.field]}
                  style={{ width: 60 }} 
                />
              ) : (
                row[column.field]
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


          </Grid>
          <Grid item xs={12} md={2}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Grid container spacing={2} justifyContent='center'>
                <h3>Payment Details</h3>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Record No.</InputLabel>
                  <TextField placeholder="Record No." fullWidth size="small" disabled />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="date-picker">Date </InputLabel>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        placeholder="Reg. Date"
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
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Outstanding</InputLabel>
                  <TextField placeholder="Outstanding" fullWidth size="small" disabled />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Paid</InputLabel>
                  <TextField placeholder="Paid" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Hamali</InputLabel>
                  <TextField placeholder="Hamali" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Other Charges</InputLabel>
                  <TextField placeholder="Other Charges" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Pay Mode</InputLabel>
                  <Select
                    labelId="field-6-select-label"
                    id="field-6-select"
                    defaultValue=""
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Bank Name</InputLabel>
                  <Select
                    labelId="field-6-select-label"
                    id="field-6-select"
                    defaultValue=""
                    fullWidth
                    size="small"
                    disabled
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Account No</InputLabel>
                  <Select
                    labelId="field-6-select-label"
                    id="field-6-select"
                    defaultValue=""
                    fullWidth
                    size="small"
                    disabled
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Cheque/RTGS/ Transaction No.</InputLabel>
                  <Select
                    labelId="field-6-select-label"
                    id="field-6-select"
                    defaultValue=""
                    fullWidth
                    size="small"
                    disabled
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Cheque/RTGS/ Transaction Date</InputLabel>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        placeholder="Reg. Date"
                        disabled
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
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Grid
        container
        spacing={2}
        style={{ marginTop: 16 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="accent" onClick={handalClose}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaymentAdviceVehicle;
