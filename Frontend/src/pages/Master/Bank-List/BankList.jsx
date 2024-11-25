import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { deletebank, getAllBanks } from '../../../lib/api-bank';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LoadingSpinner from '../../../components/common/ui/LoadingSpinner';
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked || false} />
  );
};

const ActionsCell = (params) => {
  const navigate = useNavigate();
  const handleEditClick = () => {
    console.log("Edit button clicked for row with ID:", params.id);
    navigate(`/update-bank/${params.id}`);
  };

  return (
    <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}> 
      Edit
    </Button>
  );
};

const BankList = () => {
  const navigate = useNavigate();
  const handleAddBank = () => {
    navigate("/new-Bank");
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);


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
    place: "",
  });
  const [loading, setLoading] = useState(true); 

  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };
  const formatAddress = (address) => {
    if (!address) return '';
    const words = address.split(' ');
    let formattedAddress = '';
    for (let i = 0; i < words.length; i += 2) {
      formattedAddress += words.slice(i, i + 2).join(' ') + '\n';
    }
    return formattedAddress;
  };
  

  const columns = [
    { field: 'srNo', headerName: 'Sr. No', flex: 0.5 },
    { field: 'bank_name', headerName: 'Bank Name', flex: 2.1 },
    { field: 'branch_name', headerName: 'Branch Name', flex: 1.6 },
    { field: 'branch_code', headerName: 'Branch Code', flex: 1.1 },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.4,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' ,textAlign: 'center'}}>
          {formatAddress(params.value)}
        </div>
      ),
    },
    { field: 'ifsc_code', headerName: 'IFSC', flex: 1.5 },
    { field: 'micr_code', headerName: 'MICR', flex: 1.5 },
    { field: 'telephone', headerName: 'Telephone', flex: 1.3 },
    { field: 'emailid', headerName: 'Email', flex: 3.1},
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
    { field: 'views', headerName: 'Actions', flex: 0.9, sortable: false, renderCell: (params) => <ActionsCell {...params} /> },
  ];

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
      setConfirmmessage('Please select at least one Bank Data to delete.');
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Bank Data Selected',
      //   text: 'Please select at least one Bank Data to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Delete each selected article
      for (const id of selectedRows) {
        await deletebank(id);
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
      
      fetchPlace();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setOpenConfirm(false);
    }
  };
  


    const fetchPlace = async () => {
      try {
        setLoading(true);
        const response = await getAllBanks(paginationModel.page, paginationModel.pageSize, searchModel.place);
        const banklist = response.data.banklist;
        console.log(banklist);
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const rowsWithSrNo = banklist.map((banklist, index) => ({
          ...banklist,
          srNo: startIdx + index + 1,
          id: banklist.bank_id,
        }));

        setRows(rowsWithSrNo);

        setPageState({
          total: total,
        });
        setLoading(false);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error('Error fetching places:', error);
        }
      }
    };
    useEffect(() => {
    fetchPlace();
  }, [paginationModel, searchModel]);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      place: value,
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
        <h1>Bank List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary"  onClick={handleAddBank} style={{backgroundColor:'#ffa500'}}>
              Add Bank
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
          <Grid item xs={12}>
            {loading ? ( 
              <LoadingSpinner />
            ) : (
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

export default BankList;
