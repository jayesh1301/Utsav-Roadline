import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { deletepetrolpump, getallpetrolpumps } from "../../../lib/api-pertrol-pump";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";



const PetrolPumpList = () => {
 
  const CheckboxCell = ({ id, onChange, checked }) => {
    return (
      <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
    );
  };
  
  const ActionsCell = ({id}) => {
    const navigate = useNavigate();
    const handleEditClick = () => {
      console.log("Edit button clicked for row with ID:",id);
      navigate(`/update-petrol-pump/${id}`);
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
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [pageState, setPageState] = useState({
    total: 0,
  });
  const [searchModel, setSearchModel] = useState({
    petrolPumpName: "",
    ownerName: "",
  });

  const [loading, setLoading] = useState(false); 
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getallpetrolpumps(paginationModel.page,paginationModel.pageSize,  searchModel.petrolPumpName, searchModel.ownerName);
      console.log(response)
      const petroplpump = response.data.petrolpump;
      const total = response.data.total;
      const startIdx = paginationModel.page * paginationModel.pageSize;
       const rowsWithSrNo = petroplpump.map((row, index) => ({
        ...row,
        srNo: startIdx + index + 1,
        id: row.pp_id,
      }));
  
      setRows(rowsWithSrNo);
      setPageState({
        total: total,
      });
    } catch (error) {
      console.error("Error fetching petrol pumps:", error);
    }finally {
      setLoading(false); // Stop loading spinner
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [paginationModel,searchModel]);
  

  const columns = [
    { field: "srNo", headerName: "Sr. No", flex:0.4 },
    { field: "petrol_pump_name", headerName: "Petrol Pump Name", flex: 2 },
    { field: "owner_name", headerName: "Owner", flex: 2 },
    { field: "address", headerName: "Address", flex: 2 },
    { field: "contact_number", headerName: "Contact No", flex: 1 },
    { field: "emailid", headerName: "Email Id", flex: 2 },
    {
      field: "select",
      headerName: "Select",
      flex: 0.4,
      sortable: false,
      renderCell: (params) => <CheckboxCell
      id={params.id}
      onChange={handleCheckboxChange}
      checked={params.row.isSelected}
    />
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      sortable: false,
      renderCell: (params) => <ActionsCell {...params} />,
    },
  ];

  const navigate = useNavigate();
  const handleAddCustomers = () => {
    navigate("/new-pertol-pump");
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      petrolPumpName: value,
    }));
  };

  const handleDelete = async () => {
    console.log("hiiii")
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    }
  };
  const handleCancelDelete = () => {
    setOpenConfirm(false);
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
    for (const id of selectedRows) {
      console.log(id);
      try {
        await deletepetrolpump(id);
        console.log(`Customer with ID ${id} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting customer with ID ${id}:`, error);
      }
    }
    setOpenConfirm(false); 
    setRows((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
    fetchData(); 
  };

  return (
    <>
    {loading && <LoadingSpinner />}
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1>Petrol Pump List</h1>
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
              Add Petrol Pump
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
          <Grid item xs={12} style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              autoHeight
              density="compact"
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
};

export default PetrolPumpList;
