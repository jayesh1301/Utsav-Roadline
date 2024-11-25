import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from '@mui/icons-material/Edit'; 
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import { deletetyresupplier, getalltyresupplierss } from '../../../lib/api-tyresupplier';
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getprofile } from '../../../lib/api-profile';



const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
  );
};
const ActionsCell = (params) => {
  const navigate = useNavigate(); 
  const handleEditClick = () => {
  
    console.log("Edit button clicked for row with ID:", params.id);
    navigate(`/UpdateProfile/${params.id}`);
  };

  return (
    <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon  />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}>
      Edit
    </Button>
  );
};

const ProfileList = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 10,
    });
   
    const [pageState, setPageState] = useState({
      total: 0,
    });
    const [searchModel, setSearchModel] = useState({
      tyresupplier: "",
     
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const fetchPlace = async () => {
        setLoading(true);
        try {
          
          const response = await getprofile();
          
          
  const data = response.data
  const rowsWithSrNo = data.map((data, index) => ({
    ...data,
    srNo:  index + 1,
    id: data.id,
  }));

          setRows(rowsWithSrNo);
          
        } catch (error) {
          if (error.name !== 'CanceledError') {
            console.error('Error fetching places:', error);
          }
        }
        finally {
          setLoading(false);
        }
      };
  
      fetchPlace();
    }, []);
  
  
    const handleSearch = (event) => {
      const { value } = event.target;
      setSearchModel((prevModel) => ({
        ...prevModel,
        tyresupplier: value,
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
      }
    };
    const handleConfirmDelete = async () => {
      for (const id of selectedRows) {
        try {
          await deletetyresupplier(id);
          console.log(`Article with ID ${id} deleted successfully.`);
          setOpenConfirm(false)
        } catch (error) {
          console.error(`Error deleting article with ID ${id}:`, error);
        }
      }
      setPaginationModel((prevPaginationModel) => ({
        ...prevPaginationModel,
        page: 0,
      }));
    }
    const handleCancelDelete = () => {
      setOpenConfirm(false);
    };
  const navigate = useNavigate(); 
//   const handleAdd = () => {
 
//     navigate("/new-Supplier");
//   };
  const columns = [
    { field: 'srNo', headerName: 'Sr. No', flex: 0.3 },
    { field: 'emailid', headerName: 'Email', flex: 1 },
    {
        field: 'isbcc',
        headerName: 'Bcc',
        flex: 1,
        renderCell: (params) => (params.value === 1 ? 'Active' : 'Inactive'),
      },
      
   // { field: 'address', headerName: 'Address', flex: 1 },
    
    { field: 'views', headerName: 'Actions', flex: 0.4, sortable: false, renderCell: (params) => <ActionsCell {...params} /> },
  ];
  return (
    <>
    {loading && <LoadingSpinner />}
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h1>Profile List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            {/* <Button variant="contained" color="primary"  onClick={handleAdd} style={{backgroundColor:'#ffa500'}}>
              Add Supplier
            </Button> */}
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end" spacing={2}>
            <Grid item>
            {/* <TextField
  placeholder="Search"
  fullWidth
  size="small"
  InputProps={{
    startAdornment: <SearchIcon style={{ color: "black" }} />,
  }}
  onChange={(event) => {
   
      handleSearch(event);
    
  }}
/> */}
            </Grid>
            <Grid item>
              {/* <Button variant="contained" color="accent" onClick={handleDeleteArticles}>
                Delete
              </Button> */}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ height: 400, width: '100%' ,marginTop:'5%'}}>
          <DataGrid
              rows={rows}
              autoHeight
              density='compact'
              columns={columns}
             // rowCount={pageState.total}
              //paginationMode="server"
              // pageSizeOptions={[paginationModel.pageSize]}
              //paginationModel={paginationModel}
              //onPaginationModelChange={setPaginationModel}
    
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

export default ProfileList;
