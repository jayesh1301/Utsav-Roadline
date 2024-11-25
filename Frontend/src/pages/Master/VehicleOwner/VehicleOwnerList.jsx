import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import {
  deletevehicleowner,
  getallVehicleOwener,
  getallVehicleOweners,
} from "../../../lib/api-vehicleowner";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const VehicleOwnerList = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  
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
    vehicleowner: "",
  });

  const [loading, setLoading] = useState(false);

    const fetchPlace = async () => {
      setLoading(true);
      try {
        const response = await getallVehicleOweners(
          paginationModel.page,
          paginationModel.pageSize,
          searchModel.vehicleowner
        );
        const vehicleowner = response.data.vehicleowener;

        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const rowsWithSrNo = vehicleowner.map((vehicleowner, index) => ({
          ...vehicleowner,
          srNo: startIdx + index + 1,
          id: vehicleowner.vod_id,
        }));

        setRows(rowsWithSrNo);

        setPageState({
          total: total,
        });
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching places:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchPlace();
  }, [paginationModel, searchModel]);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      vehicleowner: value,
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
      Swal.fire({
        icon: 'warning',
        title: 'No Vehicle Owner Selected',
        text: 'Please select at least one Vehicle Owner to delete.',
        confirmButtonText: 'OK'
      });
    }
  };
  const handleConfirmDelete = async () => {
    try {
      let responce 
      // Delete each selected article
      for (const id of selectedRows) {
        responce = await deletevehicleowner(id);
      
        if(responce.data.message == "Item Is In Use Cannot Be Deleted"){
          setConfirmmessage('Item Is In Use Cannot Be Deleted');
          setConfirmationopen(true);
          setColor('warning')
        }else{
          setConfirmmessage(' Vehicle Owner Deleted Successfully.');
          setConfirmationopen(true);
          setColor('Success')
        }
      }
      // Clear the checkbox states and selected rows
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);
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
  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 0.3 },
    { field: "vehical_owner_name", headerName: "Vehicle Owner Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "emailid", headerName: "EmailID", flex: 1 },
    { field: "telephoneno", headerName: "Contact No", flex: 1 },
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
    {
      field: "views",
      headerName: "Actions",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => <ActionsCell {...params} />,
    },
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
      navigate(`/update-Vehicle-Owner/${params.id}`);
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
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/new-AddVehivleOwner");
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
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h1>Vehicle Owner List</h1>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
        
                onClick={handleAdd}
                style={{backgroundColor:'#ffa500'}}
              >
                Add Vehicle Owner
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

export default VehicleOwnerList;
