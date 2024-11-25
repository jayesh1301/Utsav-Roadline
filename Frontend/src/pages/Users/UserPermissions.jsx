import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const UserPermissions = () => {
  const [permissions, setPermissions] = useState({
    article: { view: false, edit: false },
    places: { view: false, edit: false },
    branches: { view: false, edit: false },
    customer: { view: false, edit: false },
    employee: { view: false, edit: false },
    driver: { view: false, edit: false },
    vehicle: { view: false, edit: false },
    vehicleTypes: { view: false, edit: false },
    vehicleOwner: { view: false, edit: false },
    lr: { view: false, edit: false },
    dc: { view: false, edit: false },
    fm: { view: false, edit: false },
    ir: { view: false, edit: false },
    pod: { view: false, edit: false },
    regular: { view: false, edit: false },
    transporter: { view: false, edit: false },
    mis: { view: false, edit: false },
    stock: { view: false, edit: false },
    lrByDate: { view: false, edit: false },
    lrByBranch: { view: false, edit: false },
    lrByCustomer: { view: false, edit: false },
    dcByDate: { view: false, edit: false },
    dcByBranch: { view: false, edit: false },
    dcByVehicle: { view: false, edit: false },
    collectionFM: { view: false, edit: false },
    lineFM: { view: false, edit: false },
    customerEndFM: { view: false, edit: false },
    transporterBillReport: { view: false, edit: false },
  
  });


  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    const [permissionType, permissionAction] = name.split('_');
    setPermissions({
      ...permissions,
      [permissionType]: {
        ...permissions[permissionType],
        [permissionAction]: checked,
      },
    });
  };
  const handleGrantPermissions = () => {
    // Logic to handle granting permissions, e.g., sending data to server
    console.log('Permissions granted:', permissions);
  };

  const handleCancel = () => {
    // Logic to handle canceling changes, e.g., resetting state
    console.log('Changes canceled');
  };

  const [selectedOption, setSelectedOption] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  return (
    <Box sx={{ p: 3 }}  textAlign='center'>
       <Typography variant="h5"  sx={{  cursor: 'pointer', mb: 2 }}>
        Grant Permissions
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} alignItems="center">
   
        <Grid item xs={6}>
        <InputLabel id="select-label">Choose Branch:</InputLabel>
        <FormControl  fullWidth>
     
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
        size='small'
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
            <MenuItem value="option3">Option 3</MenuItem>
          </Select>
          </FormControl>
        </Grid>
 
        <Grid item xs={6}>
        <InputLabel id="select-label">Select User:</InputLabel>
          <Autocomplete
            value={autocompleteValue}
            onChange={(event, newValue) => {
              setAutocompleteValue(newValue);
            }}
            options={['Option A', 'Option B', 'Option C']}
            renderInput={(params) => <TextField {...params} label="Autocomplete" />}
          size='small'
          />
        </Grid>
      </Grid>
   
      <Grid container spacing={2} direction="column">
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>Master</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">View</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">Edit</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Article</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.article.view}
                  onChange={handlePermissionChange}
                  name="article_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.article.edit}
                  onChange={handlePermissionChange}
                  name="article_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Places</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.places.view}
                  onChange={handlePermissionChange}
                  name="places_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.places.edit}
                  onChange={handlePermissionChange}
                  name="places_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Branches</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.branches.view}
                  onChange={handlePermissionChange}
                  name="branches_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.branches.edit}
                  onChange={handlePermissionChange}
                  name="branches_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Customer</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.customer.view}
                  onChange={handlePermissionChange}
                  name="customer_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.customer.edit}
                  onChange={handlePermissionChange}
                  name="customer_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Employee</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.employee.view}
                  onChange={handlePermissionChange}
                  name="employee_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.employee.edit}
                  onChange={handlePermissionChange}
                  name="employee_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Driver</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.driver.view}
                  onChange={handlePermissionChange}
                  name="driver_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.driver.edit}
                  onChange={handlePermissionChange}
                  name="driver_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Vehicle</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.vehicle.view}
                  onChange={handlePermissionChange}
                  name="vehicle_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.vehicle.edit}
                  onChange={handlePermissionChange}
                  name="vehicle_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Vehicle Types</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.vehicleTypes.view}
                  onChange={handlePermissionChange}
                  name="vehicleTypes_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.vehicleTypes.edit}
                  onChange={handlePermissionChange}
                  name="vehicleTypes_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Vehicle Owner</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.vehicleOwner.view}
                  onChange={handlePermissionChange}
                  name="vehicleOwner_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.vehicleOwner.edit}
                  onChange={handlePermissionChange}
                  name="vehicleOwner_edit"
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} direction="column">
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>Transactions</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">View</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">Edit</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">LR</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lr.view}
                  onChange={handlePermissionChange}
                  name="lr_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lr.edit}
                  onChange={handlePermissionChange}
                  name="lr_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">DC</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dc.view}
                  onChange={handlePermissionChange}
                  name="dc_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dc.edit}
                  onChange={handlePermissionChange}
                  name="dc_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">FM</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.fm.view}
                  onChange={handlePermissionChange}
                  name="fm_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.fm.edit}
                  onChange={handlePermissionChange}
                  name="fm_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">IR</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.ir.view}
                  onChange={handlePermissionChange}
                  name="ir_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.ir.edit}
                  onChange={handlePermissionChange}
                  name="ir_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">POD</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.pod.view}
                  onChange={handlePermissionChange}
                  name="pod_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.pod.edit}
                  onChange={handlePermissionChange}
                  name="pod_edit"
                />
              }
            />
          </Grid>
        </Grid>
        {/* Add more Grid items for additional permissions */}
      </Grid>
 
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} direction="column">
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>Bills</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">View</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">Edit</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Regular</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.regular.view}
                  onChange={handlePermissionChange}
                  name="regular_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.regular.edit}
                  onChange={handlePermissionChange}
                  name="regular_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Transporter</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.transporter.view}
                  onChange={handlePermissionChange}
                  name="transporter_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.transporter.edit}
                  onChange={handlePermissionChange}
                  name="transporter_edit"
                />
              }
            />
          </Grid>
        </Grid>
        {/* Add more Grid items for additional permissions */}
      </Grid>
    
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} direction="column">
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>Report</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">View</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1">Edit</Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">MIS</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.mis.view}
                  onChange={handlePermissionChange}
                  name="mis_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.mis.edit}
                  onChange={handlePermissionChange}
                  name="mis_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">STOCK</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.stock.view}
                  onChange={handlePermissionChange}
                  name="stock_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.stock.edit}
                  onChange={handlePermissionChange}
                  name="stock_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">LR By Date</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lrByDate.view}
                  onChange={handlePermissionChange}
                  name="lrByDate_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lrByDate.edit}
                  onChange={handlePermissionChange}
                  name="lrByDate_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">LR By Branch</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lrByBranch.view}
                  onChange={handlePermissionChange}
                  name="lrByBranch_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lrByBranch.edit}
                  onChange={handlePermissionChange}
                  name="lrByBranch_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">LR By Customer</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lrByCustomer.view}
                  onChange={handlePermissionChange}
                  name="lrByCustomer_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lrByCustomer.edit}
                  onChange={handlePermissionChange}
                  name="lrByCustomer_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">DC By Date</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dcByDate.view}
                  onChange={handlePermissionChange}
                  name="dcByDate_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dcByDate.edit}
                  onChange={handlePermissionChange}
                  name="dcByDate_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">DC By Branch</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dcByBranch.view}
                  onChange={handlePermissionChange}
                  name="dcByBranch_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dcByBranch.edit}
                  onChange={handlePermissionChange}
                  name="dcByBranch_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">DC By Vehicle</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dcByVehicle.view}
                  onChange={handlePermissionChange}
                  name="dcByVehicle_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.dcByVehicle.edit}
                  onChange={handlePermissionChange}
                  name="dcByVehicle_edit"
                />
              }
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Collection FM</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.collectionFM.view}
                  onChange={handlePermissionChange}
                  name="collectionFM_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.collectionFM.edit}
                  onChange={handlePermissionChange}
                  name="collectionFM_edit"
                />
              }
            />
          </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">LINE FM</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lineFM.view}
                  onChange={handlePermissionChange}
                  name="lineFM_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.lineFM.edit}
                  onChange={handlePermissionChange}
                  name="lineFM_edit"
                />
              }
            />
          </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Customer End FM</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.customerEndFM.view}
                  onChange={handlePermissionChange}
                  name="customerEndFM_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.customerEndFM.edit}
                  onChange={handlePermissionChange}
                  name="customerEndFM_edit"
                />
              }
            />
          </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="space-between">
          <Grid item xs={4}>
            <Typography variant="body1">Transporter Bill Report:</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.transporterBillReport.view}
                  onChange={handlePermissionChange}
                  name="transporterBillReport_view"
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={permissions.transporterBillReport.edit}
                  onChange={handlePermissionChange}
                  name="transporterBillReport_edit"
                />
              }
            />
          </Grid>
          </Grid>
          
          </Grid>
          <Grid container spacing={2} justifyContent="center" sx={{marginTop:'50px'}}>
        <Grid item xs={3}> 
          <Button variant="contained" size='large' fullWidth color="primary" onClick={handleGrantPermissions} style={{backgroundColor:'#ffa500'}}>
            Grant
          </Button>
        </Grid>
        <Grid item xs={3}> 
          <Button variant="contained" size='large'color='accent' fullWidth onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
    
  );
};

export default UserPermissions;
