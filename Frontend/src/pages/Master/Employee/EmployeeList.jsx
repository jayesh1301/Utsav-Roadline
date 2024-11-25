import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { deleteemployee, getallEmployees } from "../../../lib/api-employee";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const EmployeeList = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [searchModel, setSearchModel] = useState({
    employee: "",
  });
  const [loading, setLoading] = useState(false); 
  const fetchPlace = async () => {
    setLoading(true);
    try {
      const response = await getallEmployees(searchModel.employee);
      const employee = response.data.employee;

      const rowsWithSrNo = employee.map((employee, index) => ({
        ...employee,
        srNo: index + 1,
        id: employee.emp_id,
      }));

      setRows(rowsWithSrNo);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching places:", error);
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    fetchPlace();
  }, [searchModel]);
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      employee: value,
    }));
  };
  const handleCheckboxChange = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isSelected: !row.isSelected } : row
      )
    );

    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRows, id]
    );
  };
  const handleDeleteArticles = async () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {

      setConfirmmessage('Please select at least one Employee to delete.');
          setConfirmationopen(true);
          setColor('warning')

      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Employee Selected',
      //   text: 'Please select at least one Employee to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };
  const handleConfirmDelete = async () => {
    try {
      // Delete each selected article
      for (const id of selectedRows) {
        await deleteemployee(id);
        console.log(`Article with ID ${id} deleted successfully.`);
      }
      // Clear the checkbox states and selected rows
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);
      fetchPlace();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setOpenConfirm(false);
    }
  };
  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };

  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 0.1 },
    { field: "employee_name", headerName: "Employee Name", flex: 2 },
    { field: "designation", headerName: "Designation", flex: 2 },
    { field: "emailid", headerName: "Email ID", flex: 2.2 },
    { field: "joining_date", headerName: "Joining Date", flex: 2 },
    { field: "mobileno", headerName: "Mobile No.", flex: 2 },
    {
      field: "publishedDate",
      headerName: "Select",
      flex: 0.2,
      sortable: false,
      renderCell: (params) => (
        <CheckboxCell
          id={params.id}
          onChange={handleCheckboxChange}
          checked={params.row.isSelected}
        />
      ),
    },
    {
      field: "views",
      headerName: "Actions",
      flex: 0.7,
      sortable: false,
      renderCell: (params) => <ActionsCell {...params} />,
    },
  ];

  const CheckboxCell = ({ id, onChange, checked }) => {
    return (
      <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
    );
  };

  const ActionsCell = (params) => {
    const navigate = useNavigate();
    const handleEditClick = () => {
      console.log("Edit button clicked for row with ID:", params.id);
      navigate(`/update-Employee/${params.id}`);
    };

    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditOutlinedIcon />}
        onClick={handleEditClick}
        style={{backgroundColor:'#ffa500'}}
      >
        Edit
      </Button>
    );
  };
  const navigate = useNavigate();
  const handleAddCustomers = () => {
    navigate("/new-Employees");
  };

  return (
    <>
     
    <CustomSnackbar
     open={isConfirmationopen}
     message={confirmmessage}
     onClose = {()=> setConfirmationopen(false)}
     color={color}
     />
    {loading && <LoadingSpinner />}
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1>Employee List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
            
              onClick={handleAddCustomers}
              style={{backgroundColor:'#ffa500'}}
            >
              Add Employee
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end" spacing={2}>
            <Grid item>
              <TextField
                placeholder="Search"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon style={{ color: "black" }} />,
                }}
                onChange={(event) => {
                  handleSearch(event);
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="accent"
                onClick={handleDeleteArticles}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <DataGrid
              rows={rows}
              autoHeight
              density="compact"
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Grid>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={openConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        messages={["Are you sure?", "You won't be able to revert this!"]}
      />
    </Grid>
    </>
  );
};

export default EmployeeList;
