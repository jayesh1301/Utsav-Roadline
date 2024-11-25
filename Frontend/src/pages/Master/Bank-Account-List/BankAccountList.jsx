import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { deletebankacc, getAllBanksAcc } from '../../../lib/api-bank-account-list';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";


const BankAccountList = () => {
  
const columns = [
  { field: 'srNo', headerName: 'Sr. No', flex: 0.3 },
  { field: 'account_number', headerName: 'Account No', flex: 1 },
  { field: 'customer_id', headerName: 'Customer Id', flex: 1 },
  { field: 'account_type', headerName: 'Account Type', flex: 1 },
  { field: 'account_holder_name', headerName: 'A/c Holder Name', flex: 2 },
  { field: 'opening_balance', headerName: 'Opening Balance', flex: 1 },
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
  { field: 'actions', headerName: 'Actions',flex: 0.4, sortable: false, renderCell: (params) => <ActionsCell {...params} /> },
];

const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
  );
};


const ActionsCell = ({ id }) => {
  const navigate = useNavigate(); 
  const handleEditClick = () => {
    console.log("Edit button clicked for row with ID:", { id });
    navigate(`/Update-Bank-Account/${id}`);
  };

  return (
    <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}>
      Edit
    </Button>
  );
};

  const [rows, setRows] = useState([]);
  const navigate = useNavigate(); 
  const [selectedRows, setSelectedRows] = useState([]);
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
    account_number: "",
    account_holder_name:""
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllBanksAcc(paginationModel.page,
          paginationModel.pageSize,
          searchModel.account_holder_name);
        console.log(response)
        const data = response.data.BankAcc
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const rowsWithSrNo = data.map((BankAcc, index) => ({
          ...BankAcc,
          srNo: startIdx + index + 1,
          
          isSelected: false,
        }));
        setRows(rowsWithSrNo);
        setPageState({
          total: total,
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    
    fetchData();
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
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one Bank Account to delete.');
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Bank Account Selected',
      //   text: 'Please select at least one Bank Account to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };
  const handleConfirmDelete = async () => {
    try {
      // Delete each selected article
      for (const id of selectedRows) {
        await deletebankacc(id);
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

  const handleAddBank = () => {
    navigate("/new-Bank-Account");
  };
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      account_holder_name: value,
    }));
  };
  
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
        <h1>Bank Accounts</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' , backgroundColor:'#ffa500'}} onClick={handleAddBank} >
              Add Account
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
              <Button variant="contained" color="accent"   onClick={handleDelete}>
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

export default BankAccountList;
