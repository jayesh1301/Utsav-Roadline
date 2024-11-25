import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper, Switch, FormControlLabel } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpadteArtical, getArticalbyid } from "../../../lib/api-artical";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";
import { getprofilebyid, UpadteProfile } from "../../../lib/api-profile";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({
    emailid: "",
    address: "",
    isbcc: 0,
  });
  const [articleNameError, setArticleNameError] = useState("");


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')
  const [loading, setLoading] = useState(false);



  const fetchdata = async () => {
    try {
        setLoading(true)
      const response = await getprofilebyid(id);
      const article = response.data[0]; 
      console.log(article);
      if (article) {
        setArticleData(article);
      } else {
        console.log("Article data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }finally{
        setLoading(false)
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchdata();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setArticleData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await UpadteProfile(id, articleData);
     const message = response.data.message;
      setConfirmmessage(message);
      setConfirmationopen(true);
       setColor('success')
    
      
    } catch (error) {
        
        if(error.response.status == 400)
        {
            setConfirmmessage(error.response.data.message);
            setConfirmationopen(true);
             setColor('error')
                  
        }else{

        
      setConfirmmessage('Error updating article. Please try again.');
      setConfirmationopen(true);
       setColor('error')
     
      console.error("Error updating article:", error);
        }
    }finally{
        setLoading(false)
    }
  };
  

  const handalCancel = () => {
    navigate("/Profile");
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
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Update Profile</h1>
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
                name="emailid"
                value={articleData.emailid}
                onChange={handleChange}
                variant="outlined"
                label="Email"
                size="small"
                fullWidth
                error={!!articleNameError}
                helperText={articleNameError}
              />
            </Grid>
            <Grid item xs={5}>
              {/* <TextField
                id="description-input"
                name="address"
                value={articleData.address}
                onChange={handleChange}
                variant="outlined"
                label="Address"
                size="small"
                fullWidth
              /> */}
               <InputLabel sx={{ marginBottom: '-7px',marginTop: '-6px' }}>Bcc</InputLabel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={articleData.isbcc === 1}
                      onChange={handleChange}
                      name="isbcc"
                      
                    />
                  }
                  label={articleData.isbcc === 1 ? "Active" : "Inactive"}
                />
            </Grid>
            <Grid item xs={5} sx={{marginRight:"40%"}}>
            {/* <InputLabel sx={{ marginBottom: '-5px' }}>Bcc</InputLabel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={articleData.isbcc === 1}
                      onChange={handleChange}
                      name="isbcc"
                      
                    />
                  }
                  label={articleData.isbcc === 1 ? "Active" : "Inactive"}
                /> */}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
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

export default UpdateProfile;
