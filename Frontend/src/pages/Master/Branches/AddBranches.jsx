import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPlaces, AddBranch } from "../../../lib/api-branch";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddBranches = () => {
  const navigate = useNavigate();
  const [placeOptions, setPlaceOptions] = useState([]);
  const [articleNameError, setArticleNameError] = useState("");
  const [placeError, setPlaceError] = useState("");


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [nameError, setNameError] = useState("");
  const [branchData, setBranchData] = useState({
    branch_code: "",
    branch_abbreviation: "",
    branch_name: "",
    description: "",
    place: "",
  });

  const handalCancel = () => {
    navigate("/Branches-List");
  };

  const fetchPlaceOptions = async () => {
    try {
      const response = await getAllPlaces();
      setPlaceOptions(response.data);
    } catch (error) {
      console.error("Error fetching place options:", error);
    }
  };

  useEffect(() => {
    fetchPlaceOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchData({
      ...branchData,
      [name]: value,
    });
    if (name === "branch_abbreviation") {
      if (value.trim() === "") {
        setArticleNameError("This Feild is Required");
      } else {
        setArticleNameError("");
      }
    }
    if (name === "branch_name" && value.trim() === "") {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
  };

  const handleSave = async () => {
    // Field validations
    if (branchData.branch_abbreviation.trim() === "") {
      setArticleNameError("This Field Is Required");
      return;
    }
    if (!branchData.place) {
      setPlaceError("Please select a place");
      return;
    } else {
      setPlaceError("");
    }
    if (branchData.branch_name.trim() === "") {
      setNameError("Name is required");
      return;
    } else {
      setNameError("");
    }
  
    try {
      // Make the API call to add the branch
      const response = await AddBranch(branchData);
      const message = response.data.message;
  
      // Display appropriate SweetAlert message based on the response
      if (message == 'Branch Abbreviation Already Exists!') {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
        
        // Swal.fire({
        //   title: 'Success!',
        //   text: message,
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // }).then(() => {
       
        //});
      }else if(message == 'Branch Name Already Exists!'){
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
        
      }else if(message == 'Branch Code Already Exists!'){
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
      }
       else if (response.status == 200) {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('success')
        navigate("/Branches-List");
        // Swal.fire({
        //   title: 'error!',
        //   text: message,
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
      } else {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   text: message,
        //   confirmButtonText: 'OK'
        // }).then(() => {
          navigate("/Branches-List");
        //});
      }
    } catch (error) {
      if(error.response.status == 400){

        
        setConfirmmessage(error.response.data.message);
        setConfirmationopen(true);
        setColor('warning')
      }else{

        setConfirmmessage('Error saving place. Please try again.');
        setConfirmationopen(true);
        setColor('error')
      }

      // Swal.fire({
      //   title: 'Error!',
      //   text: 'Error adding branch. Please try again.',
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // });
      console.error("Error adding branch:", error);
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
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Save Branches</h1>
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
                id="branchCode-input"
                name="branch_code"
                value={branchData.branch_code}
                onChange={handleInputChange}
                variant="outlined"
                label="Code"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="abbreviation-input"
                name="branch_abbreviation"
                value={branchData.branch_abbreviation}
                onChange={handleInputChange}
                variant="outlined"
                label="Abbrevation"
                size="small"
                fullWidth
                error={!!articleNameError}
                helperText={articleNameError}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
    
              <TextField
                id="name-input"
                name="branch_name"
                value={branchData.branch_name}
                onChange={handleInputChange}
                variant="outlined"
                label="Name"
                size="small"
                fullWidth
                error={!!nameError}
                helperText={nameError}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
     
              <TextField
                id="description-input"
                name="description"
                value={branchData.description}
                onChange={handleInputChange}
                variant="outlined"
                label="Description"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <Autocomplete
                id="place-input"
                options={placeOptions}
                getOptionLabel={(option) => option.place_name}
                onChange={(e, value) =>
                  setBranchData({
                    ...branchData,
                    place: value ? value.place_id : "",
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Place" />
                )}
                fullWidth
                
                size="small"
              />
              {placeError && (
                <Typography variant="caption" color="error">
                  {placeError}
                </Typography>
              )}
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
              <Button variant="contained" color="primary" onClick={handleSave}style={{backgroundColor:'#ffa500'}}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="accent"
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

export default AddBranches;
