import React, { useState, useEffect } from "react";
import { TextField, Grid, Paper, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SupplierFromUpdate = ({ tyresuspplierContacts, setTyreSupplierContacts }) => {
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
    setTyreSupplierContacts(tyresuspplierContacts);
  }, [tyresuspplierContacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdd = () => {
    if (editRowId !== null) {
      const updatedContacts = tyresuspplierContacts.map((contact) =>
        contact.id === editRowId ? { ...contact, ...formData } : contact
      );
      setTyreSupplierContacts(updatedContacts);
      setEditRowId(null);
    } else {
      const newContact = {
        id: tyresuspplierContacts.length > 0 ? Math.max(...tyresuspplierContacts.map(contact => contact.id)) + 1 : 1,
        ...formData,
      };
      setTyreSupplierContacts([...tyresuspplierContacts, newContact]);
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
    setTyreSupplierContacts(tyresuspplierContacts.filter((contact) => contact.id !== id));
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
              label="Fax/Mob Number"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              style={{ marginTop: "16px" }}
            >
              {editRowId !== null ? "Update" : "Add"}
            </Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={tyresuspplierContacts} columns={columns} pageSize={5} density="compact" />
        </div>
      </Grid>
    </Grid>
  );
};

export default SupplierFromUpdate;
