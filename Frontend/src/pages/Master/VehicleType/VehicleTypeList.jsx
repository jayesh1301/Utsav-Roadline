import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from '@mui/icons-material/Edit'; 
import { useNavigate } from 'react-router-dom';
import { deleteVehicleType, getallvehicletypes } from '../../../lib/api-vehicletype';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Swal from 'sweetalert2';
import CustomSnackbar from '../../../components/common/ui/SnackbarComponent';
//import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";





const ActionsCell = ({id}) => {
  const navigate = useNavigate(); 
  const handleEditClick = () => {
    console.log("Edit button clicked for row with ID:",id);
    navigate(`/update-vehicle-type/${id}`);
  };

  return (
    <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon  />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}>
      Edit
    </Button>
  );
};

const VehicleTypeList = () => {
  const columns = [
    { field: 'srNo', headerName: 'Sr. No', flex: 0.1 },
    { field: 'VehicleType', headerName: 'Vehicle Type', flex: 1 },
    { field: 'TyreQuantity', headerName: 'Tyre Quantity', flex: 1 },
    { field: 'Select', headerName: 'Select', flex: 0.1, sortable: false, renderCell: (params) =>  <CheckboxCell
      id={params.id}
      onChange={handleCheckboxChange}
      checked={params.row.isSelected}
    /> },
    { field: 'Actions', headerName: 'Actions', flex: 0.2, sortable: false, renderCell: (params) => <ActionsCell {...params} /> },
  ];
  
 
const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
  );
};

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')




  const [searchModel, setSearchModel] = useState({
    VehicleType: "",
    TyreQuantity:""
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [pageState, setPageState] = useState({
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  
    const fetchVehicleTypes = async () => {
      setLoading(true);
      try {
        const response = await getallvehicletypes(paginationModel.page,paginationModel.pageSize,searchModel.VehicleType);
        const vehicleType = response.data.vehicleTypes;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const vehicleTypes = vehicleType.map((item, index) => ({
          id: item.vt_id, 
          srNo: startIdx + index + 1,
          VehicleType: item.vehicle_type,
          TyreQuantity: item.tyre_qty,
        }));
        setRows(vehicleTypes);
        setPageState({
          total: total,
        });
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchVehicleTypes();
  }, [paginationModel,searchModel]);

  const handleAddArticles = () => {
    navigate("/new-Vehicle-Type");
  };

  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one Vehicle Type to delete.');
      setConfirmationopen(true);
      setColor('warning')

      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Vehicle Type Selected',
      //   text: 'Please select at least one Vehicle Type to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };
  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };
  
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      VehicleType: value,
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


  const handleConfirmDelete = async () => {
    try {
    
      for (const id of selectedRows) {
         await deleteVehicleType(id);
       
      }
      // Clear the checkbox states and selected rows
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);
      fetchVehicleTypes();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setOpenConfirm(false);
    }
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
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h1>Vehicle Type List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary"  onClick={handleAddArticles} style={{backgroundColor:'#ffa500'}}>
              Add Vehicle Type
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



export default VehicleTypeList;
