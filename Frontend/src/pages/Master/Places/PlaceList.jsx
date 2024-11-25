import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";
import { deletePlace, getAllPlace } from "../../../lib/api-place";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const CheckboxCell = ({ id, onChange, checked }) => {
  return (
    <input type="checkbox" onChange={() => onChange(id)} checked={checked} />
  );
};

const ActionsCell = (params) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    console.log("Edit button clicked for row with ID:", params.id);
    navigate(`/update-place/${params.id}`);
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

const PlaceList = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
  const handleAddPlaces = () => {
    navigate("/new-Places");
  };

    const fetchPlace = async () => {
      setIsLoading(true); 
      try {
        const response = await getAllPlace(
          paginationModel.page,
          paginationModel.pageSize,
          searchModel.place
        );
        const Place = response.data.places;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const rowsWithSrNo = Place.map((Place, index) => ({
          ...Place,
          srNo: startIdx + index + 1,
          id: Place.place_id,
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
        setIsLoading(false); 
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
  const handleDeleteArticles = () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one Place to delete.');
          setConfirmationopen(true);
          setColor('warning')

      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No Place Selected',
      //   text: 'Please select at least one Place to delete.',
      //   confirmButtonText: 'OK'
      // });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      let responce
      // Delete each selected article
      for (const id of selectedRows) {
         responce = await deletePlace(id);
    
        if(responce.data.message[0].message == "Item Is In Use Cannot Be Deleted"){
          setConfirmmessage('Item Is In Use Cannot Be Deleted');
          setConfirmationopen(true);
          setColor('warning')
        }else{
          setConfirmmessage(' Place Deleted Successfully.');
          setConfirmationopen(true);
          setColor('Success')
        }

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
  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 0.7 },
    { field: "place_name", headerName: "Place Name", flex: 7 },
    { field: "place_abbreviation", headerName: "Place Abbreviation", flex: 7 },
    {
      field: "publishedDate",
      headerName: "Select",
      flex: 0.8,
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
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionsCell {...params} />,
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
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <h1>Places List</h1>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPlaces}
              style={{backgroundColor:'#ffa500'}}
            >
              Add Places
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
          <Grid item xs={12} >
          {isLoading ? (
              <LoadingSpinner /> 
            ) : (
            <DataGrid
              rows={rows}
              density="compact"
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
};

export default PlaceList;
