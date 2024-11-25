import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from '@mui/icons-material/Edit'; 
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import { deletedriver, getAllDriver } from '../../../lib/api-driver';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";



const DriversList = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
const [isloading,setIsloading]=useState(false)
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 20,
    });
   
    const [pageState, setPageState] = useState({
      total: 0,
    });
    const [searchModel, setSearchModel] = useState({
      Driver: "",
     
    });
  
      const fetchPlace = async () => {
        try {
          setIsloading(true)
          const response = await getAllDriver(paginationModel.page, paginationModel.pageSize,searchModel.Driver);
          const Driver = response.data.driver; 
          console.log(Driver)
          const total = response.data.total; 
          const startIdx = paginationModel.page * paginationModel.pageSize;
          const rowsWithSrNo = Driver.map((Driver, index) => ({
            ...Driver,
            srNo:startIdx + index + 1,
            id: Driver.driver_id,
          }));
  
          setRows(rowsWithSrNo);
          
          setPageState({
            total: total,
           
          });

        } catch (error) {
          if (error.name !== 'CanceledError') {
            console.error('Error fetching places:', error);
          }
        }finally{
          setIsloading(false)
        }
      };
      useEffect(() => {
      fetchPlace();
    }, [paginationModel,searchModel]);
    const handleSearch = (event) => {
      const { value } = event.target;
      setSearchModel((prevModel) => ({
        ...prevModel,
        Driver: value,
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
        setConfirmmessage('Please select at least one Driver to delete.');
        setConfirmationopen(true);
        setColor('warning')

        // Swal.fire({
        //   icon: 'warning',
        //   title: 'No Driver Selected',
        //   text: 'Please select at least one Driver to delete.',
        //   confirmButtonText: 'OK'
        // });
      }
    };
  

    const handleConfirmDelete = async () => {
      try {
        // Delete each selected article
        for (const id of selectedRows) {
          await deletedriver(id);
          console.log(`Article with ID ${id} deleted successfully.`);
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

const licenseTypeFormatter = (params) => {
  switch (params.value) {
    case "0":
      return "Higher-Heavy";
    case "1":
      return "Heavy";
    case "2":
      return "Non-Heavy";
    case "3":
      return "Normal";
    default:
      return "";
  }
};
    const columns = [
        { field: 'srNo', headerName: 'Sr. No', flex: 0.1 },
        { field: 'driver_name', headerName: 'Name', flex: 2 },
        { field: 'date_of_birth', headerName: 'DOB', flex: 1 },
        { field: 'mobileno', headerName: 'Telephone', flex: 2 },
        { field: 'licenseno', headerName: 'License', flex: 1.3 },
        { 
          field: 'license_type', 
          headerName: 'License Type', 
          flex: 1, 
          valueFormatter: licenseTypeFormatter 
        },
        { field: 'qualification', headerName: 'Qualifications', flex: 2 },
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
        { field: 'views', headerName: 'Actions', flex: 0.6, sortable: false, renderCell: (params) => <ActionsCell {...params} /> },
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
          navigate(`/update-Driver/${params.id}`);
        };
      
        return (
          <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon  />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}>
            Edit
          </Button>
        );
      };
   
  const handleAddCustomers = () => {
 
    navigate("/new-Drivers");
  };
  
  return (
    <>
     {isloading && <LoadingSpinner />}
    <CustomSnackbar
     open={isConfirmationopen}
     message={confirmmessage}
     onClose = {()=> setConfirmationopen(false)}
     color={color}
     />
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h1>Driver List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary"  onClick={handleAddCustomers} style={{backgroundColor:'#ffa500'}}>
              Add Driver
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
              <Button variant="contained" color="accent"  onClick={handleDeleteArticles}>
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} >
          <DataGrid
              rows={rows}
              autoHeight
              density='compact'
              columns={columns}
              rowCount={pageState.total}
              paginationMode="server"
              pageSizeOptions={[paginationModel.pageSize]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
    
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
}

export default DriversList;
