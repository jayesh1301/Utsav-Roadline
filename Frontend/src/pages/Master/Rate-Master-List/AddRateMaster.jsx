import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllCustomers, getAllPlaces } from "../../../lib/api-customer";
import { getArticals } from "../../../lib/api-artical";
import { AddRateMasters } from "../../../lib/api-ratemaster";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const AddRateMaster = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [place, setPlace] = useState([]);
  const [article, setArticle] = useState([]);

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const handalCancel = () => {
    navigate("/Rate-Master-List");
  };
  const user = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    customer: "",
    article: "",
    fromStation: "",
    toStation: "",
    rate: "",
    userid: user.id,
    branch: user.branch,
    record_date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const getcustomer = async () => {
    try {
      const response = await getAllCustomers();
      const { data } = response;

      const customers = data
        .filter(
          (customer) =>
            customer.customer_id != null && customer.customer_name != null
        )
        .map((customer) => ({
          customer_id: customer.customer_id,
          customer_name: customer.customer_name,
        }));

      setCustomer(customers);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const getarticle = async () => {
    try {
      const response = await getArticals();
      const { data } = response;
      const uniqueArticleNames = new Set();
      const articles = [];

      data.forEach((article) => {
        if (
          article.articles_id != null &&
          article.articles_name != null &&
          !uniqueArticleNames.has(article.articles_name)
        ) {
          uniqueArticleNames.add(article.articles_name);
          articles.push({
            articles_id: article.articles_id,
            articles_name: article.articles_name,
          });
        }
      });

      setArticle(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const getplace = async () => {
    try {
      const response = await getAllPlaces();
      const { data } = response;
      const uniquePlaceNames = new Set();
      const places = [];

      data.forEach((place) => {
        if (
          place.place_id != null &&
          place.place_name != null &&
          !uniquePlaceNames.has(place.place_name)
        ) {
          uniquePlaceNames.add(place.place_name);
          places.push({
            place_id: place.place_id,
            place_name: place.place_name,
          });
        }
      });

      setPlace(places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    getcustomer();
    getarticle();
    getplace();
  }, []);
  const handleAutocompleteChange = (event, value) => {
    const selectedType = customer.find((type) => type.customer_name === value);

    if (selectedType) {
      setFormData({
        ...formData,
        customer: selectedType.customer_id,
      });
    } else {
      setFormData({
        ...formData,
        customer: "",
      });
    }
  };
  const handleAutocompleteArticleChange = (event, value) => {
    const selectedType = article.find(
      (type) => type.articles_name === value.articles_name
    );

    if (selectedType) {
      setFormData({
        ...formData,
        article: selectedType.articles_id,
      });
    } else {
      setFormData({
        ...formData,
        article: "",
      });
    }
  };
  const handleAutocompletefromStationChange = (event, value) => {
    console.log(value);
    const selectedType = place.find(
      (type) => type.place_name === value.place_name
    );

    if (selectedType) {
      setFormData({
        ...formData,
        fromStation: selectedType.place_id,
      });
    } else {
      setFormData({
        ...formData,
        fromStation: "",
      });
    }
  };
  const handleAutocompletetoStationChange = (event, value) => {
    const selectedType = place.find(
      (type) => type.place_name === value.place_name
    );

    if (selectedType) {
      setFormData({
        ...formData,
        toStation: selectedType.place_id,
      });
    } else {
      setFormData({
        ...formData,
        toStation: "",
      });
    }
  };
  const handleSave = async () => {
    let validationErrors = {};

    if (!formData.customer) {
      validationErrors.customer = "Customer is required";
    }
    if (!formData.article) {
      validationErrors.article = "Article is required";
    }
    if (!formData.rate) {
      validationErrors.rate = "Rate is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await AddRateMasters(formData);
        const message = response.data.message; // Ensure you extract the message from the response
  
        if (message.includes("Customer Added Successfully")) {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('success')

          // Swal.fire({
          //   title: 'Success!',
          //   text: message,
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // }).then(() => {
            navigate("/Rate-Master-List");
          //});
        } else if (message.includes("Customer Already Exists")) {
          setConfirmmessage(message);
          setConfirmationopen(true);
          setColor('error')

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
            navigate("/Rate-Master-List");
          //});
        }
      } catch (error) {
        console.error("Error saving driver:", error);
      }
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
        <h1>Save Rate Master</h1>
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
   
              <Autocomplete
                id="Customer"
                options={
                  customer ? customer.map((type) => type.customer_name) : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="customer"
                    variant="outlined"
                    label="Customer"
                    size="small"
                    fullWidth
                    error={!!errors.customer}
                    helperText={errors.customer}
                  />
                )}
                onChange={(event, value) =>
                  handleAutocompleteChange(event, value)
                }
              />
            </Grid>
            <Grid item xs={5}>
    
              <Autocomplete
                id="Article"
                options={
                  article
                    ? article.map((type) => ({
                        articles_id: type.articles_id,
                        articles_name: type.articles_name,
                      }))
                    : []
                }
                getOptionLabel={(option) => option.articles_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="article"
                    variant="outlined"
                    label="Article"
                    size="small"
                    fullWidth
                    error={!!errors.article}
                    helperText={errors.article}
                  />
                )}
                onChange={(event, value) =>
                  handleAutocompleteArticleChange(event, value)
                }
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
           
              <Autocomplete
                id="fromStation"
                options={
                  place
                    ? place.map((type) => ({
                        place_id: type.place_id,
                        place_name: type.place_name,
                      }))
                    : []
                }
                getOptionLabel={(option) => option.place_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="fromStation"
                    variant="outlined"
                    label="From Station"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={(event, value) =>
                  handleAutocompletefromStationChange(event, value)
                }
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
         
              <Autocomplete
                id="toStation"
                options={
                  place
                    ? place.map((type) => ({
                        place_id: type.place_id,
                        place_name: type.place_name,
                      }))
                    : []
                }
                getOptionLabel={(option) => option.place_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="toStation"
                    variant="outlined"
                    label="To Station"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={(event, value) =>
                  handleAutocompletetoStationChange(event, value)
                }
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
          
              <TextField
                id="rate-input"
                label="Enter Rate"
                value={formData.rate}
                onChange={(event) =>
                  handleInputChange("rate", event.target.value)
                }
                fullWidth
                size="small"
                error={!!errors.rate}
                helperText={errors.rate}
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
              <Button variant="contained" color="primary" onClick={handleSave} style={{backgroundColor:'#ffa500'}}>
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

export default AddRateMaster;
