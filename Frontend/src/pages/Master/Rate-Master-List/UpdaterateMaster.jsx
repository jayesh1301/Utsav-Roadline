import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateRateMaster, getRateMasterbyid } from "../../../lib/api-ratemaster";
import { useSelector } from "react-redux";
import { getAllCustomers, getAllPlaces } from "../../../lib/api-customer";
import { getArticals } from "../../../lib/api-artical";
const options = ["Option 1", "Option 2", "Option 3"];
const UpdaterateMaster = () => {
  const { id } = useParams();
  const [customer,setCustomer]=useState([])
  const [place,setPlace]=useState([])
  const [article,setArticle]=useState([])
  const user = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    customer: "",
    article: "",
    fromStation: "",
    toStation: "",
    rate: "",
    userid:user.id,
    branch:user.branch,
    record_date: new Date().toISOString().split('T')[0],
  });
  const navigate = useNavigate();
  const handalCancel = () => {
    navigate("/Rate-Master-List");
  };
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const fetchdata = async () => {
    try {
      const response = await getRateMasterbyid(id);
      const ratemaster = response.data[0];
      console.log(ratemaster);
       if (ratemaster) {
        setFormData({
          customer: ratemaster.customerid,
          article: ratemaster.articleid,
          fromStation: ratemaster.fromplace,
          toStation: ratemaster.toplace,
          rate: ratemaster.rate,
         
        });
      } else {
       
        console.log("ratemaster data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (id) {
      console.log("hiiii", id);
      fetchdata();
      
    }
  }, []);
  const getcustomer = async () => {
    try {
      const response = await getAllCustomers();
      const { data } = response;

const customers = data.map((customers) => ({
  customer_id: customers.customer_id,
  customer_name: customers.customer_name,
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
        if (!uniqueArticleNames.has(article.articles_name)) {
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
        if (!uniquePlaceNames.has(place.place_name)) {
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
  useEffect(()=>{
    getcustomer()
    getarticle()
    getplace()
  },[])
  const handleAutocompleteChange = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      customer: value ? value.customer_id : '',
    }));
  };
  const handleAutocompleteArticleChange = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      article: value ? value.articles_id : '',
    }));
  };
  const handleAutocompleteFromChange = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      fromStation: value ? value.place_id : '',
    }));
  };
  const handleAutocompleteToChange = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      toStation: value ? value.place_id : '',
    }));
  };
  const handleUpdate = async () => {
    try {
      const updatedFormData = {
        ...formData,
        userid: user.id,
        branch: user.branch,
        record_date: new Date().toISOString().split('T')[0], 
      };
      const response = await UpdateRateMaster(id, updatedFormData);
      console.log("Place updated successfully:", response.data);
      navigate("/Rate-Master-List");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Update Rate Master</h1>
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
                id="customer"
                options={customer.map((type) => type)}
                getOptionLabel={(option) => option.customer_name}
                value={customer.find((type) => type.customer_id == formData.customer) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="customer"
                    variant="outlined"
                    label="Customer"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={handleAutocompleteChange}
              />
             
             
            </Grid>
            <Grid item xs={5}>
          
              <Autocomplete
                id="article"
                options={article.map((type) => type)}
                getOptionLabel={(option) => option.articles_name}
                value={article.find((type) => type.articles_id == formData.article) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="article"
                    variant="outlined"
                    label="Article"
                    size="small"
                    fullWidth
                  />
                )}
                onChange={handleAutocompleteArticleChange}
              />
             
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              
              <Autocomplete
                id="fromStation"
                options={place.map((type) => type)}
                getOptionLabel={(option) => option.place_name}
                value={place.find((type) => type.place_id == formData.fromStation) || null}
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
                onChange={handleAutocompleteFromChange}
              />
             
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
      
              <Autocomplete
                id="toStation"
                options={place.map((type) => type)}
                getOptionLabel={(option) => option.place_name}
                value={place.find((type) => type.place_id == formData.toStation) || null}
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
                onChange={handleAutocompleteToChange}
              />
             
             
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
         
              <TextField
                id="rate-input"
                label="Enter Rate"
                value={formData.rate}
                onChange={(event) => handleInputChange("rate", event.target.value)}
                fullWidth
                size="small"
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
  );
};

export default UpdaterateMaster;
