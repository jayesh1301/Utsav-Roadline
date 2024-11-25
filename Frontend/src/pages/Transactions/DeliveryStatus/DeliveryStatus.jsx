import React from "react";
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Paper,
  IconButton,
  Checkbox,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const DeliveryStatus = () => {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/Add-Bill");
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
    { field: 'id', headerName: 'SrNo', flex: 1 },
    { field: 'billNo', headerName: 'LR No', flex: 1 },
    { field: 'date', headerName: 'Branch', flex: 1 },
    { field: 'customer', headerName: 'Booking Branch', flex: 1 },
    { field: 'Consignee', headerName: 'Consignee', flex: 1 },
    { field: 'Pay Type', headerName: 'Pay Type', flex: 1 },
    { field: 'Amount', headerName: 'Amount', flex: 1 },
  ];

  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <Grid container alignItems="center" justifyContent="center" spacing={1}>
      <Grid item xs={4}>
        <InputLabel id="bank-selector-label">Branch:</InputLabel>
        <Select label="Selector" style={{ width: "50%" }} size="small">
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <MenuItem value={3}>Option 3</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={6}>
        <h1>Delivery Update Status</h1>
      </Grid>

      <Grid container item xs={12} alignItems="center" justifyContent="center" spacing={1} sx={{ marginTop: "30px" }}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <InputLabel id="lr-selector-label">Sr. No.</InputLabel>
                <TextField placeholder="Sr. No." fullWidth size="small" />
              </Grid>
              <Grid item xs={6}>
                <InputLabel id="customer-name-label">LR Number</InputLabel>
                <Autocomplete
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="LR Number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <InputLabel id="lr-selector-label">Remark </InputLabel>
                <TextField placeholder="Remark" fullWidth size="small" rows={3} multiline />
              </Grid>
              <Grid container alignItems="center" justifyContent="center" spacing={1} sx={{ marginTop: '10px' }}>
                <Grid item xs={2}>
                  <Button variant="contained" color="primary" size="small" fullWidth>Search</Button>
                </Grid>
                <Grid item xs={2}>
                  <Button variant="contained" color="accent" size="small" fullWidth>Reset</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
         
          <Grid elevation={3} style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
            <h1>Pending LR Details</h1>
            <TextField placeholder="Search" variant="outlined" size="small" />
          </Grid> 
          <Grid container spacing={2} alignItems="center" justifyContent='center' style={{ paddingBottom: "20px" }}>
          <Grid item xs={3}>
                <InputLabel htmlFor="date-picker">From </InputLabel>
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
              <Grid item xs={3}>
                <InputLabel htmlFor="date-picker">To </InputLabel>
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
            <Grid item xs={3}>
              <Button variant="contained" color="accent" size="small">Show Pending</Button>
            </Grid>
          </Grid>
          <DataGrid
            density="compact"
            rows={rows}
            columns={columns}
            pageSize={5}
            autoHeight
            rowsPerPageOptions={[5, 10, 20]}
            onCellClick={(params, event) => {
              if (params.field === 'billNo') {
                handleEdit(params.id);
              }
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DeliveryStatus;
