import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper, Autocomplete } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getBranchbyid, getAllPlaces, UpadteBranch } from "../../../lib/api-branch"; // import the updateBranch API
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const UpdateBranches = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [branchData, setBranchData] = useState({
    branch_code: "",
    branch_abbreviation: "",
    branch_name: "",
    description: "",
    place_id: null
  });

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [places, setPlaces] = useState([]);

  const handalCancel = () => {
    navigate("/Branches-List");
  };

  const fetchBranchData = async () => {
    try {
      const response = await getBranchbyid(id);
      const branch = response.data[0]; 
      setBranchData(branch);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await getAllPlaces();
      setPlaces(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await UpadteBranch(id, branchData); 
      navigate("/Branches-List"); 
    } catch (err) {
      if(err.response.status == 400){

        
        setConfirmmessage(err.response.data.message);
        setConfirmationopen(true);
        setColor('warning')
      }else{

        setConfirmmessage('Error saving place. Please try again.');
        setConfirmationopen(true);
        setColor('error')
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBranchData();
      fetchPlaces();
    }
  }, [id]);

  return (
    <>
    <CustomSnackbar
     open={isConfirmationopen}
     message={confirmmessage}
     onClose = {()=> setConfirmationopen(false)}
     color={color}
     />
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Update Branches</h1>
      </Grid>
      <Paper elevation={3} style={{ padding: "16px", width: "100%" }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Grid item xs={5}>
        
              <TextField
                id="title-input"
                variant="outlined"
                label="Code"
                size="small"
                fullWidth
                value={branchData.branch_code}
                onChange={(e) =>
                  setBranchData({ ...branchData, branch_code: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={5}>
       
              <TextField
                id="author-input"
                variant="outlined"
                label="Abbreviation"
                size="small"
                fullWidth
                value={branchData.branch_abbreviation}
                onChange={(e) =>
                  setBranchData({ ...branchData, branch_abbreviation: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
            
              <TextField
                id="name-input"
                variant="outlined"
                label="Name"
                size="small"
                fullWidth
                value={branchData.branch_name}
                onChange={(e) =>
                  setBranchData({ ...branchData, branch_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
   
              <TextField
                id="description-input"
                variant="outlined"
                label="Description"
                size="small"
                fullWidth
                value={branchData.description}
                onChange={(e) =>
                  setBranchData({ ...branchData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
      
              <Autocomplete
                id="place-input"
                options={places}
                getOptionLabel={(option) => option.place_name}
                value={places.find(place => place.place_id === branchData.place_id) || null}
                onChange={(event, newValue) => {
                  setBranchData({ ...branchData, place_id: newValue ? newValue.place_id : null });
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" label="Place" />}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              {" "}
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "16px" }}
          >
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handalCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
    </>
  );
};

export default UpdateBranches;
