import React, { useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddArtical, AddEmail } from "../../../lib/api-artical";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddCustomeremail = () => {
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({
    email: "",
  });
  const [articleNameError, setArticleNameError] = useState("");
   

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')



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

  const handleSave = async () => {
    if (articleData.email.trim() === "") {
      setArticleNameError("Article Name Is Required");
      return;
    }
    try {
      const response = await AddEmail(articleData);
      const {status,message} = response.data
      if (message.includes("Email ID Already Exist!")) {

        setConfirmmessage(message);
        setConfirmationopen(true);
         setColor('error')
      
      } else if (status == 200) {

        setConfirmmessage(message);
        setConfirmationopen(true);
        setColor('success')
       // Swal.fire({
       //   title: "Success!",
       //   text: message,
       //   icon: "success",
       //   confirmButtonText: "OK",
       // }).then(() => {
         navigate("/CustomerEmail-List");
       //});
      } else {
         setConfirmmessage(message);
         setConfirmationopen(true);
          setColor('error')
          navigate("/CustomerEmail-List");
       
      }
    } catch (error) {
      setConfirmmessage("Error saving article. Please try again.");
      setConfirmationopen(true);
       setColor('error')
      console.error("Error saving article:", error);
    }
  };

  const handleCancel = () => {
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
        <h1>Save Customer Email</h1>
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
                name="email"
                value={articleData.email}
                onChange={handleChange}
                variant="outlined"
                required
                label="Email"
                size="small"
                fullWidth
                error={!!articleNameError}
                helperText={articleNameError}
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
              <Button variant="contained" color="primary" onClick={handleSave} style={{backgroundColor:'#ffa500'}}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="accent"
                onClick={handleCancel}
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

export default AddCustomeremail;
