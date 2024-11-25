import React from "react";
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Paper,
  FormControl,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const VehiclePayAdviceReport = () => {
  const navigate = useNavigate();

  const rows = [
    {
      id: 1,
      lrNo: "001",
      date: "2023-01-01",
      consigner: "John Doe",
      from: "City A",
      consignee: "Jane Doe",
      to: "City B",
      payMode: "Cash",
      modeGrandTotal: 1000,
      status: "Pending",
    },
    {
      id: 2,
      lrNo: "002",
      date: "2023-01-02",
      consigner: "Alice",
      from: "City C",
      consignee: "Bob",
      to: "City D",
      payMode: "Credit",
      modeGrandTotal: 2000,
      status: "Completed",
    },
  ];

  const columns = [
    { field: "id", headerName: "Record No", flex: 1 },
    { field: "Doc No", headerName: "Doc No", flex: 1 },
    { field: "Date", headerName: "Date", flex: 1 },
    { field: "Supplier Name", headerName: "Supplier Name", flex: 1 },
    { field: "Vehicle No", headerName: "Vehicle No", flex: 1 },
    { field: "Destination", headerName: "Destination", flex: 1 },
    { field: "Challan No", headerName: "Challan No", flex: 1 },
    { field: "Advanced Amount", headerName: "Advanced Amount", flex: 1 },
    { field: "Amount", headerName: "Amount", flex: 1 },
    { field: "Hamali", headerName: "Hamali", flex: 1 },
    { field: "Other Charges", headerName: "Other Charges", flex: 1 },
    { field: "Payment Mode", headerName: "Payment Mode", flex: 1 },
    { field: "Bank Name", headerName: "Bank Name", flex: 1 },
    { field: "Cheque/RTGS/Transaction No", headerName: "Cheque/RTGS/Transaction No", flex: 1 },
    { field: "Cheque/RTGS/Transaction Date", headerName: "Cheque/RTGS/Transaction Date", flex: 1 },
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
        <h1>Vehicle PayAdvice Report</h1>
      </Grid>

      <Grid
        container
        item
        xs={12}
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ marginTop: "30px" }}
      >
        <Grid item xs={6}>
          <Paper
            elevation={3}
            style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
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
                <InputLabel id="customer-name-label">To</InputLabel>
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

              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <Grid item xs={6}>
                  <Typography>Supplier Name</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Select label="Supplier Name" fullWidth size="small">
                      <MenuItem value={1}>Customer 1</MenuItem>
                      <MenuItem value={2}>Customer 2</MenuItem>
                      <MenuItem value={3}>Customer 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Chalan Number</Typography>
                </Grid>
                <Grid item xs={6}>
                <TextField placeholder="Chalan Number" variant="outlined" size="small" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Record Number</Typography>
                </Grid>
                <Grid item xs={6}>
                <TextField placeholder="Record Number" variant="outlined" size="small" fullWidth />
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="accent" fullWidth>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* TextField */}
      <Grid
  container
  item
  xs={12}
  justifyContent="flex-end"
  alignItems="center"
  style={{ marginTop: "20px" }}
>
 
  <Grid item xs={2}>
    <TextField placeholder="Search" variant="outlined" size="small" fullWidth />
  </Grid>
  <Grid item xs={1} style={{ marginLeft: "10px" }}>
    <Button variant="contained" color="accent" >
      Delete
    </Button>
  </Grid>
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
        <Button
          variant="contained"
          color="accent"
          style={{ marginLeft: "5px" }}
        >
          Export To Excel
        </Button>
        <Button
          variant="contained"
          color="accent"
          style={{ marginLeft: "5px" }}
        >
          Export To PDF
        </Button>
      </Grid>
    </Grid>
  );
};

export default VehiclePayAdviceReport;
