import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import { deleteBranch, getAllBranch } from '../../../lib/api-branch';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import LoadingSpinner from '../../../components/common/ui/LoadingSpinner';
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
      navigate(`/update-Branch/${id}`);
    };
  
    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditOutlinedIcon />}
        onClick={handleEditClick}
        size="small"
        style={{backgroundColor:'#ffa500'}}
      >
        Edit
      </Button>
    );
  };
const BranchesList = () => {



  const handleCheckboxChange = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isSelected: !row.isSelected } : row
      )
    );
  
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRows, id];
      
      console.log('Selected ID:', id); 
      console.log('Selected Rows:', updatedSelectedRows); 
  
      return updatedSelectedRows;
    });
  };
  

  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one Branch to delete.');
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Branch Selected',
      //   text: 'Please select at least one Branch to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };
  const handleConfirmDelete = async () => {
    try {
      // Delete each selected article
      for (const id of selectedRows) {
        await deleteBranch(id);
        console.log(`Branch with ID ${id} deleted successfully.`);
      }
     
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);
      setPaginationModel((prevPaginationModel) => ({
        ...prevPaginationModel,
        page: 0,
      }));
      
      fetchArticles();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setOpenConfirm(false);
    }
  };
  
  const [rows, setRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate(); 
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [pageState, setPageState] = useState({
    total: 0,
  });
  const [searchModel, setSearchModel] = useState({
    branch_code: "",
    branch_abbreviation:"",
    branch_name:"",
    description:"",
    place_name:""
  });

  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoading(true);
      try {
        const response = await getAllBranch(paginationModel.page,paginationModel.pageSize,searchModel.branch_code);
        console.log(response)
        const branchesData = response.data.branches;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const rowsWithSrNo = branchesData.map((row, index) => ({
          id: row.branch_id,
          srNo:startIdx + index + 1,
          branch_code: row.branch_code,
          branch_abbreviation: row.branch_abbreviation,
          branch_name: row.branch_name,
          description: row.description,
          place_name: row.place_name,
        }));
        setRows(rowsWithSrNo);
        setPageState({
          total: total,
        });
      } catch (error) {
        console.error("Error fetching branches data:", error);
      }
      finally {
        setIsLoading(false); 
      }
    };

    fetchBranches();
  }, [paginationModel, searchModel]);

  const handleAddBranches = () => {
    navigate("/new-Branches");
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      branch_code: value,
    }));
  };
  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };
  const columns = [
    { field: 'srNo', headerName: 'Sr. No', flex: 0.3 },
    { field: 'branch_code', headerName: 'Code', flex: 0.4 },
    { field: 'branch_abbreviation', headerName: 'Abbrevations', flex: 2 },
    { field: 'branch_name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'place_name', headerName: 'Place', flex: 1 },
    {
      field: "Select",
      headerName: "Select",
      flex: 0.3,
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
      field: "action",
      headerName: "Actions",
      flex: 0.5,
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
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h1>Branch List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary" onClick={handleAddBranches} style={{backgroundColor:'#ffa500'}}>
              Add Branches
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
              <Button variant="contained" color="accent" onClick={handleDelete}>
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} >
          {isLoading ? (
              <LoadingSpinner /> 
            ) : (
            <DataGrid
              rows={rows}
              density='compact'
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
}

export default BranchesList;
