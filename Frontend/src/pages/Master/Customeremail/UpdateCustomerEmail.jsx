import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpadteArtical, UpadteEmail, getArticalbyid, getEmailbyid } from "../../../lib/api-artical";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const UpdateCustomeremail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({
    emailid: "",
  });
  const [articleNameError, setArticleNameError] = useState("");


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')




  const fetchdata = async () => {
    try {
      const response = await getEmailbyid(id);
      const Email = response.data[0]; 
      console.log(Email);
      if (Email) {
        setArticleData(Email);
      } else {
        console.log("Email data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchdata();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "articles_name") {
      if (value.trim() === "") {
        setArticleNameError("Article name is required");
      } else {
        setArticleNameError("");
      }
    }

  
   
  };

  const handleUpdate = async () => {
    if (articleData.emailid.trim() === "") {
      setArticleNameError("Email name is required");
      return;
    }
  
    try {
      const response = await UpadteEmail(id, articleData);
      const message = response.data.message;
      setConfirmmessage(message);
      setConfirmationopen(true);
       setColor('success')
        navigate("/CustomerEmail-List");
    } catch (error) {
      setConfirmmessage('Error updating email. Please try again.');
      setConfirmationopen(true);
       setColor('error')
      console.error("Error updating email:", error);
    }
  };
  

  const handalCancel = () => {
    navigate("/CustomerEmail-List");
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
        <h1>Update Customer Emai</h1>
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
                InputLabelProps={{
                  shrink: true, 
                }}
              />
            </Grid>
            {/* <Grid item xs={5}>
              <TextField
                id="description-input"
                name="description"
                value={articleData.description}
                onChange={handleChange}
                variant="outlined"
                label="Description"
                size="small"
                fullWidth
              />
            </Grid> */}
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

export default UpdateCustomeremail;
