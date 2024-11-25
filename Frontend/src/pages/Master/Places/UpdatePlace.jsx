import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpadtePlace, getPlacebyid } from "../../../lib/api-place";
import Swal from 'sweetalert2';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const UpdatePlace = () => {
  const { id } = useParams();
  const [placeData, setPlaceData] = useState({
    place_name: "",
    place_abbreviation: "",
    contact: ""
  });
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [articleNameError, setArticleNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Place-List");
  };
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

    if (name === "place_name") {
      if (value.trim() === "") {
        setArticleNameError("Place name is required");
      } else {
        setArticleNameError("");
      }
    }

    if (name === "contact") {
      if (value.length !== 10) {
        setContactError("Please enter a valid 10-digit contact number");
      } else {
        setContactError("");
      }
    }
  };
  const fetchdata = async () => {
    try {
      const response = await getPlacebyid(id);
      const place = response.data[0]; 
      console.log(place);
      if (place) {
        setPlaceData(place);
      } else {
 
        console.log("Place data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    if (placeData.place_name.trim() === "") {
      setArticleNameError("Place name is required");
      return;
    }
  
    try {
      const response = await UpadtePlace(id, placeData);
      const message = response.data.message;
  
      if (message.includes("Place Updated Successfully")) {
        Swal.fire({
          title: 'Success!',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate("/Place-List");
        });
      } else {
        Swal.fire({
          text: message,  
          confirmButtonText: 'OK'
        }).then(() => {
          navigate("/Place-List");
        });
      }
    } catch (error) {
      console.error("Error saving place:", error.response.data.message);
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
      //   text: 'Error updating place. Please try again.',
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // }).then(() => {
      //   navigate("/Place-List");
      // });
      // console.error("Error updating place:", error);

    }
  };
  

  useEffect(() => {
    if (id) {
      console.log("hiiii", id);
      fetchdata();
    }
  }, []);
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
        <h1>Update Place</h1>
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
                label="Place Name"
                name="place_name"
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
                value={placeData.place_abbreviation}
                onChange={handleChange}
                label="Place Abbreviation"
                size="small"
                fullWidth
              />


            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="additional-input"
                variant="outlined"
                name="contact"
                value={placeData.contact}
                onChange={handleChange}
                label="Contact Number"
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

export default UpdatePlace;
