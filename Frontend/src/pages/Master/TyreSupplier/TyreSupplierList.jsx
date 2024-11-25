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



const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
  );
};
const ActionsCell = (params) => {
  const navigate = useNavigate(); 
  const handleEditClick = () => {
  
    console.log("Edit button clicked for row with ID:", params.id);
    navigate(`/update-Supplier/${params.id}`);
  };

  return (
    <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon  />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}>
      Edit
    </Button>
  );
};

const TyreSupplierList = () => {
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
          
          const response = await getalltyresupplierss(paginationModel.page, paginationModel.pageSize,searchModel.tyresupplier);
          const tyresupplier = response.data.tyresupplier
          
          const total = response.data.total; 
          const startIdx = paginationModel.page * paginationModel.pageSize;
          const rowsWithSrNo = tyresupplier.map((tyresupplier, index) => ({
            ...tyresupplier,
            srNo:startIdx + index + 1,
            id: tyresupplier.tsd_id,
          }));
  
          setRows(rowsWithSrNo);
          
          setPageState({
            total: total,
           
          });
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
    }, [paginationModel,searchModel]);
  
  
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
  const handleAdd = () => {
 
    navigate("/new-Supplier");
  };
  const columns = [
    { field: 'srNo', headerName: 'Sr. No', flex: 0.3 },
    { field: 'supplier_name', headerName: 'Supplier Name', flex: 1 },
    { field: 'address', headerName: 'Supplier Address', flex: 1 },
    { field: 'telephoneno', headerName: 'Telephone No', flex: 1 },
    { field: 'emailid', headerName: 'Email Id', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    {
      field: "publishedDate",
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
    { field: 'views', headerName: 'Actions', flex: 0.3, sortable: false, renderCell: (params) => <ActionsCell {...params} /> },
  ];
  return (
    <>
    {loading && <LoadingSpinner />}
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <h1>Tyre Supplier List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary"  onClick={handleAdd} style={{backgroundColor:'#ffa500'}}>
              Add Supplier
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
              <Button variant="contained" color="accent" onClick={handleDeleteArticles}>
                Delete
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ height: 400, width: '100%' }}>
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

export default TyreSupplierList;
