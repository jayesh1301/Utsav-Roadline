import React, { useState, useEffect } from "react";
import { TextField, Grid, Paper, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const VechicleFormUpadte = ({ vehicleContacts, setVehicleContacts }) => {
  console.log(vehicleContacts)
  const columns = [
    { field: "id", headerName: "SrNo", flex: 1 },
    { field: "ContactPerson", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Mobile No", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <strong>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </strong>
      ),
    },
  ];

  const [formData, setFormData] = useState({
    ContactPerson: "",
    address: "",
    email: "",
    phoneNumber: "",
    designation: ""
  });

  const [editRowId, setEditRowId] = useState(null);

  useEffect(() => {
    setVehicleContacts(vehicleContacts);
  }, [vehicleContacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
  if (editRowId !== null) {
    const updatedContacts = vehicleContacts.map((contact) =>
      contact.id === editRowId ? { ...contact, ...formData } : contact
    );
    setVehicleContacts(updatedContacts);
    setEditRowId(null);
  } else {
    const newContact = {
      id: vehicleContacts.length > 0 ? Math.max(...vehicleContacts.map(contact => contact.id)) + 1 : 1,
      ...formData,
    };
    setVehicleContacts([...vehicleContacts, newContact]);
  }
  setFormData({
    ContactPerson: "",
    address: "",
    email: "",
    phoneNumber: "",
    designation: ""
  });
};


  const handleEdit = (contact) => {
    setFormData(contact);
    setEditRowId(contact.id);
  };

  const handleDelete = (id) => {
    setVehicleContacts(vehicleContacts.filter((contact) => contact.id !== id));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Paper style={{ padding: "20px" }}>
          <h3>Contact Person</h3>
          <form>
            <TextField
              name="ContactPerson"
              value={formData.ContactPerson}
              onChange={handleInputChange}
              label="Contact person name"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <TextField
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              label="Address"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <TextField
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              label="Designation"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <TextField
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <TextField
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              label="Mobile Number"
              variant="outlined"
              inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              fullWidth
              size="small"
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              style={{ marginTop: "16px",backgroundColor:'#ffa500'  }}
            >
              {editRowId !== null ? "Update" : "Add"}
            </Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={vehicleContacts} columns={columns} pageSize={5} density="compact" />
        </div>
      </Grid>
    </Grid>
  );
};

export default VechicleFormUpadte;
