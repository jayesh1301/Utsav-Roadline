import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteContactPerson } from "../../../lib/api-customer";

const CustomerForm = ({ onAddContact ,  contactPersons , onUpdateContact }) => {
  
  const columns = [
    { field: "id", headerName: "Sr No", flex: 1 },
    { field: "person_name", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "emailid", headerName: "Email", flex: 1 },
    { field: "faxno", headerName: "Mobile No", flex: 1 },
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
    person_name: "",
    address: "",
    designation: "",
    emailid: "",
    faxno: "",
  });

  const [rows, setRows] = useState([]);

  const [editRowId, setEditRowId] = useState(null);

  useEffect(() => {
    const formattedRows = contactPersons.map((person, index) => ({
      id: index + 1,
      ...person,
    }));
    setRows(formattedRows);
  }, [contactPersons]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    if (editRowId !== null) {
      const updatedRows = rows.map((row) =>
        row.id === editRowId ? { ...row, ...formData } : row
      );
      setRows(updatedRows);
      setEditRowId(null);
      onUpdateContact(formData);
    } else {
      const newRow = {
        id: rows.length + 1,
        ...formData,
      };
      setRows([...rows, newRow]);
      onAddContact(newRow);
    }
    setFormData({
      person_name: "",
      address: "",
      designation: "",
      emailid: "",
      faxno: "",
    });
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditRowId(row.id);
  };

  const handleDelete = (id) => {
    const contactPerson = rows.find((row) => row.id === id);
    if (contactPerson) {
        const cpdId = contactPerson.cpd_id;
        deleteContactPerson(cpdId)
            .then(() => {
                setRows(rows.filter((row) => row.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting contact person:", error);
                // Handle error, show message to user, etc.
            });
    }
};


  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Paper style={{ padding: "20px" }}>
          <h3>Contact Person</h3>
          <form>
            <TextField
              name="person_name"
              value={formData.person_name}
              onChange={handleInputChange}
              label="Contact Person Name"
              variant="outlined"
              fullWidth
              size="small"
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
              name="emailid"
              value={formData.emailid}
              onChange={handleInputChange}
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <TextField
              name="faxno"
              value={formData.faxno}
              onChange={handleInputChange}
              label="Mobile Number"
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAdd}>
              {editRowId !== null ? "Update" : "Add"}
            </Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} density="compact" />
        </div>
      </Grid>
    </Grid>
  );
};

export default CustomerForm;
