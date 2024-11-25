// src/components/CustomeremailList.js
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";
import { getArtical, deleteArtical, getEmail, deleteEmail } from "../../../lib/api-artical";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
  );
};

const ActionsCell = ({ id }) => {
  const navigate = useNavigate();
  const handleEditClick = () => {
    console.log("Edit button clicked for row with ID:", id);
    navigate(`/Update-CustomerEmail/${id}`);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<EditOutlinedIcon/>}
      onClick={handleEditClick}
      size="small"
      style={{backgroundColor:'#ffa500'}}
      
    >
      Edit
    </Button>
  );
};

const CustomeremailList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [openConfirm, setOpenConfirm] = useState(false);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [pageState, setPageState] = useState({
    total: 0,
  });
  const [searchModel, setSearchModel] = useState({
    email: ""
  });
 
    const fetchArticles = async () => {
      setIsLoading(true); 
      try {
        const response = await getEmail(
          paginationModel.page,
          paginationModel.pageSize,
          searchModel.email
        );
        console.log(response);
        const email = response.data.email;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const rowsWithSrNo = email.map((email, index) => ({
          ...email,
          srNo: startIdx + index + 1,
          id: email.id,
          isSelected: false,
        }));
        setRows(rowsWithSrNo);
        setPageState({
          total: total,
        });
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching articles:", error);
        }
      } finally {
        setIsLoading(false); 
      }
    };
    useEffect(() => {
    fetchArticles();
  }, [paginationModel, searchModel]);

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

  const handleAddArticles = () => {
    navigate("/Add-CustomerEmail");
  };

  const handleDeleteArticles = () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one article to delete.');
      setConfirmationopen(true);
       setColor('warning')

      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Articles Selected',
      //   text: 'Please select at least one article to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };
  

  const handleConfirmDelete = async () => {
    try {
      // Delete each selected article
      for (const id of selectedRows) {
        await deleteEmail(id);
        console.log(`Email with ID ${id} deleted successfully.`);
      }
      // Clear the checkbox states and selected rows
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);
      // Reset pagination to the first page
      setPaginationModel((prevPaginationModel) => ({
        ...prevPaginationModel,
        page: 0,
      }));
      // Fetch the updated list of articles
      fetchArticles();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setOpenConfirm(false);
    }
  };
  

  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      email: value,
    }));
  };

  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 0.2 },
    { field: "emailid", headerName: "Email", flex: 2 },
    //{ field: "description", headerName: "Description", flex: 2 },
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
      flex: 0.3,
      sortable: false,
      renderCell: (params) => <ActionsCell id={params.id} />,
    },
  ];

  return (
    <>
    <CustomSnackbar
      open={isConfirmationopen}
      message={confirmmessage}
      onClose = {()=> setConfirmationopen(false)}
      color={color}
      />
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1>Customer Email List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddArticles}
              style={{backgroundColor:'#ffa500'}}

            >
              Add Customer Email
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
          <Grid item xs={12}>
            {isLoading ? (
              <LoadingSpinner /> 
            ) : (
              <DataGrid
                rows={rows}
                density="compact"
                columns={columns}
                rowCount={pageState.total}
                paginationMode="server"
                pageSizeOptions={[paginationModel.pageSize]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            )}
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

export default CustomeremailList;
