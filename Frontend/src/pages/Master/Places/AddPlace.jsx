import React, { useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddPlaces } from "../../../lib/api-place";
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddPlace = () => {
  const navigate = useNavigate();

  const handalCancel = () => {
    navigate("/Place-List");
  };
  const [placeData, setPlaceData] = useState({
    place_name: "",
    place_abbreviation: "",
    contact: "",
  });
  const [articleNameError, setArticleNameError] = useState("");
  const [contactError, setContactError] = useState('');


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for contact input and limit to 10 digits
    if (name === 'contact' && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    setPlaceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'place_name') {
      if (value.trim() === '') {
        setArticleNameError('Place name is required');
      } else {
        setArticleNameError('');
      }
    }

    if (name === 'contact') {
      if (value.length !== 10) {
        setContactError('Please enter a valid 10-digit contact number');
      } else {
        setContactError('');
      }
    }
  };
  const handleSave = async () => {
    if (placeData.place_name.trim() === "") {
      setArticleNameError("Place Name Is Required");
      return;
    }
  
    try {
      const response = await AddPlaces(placeData);
      const message = response.data.message;
  console.log(response)
      if (message == "Place  Already Exist!") {

        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   title: 'Success!',
        //   text: message,
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // }).then(() => {
          //navigate("/Place-List");
        //});
      } else if (response.status == 200) {
        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('success')
        navigate("/Place-List");
        // Swal.fire({
        //   title: 'Error!',
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
         // navigate("/Place-List");
        //});
      }
    } catch (error) {
      console.error("Error saving place:", error.response.status);
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
      //   text: 'Error saving place. Please try again.',
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // });
      
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
        <h1>Save Place</h1>
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
                name="place_name"
                label="Place Name"
                value={placeData.place_name}
                onChange={handleChange}
                size="small"
                fullWidth
                error={!!articleNameError}
                helperText={articleNameError}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="author-input"
                variant="outlined"
                name="place_abbreviation"
                label="Place Abbreviation"
                value={placeData.place_abbreviation}
                onChange={handleChange}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
          id="additional-input"
          variant="outlined"
          name="contact"
          label="Contact Number"
          value={placeData.contact}
          onChange={handleChange}
          size="small"
          fullWidth
          error={!!contactError}
          helperText={contactError}
          inputProps={{ maxLength: 10 }}
        />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}></Grid>
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

export default AddPlace;
