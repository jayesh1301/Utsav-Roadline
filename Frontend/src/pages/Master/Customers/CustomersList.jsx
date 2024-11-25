import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from "@mui/icons-material/Search";

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import { deleteCustomer, getAllCustomer} from '../../../lib/api-customer';
import LoadingSpinner from '../../../components/common/ui/LoadingSpinner';
import ConfirmationDialog from '../../../components/common/Notification/ConfirmationDialog';
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";


const CustomersList = () => {
  const columns = [
    { field: 'srNo', headerName: 'Sr.No', flex: 0.1 },
    { field: 'customer_name', headerName: 'Name', flex: 3 },
    { field: 'emailid', headerName: 'Email', flex: 4 },
    { field: 'address', headerName: 'Address', flex: 5 },
    { field: 'vendor_code', headerName: 'Vendor Code', flex: 2 },
    { field: 'city', headerName: 'City', flex: 2 },
    { field: 'person_name', headerName: 'Contact Person', flex: 3 },
    { field: 'select', headerName: 'Select', flex: 0.1, sortable: false, renderCell: (params) =>  <CheckboxCell
      id={params.id}
      onChange={handleCheckboxChange}
      checked={params.row.isSelected}
    /> },
    { field: 'views', headerName: 'Actions', flex: 1.1, sortable: false, renderCell: (params) =>  <ActionsCell id={params.id} /> },
  ];
 
  const CheckboxCell = ({ id, onChange, checked }) => {
    return (
      <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
    );
  };
  
  const ActionsCell = ({ id }) => {
    const navigate = useNavigate(); 
    const handleEditClick = () => {
    
      console.log("Edit button clicked for row with ID:",{id});
      navigate(`/update-Customers/${id}`);
    };
  
    return (
      <Button variant="contained" color="primary" startIcon={<EditOutlinedIcon  />} onClick={handleEditClick}  style={{backgroundColor:'#ffa500'}}>
        Edit
      </Button>
    );
  };

  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')




  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [pageState, setPageState] = useState({
    total: 0,
  });
  const [searchModel, setSearchModel] = useState({
    customer_name: "",
    address:""
  });
  const [loading, setLoading] = useState(false);

 
    async function fetchCustomers() {
      setLoading(true);
      try {
        const response = await getAllCustomer(paginationModel.page, paginationModel.pageSize,searchModel.customer_name);

        const data = response.data.Customer;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        if (Array.isArray(data)) {
          const filteredCustomers = data.filter(customer => customer.customer_id !== null);

          const mappedCustomers = filteredCustomers.map((customer, index) => ({
            id: customer.customer_id,
            srNo: startIdx + index + 1,
            customer_name: customer.customer_name,
            address: customer.address || '',
            branch: customer.branch || '',
            city: customer.city || '',
            closingbal: customer.closingbal || '',
            closingbaldate: customer.closingbaldate || '',
            closingbaltype: customer.closingbaltype || '',
            cpd_id: customer.cpd_id || '',
            cst: customer.cst || '',
            designation: customer.designation || '',
            eccno: customer.eccno || '',
            emailid: customer.emailid || '',
            faxno: customer.faxno || '',
            gstno: customer.gstno || '',
            openingbal: customer.openingbal || '',
            openingbaldate: customer.openingbaldate || '',
            openingbaltype: customer.openingbaltype || '',
            person_name: customer.contact_person_details && customer.contact_person_details[0] || '',
            state: customer.state || '',
            status: customer.status || '',
            telephoneno: customer.telephoneno || '',
            vatno: customer.vatno || '',
            vendor_code: customer.vendor_code || '',
          }));

          setCustomers(mappedCustomers);
          setPageState({ total });
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {

    fetchCustomers();
  }, [paginationModel,searchModel]);

  const handleCheckboxChange = (id) => {
    setCustomers((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isSelected: !row.isSelected } : row
      )
    );
  
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRows, id];
      
  
      return updatedSelectedRows;
    });
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };
  

  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one Customer to delete.');
      setConfirmationopen(true);
      setColor('warning');
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Customer Selected',
      //   text: 'Please select at least one Customer to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };

  
  const handleConfirmDelete = async () => {
    try {
      let responce
      // Delete each selected article
      for (const id of selectedRows) {
        responce  = await deleteCustomer(id);
        if(responce.data.message[0].message == "Item Is In Use Cannot Be Deleted"){
          setConfirmmessage('Item Is In Use Cannot Be Deleted');
          setConfirmationopen(true);
          setColor('warning')
        }else{
          setConfirmmessage(' Customer Deleted Successfully.');
          setConfirmationopen(true);
          setColor('Success')
        }
      }
     
      setCustomers((prevRows) =>
        prevRows.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);
      setPaginationModel((prevPaginationModel) => ({
        ...prevPaginationModel,
        page: 0,
      }));
      
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting articles:", error);
    } finally {
      setOpenConfirm(false);
    }
  };
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      customer_name: value,
    }));
  };
  
  const handleAddCustomers = () => {
    navigate("/new-Customers");
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
        <h1>Customer List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button variant="contained" color="primary"  onClick={handleAddCustomers} style={{backgroundColor:'#ffa500'}}>
              Add Customer
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
              rows={customers}
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


export default CustomersList;
