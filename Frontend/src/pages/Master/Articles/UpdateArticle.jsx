import React, { useEffect, useState } from "react";
import { Grid, TextField, InputLabel, Button, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpadteArtical, getArticalbyid } from "../../../lib/api-artical";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const UpdateArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({
    articles_name: "",
    description: "",
  });
  const [articleNameError, setArticleNameError] = useState("");


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')




  const fetchdata = async () => {
    try {
      const response = await getArticalbyid(id);
      const article = response.data[0]; 
      console.log(article);
      if (article) {
        setArticleData(article);
      } else {
        console.log("Article data is null or undefined");
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
    if (articleData.articles_name.trim() === "") {
      setArticleNameError("Article name is required");
      return;
    }
  
    try {
      const response = await UpadteArtical(id, articleData);
      const message = response.data.message;
      setConfirmmessage(message);
      setConfirmationopen(true);
       setColor('success')
      // Swal.fire({
      //   title: 'Success!',
      //   text: message,
      //   icon: 'success',
      //   confirmButtonText: 'OK'
      // }).then(() => {
        navigate("/Articles-List");
      //});
    } catch (error) {
      setConfirmmessage('Error updating article. Please try again.');
      setConfirmationopen(true);
       setColor('error')
      // Swal.fire({
      //   title: 'Error!',
      //   text: 'Error updating article. Please try again.',
      //   icon: 'error',
      //   confirmButtonText: 'OK'
      // });
      console.error("Error updating article:", error);
    }
  };
  

  const handalCancel = () => {
    navigate("/Articles-List");
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
        <h1>Update Article</h1>
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
                name="articles_name"
                value={articleData.articles_name}
                onChange={handleChange}
                variant="outlined"
                label="Article Name"
                size="small"
                fullWidth
                error={!!articleNameError}
                helperText={articleNameError}
              />
            </Grid>
            <Grid item xs={5}>
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

export default UpdateArticle;
