import React, { useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  InputLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const AddBillDetails = () => {


  const rows = [
    {
      id: 1,
      field1: "Value 1",
      field2: "Value 2",
      field3: "Value 3",
      field4: "Value 4",
      field5: "Value 5",
      field6: "Value 6",
      field7: "Value 7",
      field8: "Value 8",
      field9: "Value 9",
      field10: "Value 10",
    },
    // Add more rows as needed
  ];

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "SN", flex: 1 },
    { field: "Description", headerName: "	Description", flex: 1 },
    { field: "Article", headerName: "Article", flex: 1 },
    { field: "Weight", headerName: "Weight", flex: 1 },
    { field: "GCN No & Date", headerName: "GCN No & Date", flex: 1 },
    { field: "Hamali", headerName: "Hamali", flex: 1 },
    { field: "Amount", headerName: "Amount", flex: 1 },
    { field: "options", headerName: "options", flex: 1 },
  ];

  return (
    <>
      
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Grid elevation={3} style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
        <h1>Bill Details</h1>
        <TextField placeholder="Search" variant="outlined" size="small"/>
      </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={10}>
            <DataGrid
              density="compact"
              rows={rows}
              columns={columns}
              pageSize={5}
              autoHeight
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Grid container spacing={2} justifyContent='center'>
                <h3 >Bill Details</h3>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Freight</InputLabel>
                  <TextField placeholder="Freight" fullWidth size="small"  disabled/>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Hamali</InputLabel>
                  <TextField placeholder="Hamali" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Service_Char</InputLabel>
                  <TextField placeholder="Service_Char" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Del. Char</InputLabel>
                  <TextField placeholder="Del. Char" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Other Char</InputLabel>
                  <TextField placeholder="Other Char" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Demurage</InputLabel>
                  <TextField placeholder="Demurage" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">TDS</InputLabel>
                  <TextField placeholder="TDS" fullWidth size="small" />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Total S.Tax</InputLabel>
                  <TextField placeholder="Total S.Tax" fullWidth size="small"  disabled/>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="field-6-select">Total Amt</InputLabel>
                  <TextField placeholder="Total Amt" fullWidth size="small" disabled />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddBillDetails;
