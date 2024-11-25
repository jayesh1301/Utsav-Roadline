import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  InputLabel,
  Autocomplete,
  MenuItem,
  FormControl,
  Select,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getArticals } from "../../../lib/api-artical";
import Swal from "sweetalert2";
import InputAdornment from '@mui/material/InputAdornment';
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const Transactiondetails = ({
  onDataUpdate,
  datatosend,
  transection,
  tranlength,
}) => {
  const [rows, setRows] = useState([]);
  const currentDate = new Date()
    .toLocaleString("en-CA", {
      timeZone: "UTC",
      hour12: false,
    })
    .replace(",", "");

  const [formData, setFormData] = useState({
    noOfArticles: "",
    articles: "",
    description: "",
    actWt: 0,
    charWt: 0,
    ratePer: "Fixed",
    rate: 0,
    freight: 0,
    nextfreight: 0,
    totalNoOfArticles: 0,
    totalWeight: 0,
    varaiHamali: 0,
    collection: 0,
    doorDelChar: 0,
    weightCharge: 0,
    otherChar: 0,
    statistical: 0,
    total: 0,
    lrdata: currentDate,
  });
  
  useEffect(() => {
    if (datatosend) {
      
      setFormData({
        nextfreight: datatosend.freight,
        varaiHamali: datatosend.hamali,
        collection: datatosend.collection,
        doorDelChar: datatosend.delivery,
        // weightCharge:datatosend.wt_charges,
        // otherChar:datatosend.other_charges,
        statistical: datatosend.statatical,
        total: datatosend.total,
        ratePer: "Fixed",
      });
      setTranlength(tranlength)
      const transformedTableData = transection.map((row, index) => ({
        id: index + 1,
        "Invoice No": row.no_of_articles,
        Company: row.articles,
        Article: row.description,
        "No of article": row.actual_wt,
        Weight: row.char_wt,
        fPlace: row.rate_per,
        fPayment: row.rate,
        Remark: row.inv_amt,
      }));

      setRows(transformedTableData);
    }
  }, [datatosend]);
const [tranlengths,setTranlength]= useState()
  const [article, setArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [editId, setEditId] = useState(null);

  const columns = [
    { field: "id", headerName: "Sr No", flex: 1 },
    {
      field: "Invoice No",
      headerName: "No Article",
      flex: 1,
      renderCell: (params) => {
        const invoiceNo = params.value || 0;
        return <div>{invoiceNo}</div>;
      },
    },

    { field: "Company", headerName: "Article", flex: 1 },
    { field: "Article", headerName: "Description", flex: 1 },
    {
      field: "No of article",
      headerName: "Act.Wt",
      flex: 1,
      renderCell: (params) => {
        const Noofarticle = params.value || 0;
        return <div>{Noofarticle}</div>;
      },
    },
    {
      field: "Weight",
      headerName: "Weight",
      flex: 1,
      renderCell: (params) => {
        const Weight = params.value || 0;
        return <div>{Weight}</div>;
      },
    },
    { field: "fPlace", headerName: "Rate Per", flex: 1 },
    { field: "fPayment", headerName: "Rate", flex: 1,valueFormatter: (params) => `₹ ${params.value}` },
    { field: "Remark", headerName: "Freight", flex: 1 ,valueFormatter: (params) => `₹ ${params.value}`},
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const getarticle = async () => {
    try {
      const response = await getArticals();
      const { data } = response;

      const article = data
        .filter(
          (article) =>
            article.articles_id != null && article.articles_name != null
        )
        .map((article) => ({
          articles_id: article.articles_id,
          articles_name: article.articles_name,
        }));

      setArticle(article);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    getarticle();
  }, []);

  const handleAutocompleteChange = (event, value) => {
    const selectedType = article.find((type) => type.articles_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        articles: selectedType.articles_name,
      });
      setSelectedArticle(selectedType.articles_name);
    } else {
      setFormData({
        ...formData,
        articles: "",
      });
      setSelectedArticle(null);
    }
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
    
  //   if (name === "actWt") {
  //     const intValue = parseInt(value);
  //     setFormData({
  //       ...formData,
  //       actWt: isNaN(intValue) ? "" : intValue,
  //       charWt: isNaN(intValue) ? "" : intValue,
  //     });
  //     const updatedFreight = calculateFreight(
  //       formData.ratePer,
  //       formData.noOfArticles,
  //       intValue,
  //       formData.rate
  //     );
  //     setFormData({
  //       ...formData,
  //       actWt: isNaN(intValue) ? "" : intValue,
  //       charWt: isNaN(intValue) ? "" : intValue,
  //       freight: updatedFreight,
  //     });
  //   } else if (name === "rate") {
      
  //     const intValue = parseFloat(value);
      
  //     setFormData({
  //       ...formData,
  //       rate: isNaN(intValue) ? "" : intValue,
  //     });
  //     // Update freight based on ratePer and rate
  //     const updatedFreight = calculateFreight(
  //       formData.ratePer,
  //       formData.noOfArticles,
  //       formData.charWt,
  //       intValue
  //     );
  //     setFormData({
  //       ...formData,
  //       rate: isNaN(intValue) ? "" : intValue,
  //       freight: updatedFreight,
  //     });
  //   } else if (name === "noOfArticles") {
  //     const intValue = parseInt(value);
  //     setFormData({
  //       ...formData,
  //       noOfArticles: isNaN(intValue) ? "" : intValue,
  //     });
  //     const updatedFreight = calculateFreight(
  //       formData.ratePer,
  //       intValue,
  //       formData.charWt,
  //       formData.rate
  //     );
  //     setFormData({
  //       ...formData,
  //       noOfArticles: isNaN(intValue) ? "" : intValue,
  //       freight: updatedFreight,
  //     });
  //   } else if (name === "charWt") {
  //     const intValue = parseInt(value);
  //     setFormData({
  //       ...formData,
  //       charWt: isNaN(intValue) ? "" : intValue,
  //     });
  //     const updatedFreight = calculateFreight(
  //       formData.ratePer,
  //       formData.noOfArticles,
  //       intValue,
  //       formData.rate
  //     );
  //     setFormData({
  //       ...formData,
  //       charWt: isNaN(intValue) ? "" : intValue,
  //       freight: updatedFreight,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    if (name === "actWt") {
        const intValue = parseInt(value, 10);
        const updatedFreight = calculateFreight(
            formData.ratePer,
            formData.noOfArticles,
            intValue,
            formData.rate
        );
        setFormData({
            ...formData,
            actWt: isNaN(intValue) ? "" : intValue,
            charWt: isNaN(intValue) ? "" : intValue,
            freight: updatedFreight,
        });
    } else if (name === "rate") {
        // Keep the value as a string to handle floats properly
        setFormData({
            ...formData,
            rate: value,
        });
        // Convert to float only when needed for calculations
        const floatValue = parseFloat(value);
        if (!isNaN(floatValue)) {
            const updatedFreight = calculateFreight(
                formData.ratePer,
                formData.noOfArticles,
                formData.charWt,
                floatValue
            );
            setFormData({
                ...formData,
                rate: value,
                freight: updatedFreight,
            });
        }
    } else if (name === "noOfArticles") {
        const intValue = parseInt(value, 10);
        const updatedFreight = calculateFreight(
            formData.ratePer,
            intValue,
            formData.charWt,
            formData.rate
        );
        setFormData({
            ...formData,
            noOfArticles: isNaN(intValue) ? "" : intValue,
            freight: updatedFreight,
        });
    } else if (name === "charWt") {
        const intValue = parseInt(value, 10);
        const updatedFreight = calculateFreight(
            formData.ratePer,
            formData.noOfArticles,
            intValue,
            formData.rate
        );
        setFormData({
            ...formData,
            charWt: isNaN(intValue) ? "" : intValue,
            freight: updatedFreight,
        });
    } else {
        setFormData({
            ...formData,
            [name]: value,
        });
    }
};

  const calculateFreight = (ratePer, noOfArticles, charWt, rate) => {
    let freightValue = 0;
    if (ratePer === "Kg") {
      const charWtFloat = parseFloat(charWt);
      const rateFloat = parseFloat(rate);
      freightValue =
        isNaN(charWtFloat) || isNaN(rateFloat)
          ? "0.00"
          : (charWtFloat * rateFloat).toFixed(2);
    } else if (ratePer === "Case") {
      const charWtFloat = parseFloat(noOfArticles);
      const rateFloat = parseFloat(rate);
      freightValue =
        isNaN(charWtFloat) || isNaN(rateFloat)
          ? "0.00"
          : (charWtFloat * rateFloat).toFixed(2);
    }
    return freightValue;
  };

  useEffect(() => {
    const total = (
      parseInt(formData.nextfreight || 0) +
      parseInt(formData.varaiHamali || 0) +
      parseInt(formData.collection || 0) +
      parseInt(formData.doorDelChar || 0) +
      parseInt(formData.weightCharge || 0) +
      parseInt(formData.otherChar || 0) +
      parseInt(formData.statistical || 0)
    ).toFixed(2);

    setFormData((prevFormData) => ({
      ...prevFormData,
      total: total,
    }));
  }, [
    formData.nextfreight,
    formData.varaiHamali,
    formData.collection,
    formData.doorDelChar,
    formData.weightCharge,
    formData.otherChar,
    formData.statistical,
  ]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    if (value === "Kg") {
      const charWtFloat = parseFloat(formData.charWt);
      const rateFloat = parseFloat(formData.rate);

      const freightValue =
        isNaN(charWtFloat) || isNaN(rateFloat)
          ? "0.00"
          : (charWtFloat * rateFloat).toFixed(2);
      setFormData({
        ...formData,
        [name]: value,
        freight: freightValue,
      });
    } else if (value === "Case") {
      const charWtFloat = parseFloat(formData.noOfArticles);
      const rateFloat = parseFloat(formData.rate);
      const freightValue =
        isNaN(charWtFloat) || isNaN(rateFloat)
          ? "0.00"
          : (charWtFloat * rateFloat).toFixed(2);
      setFormData({
        ...formData,
        [name]: value,
        freight: freightValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        rate: 0,
        freight: 0.0,
      });
    }
  };
  const calculateTotalWeight = () => {
    let totalWeight = 0;

    rows.forEach((row) => {
      let weight = parseInt(row["Weight"]);
      if (isNaN(weight)) {
        weight = 0;
      }
      totalWeight += weight;
    });

    return totalWeight;
  };

  const calculateTotalFreight = () => {
    let totalRemark = 0;
    rows.forEach((row) => {
      totalRemark += parseFloat(row["Remark"]);
    });
    return totalRemark.toFixed(2);
  };
  const calculateTotalFreightafter = (resetRows) => {
    let totalRemark = 0;
    resetRows.forEach((row) => {
      totalRemark += parseFloat(row["Remark"]);
    });
    return totalRemark.toFixed(2);
  };
  const calculateTotalArticle = () => {
    let totalRemark = 0;

    rows.forEach((row) => {
      let invoiceNo = parseInt(row["Invoice No"]);
      if (isNaN(invoiceNo)) {
        invoiceNo = 0;
      }
      totalRemark += invoiceNo;
    });

    return totalRemark;
  };

  useEffect(() => {
    const totalWeight = calculateTotalWeight(rows);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalWeight: totalWeight,
    }));

    const totalid = calculateTotalArticle(rows);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalNoOfArticles: totalid,
    }));
  }, [rows]);

  useEffect(() => {
    // if (!datatosend) {
      
    //   const totalRemark = calculateTotalFreight(rows);
    //   setFormData((prevFormData) => ({
    //     ...prevFormData,
    //     nextfreight: totalRemark,
    //   }));
      
    // }
   
    
      const totalRemark = calculateTotalFreight(rows);
      setFormData((prevFormData) => ({
        ...prevFormData,
        nextfreight: totalRemark,
      }));
    
  }, [rows]);

  const handleAddClick = () => {
    if (!formData.articles) {
      setConfirmmessage("Please Select article first!!!");
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text: "Please Select article first!!!",
      // });
      return;
    }
    if (!editMode && rows.length >= 4) {
      setConfirmmessage("You can only add up to 4 rows!");
      setConfirmationopen(true);
      setColor('warning') 
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text: "You can only add up to 4 rows!",
      // });
      return;
    }
    if (editMode) {
      const updatedRows = rows.map((row) =>
        row.id === editId
          ? {
              ...row,
              "Invoice No": formData.noOfArticles,
              Company: formData.articles,
              Article: formData.description,
              "No of article": formData.actWt,
              Weight: formData.charWt,
              fPlace: formData.ratePer,
              fPayment: formData.rate || 0,
              Remark: formData.freight || 0,
            }
          : row
      );
      setRows(updatedRows);
      setEditMode(false);
      setEditId(null);
    } else {
      // Add new row
      const newRow = {
        id: rows.length + 1,
        "Invoice No": formData.noOfArticles,
        Company: formData.articles,
        Article: formData.description,
        "No of article": formData.actWt,
        Weight: formData.charWt,
        fPlace: formData.ratePer,
        fPayment: formData.rate || 0,
        Remark: formData.freight || 0,
      };
      const updatedRows = [...rows, newRow];
      setRows(updatedRows);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,

      noOfArticles: "",
      articles: "",
      description: "",
      actWt: 0,
      charWt: 0,
      ratePer: "Fixed",
      rate: 0,
      freight: 0.0,
      nextfreight: 0.0,
    }));

    setSelectedArticle(null);
  };
  useEffect(() => {
    onDataUpdate(formData, rows);
  }, [formData, rows]);

  const handleDeleteClick = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    const resetRows = updatedRows.map((row, index) => ({
      ...row,
      id: index + 1,
    }));
    let lengthaa = tranlength - 1
    setTranlength(lengthaa)
    setRows(resetRows);
    const totalRemark = calculateTotalFreightafter(resetRows);
    setFormData((prevFormData) => ({
      ...prevFormData,
      nextfreight: totalRemark,
    }));
  };

  const handleEditClick = (row) => {
    setEditMode(true);
    setEditId(row.id);
    setFormData({
      ...formData,
      noOfArticles: row["Invoice No"],
      articles: row["Company"],
      description: row["Article"],
      actWt: row["No of article"],
      charWt: row["Weight"],
      ratePer: row["fPlace"],
      rate: row["fPayment"],
      freight: row["Remark"],
    });
    setSelectedArticle(row["Company"]);
  };

  return (
    <>
    <CustomSnackbar
      open={isConfirmationopen}
      message={confirmmessage}
      onClose = {()=> setConfirmationopen(false)}
      color={color}
      />
      <h2>Transaction Details</h2>
      <Paper elevation={3} style={{ padding: "20px", marginLeft: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <TextField
                  name="noOfArticles"
                  label="No.Articles"
                  fullWidth
                  size="small"
                  value={formData.noOfArticles}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={2}>
                <Autocomplete
                  id="Articles"
                  value={selectedArticle}
                  options={
                    article ? article.map((type) => type.articles_name) : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="articles"
                      variant="outlined"
                      label="Articles"
                      size="small"
                      fullWidth
                    />
                  )}
                  onChange={(event, value) =>
                    handleAutocompleteChange(event, value)
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  size="small"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  name="actWt"
                  label="Act.Wt"
                  fullWidth
                  size="small"
                  value={formData.actWt}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  name="charWt"
                  label="Char.Wt"
                  fullWidth
                  size="small"
                  value={formData.charWt}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={1}>
  <FormControl fullWidth>
    <InputLabel shrink htmlFor="ratePer">
      Rate Per
    </InputLabel>
    <Select
      id="ratePer"
      name="ratePer"
      label="Rate Per"
      size="small"
      value={formData.ratePer}
      onChange={handleSelectChange}
    >
      <MenuItem value={"Fixed"}>Fixed</MenuItem>
      <MenuItem value={"Kg"}>Kg</MenuItem>
      <MenuItem value={"Case"}>Case</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={1}>
  <TextField
    name="rate"
    label="Rate"
    fullWidth
    variant="outlined"
    size="small"
    value={formData.rate}
    onChange={handleInputChange}
    disabled={formData.ratePer === "Fixed"}
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          ₹
        </InputAdornment>
      ),
      
    }}
  />
</Grid>

              <Grid item xs={1}>
                <TextField
                  name="freight"
                  label="Freight"
                  fullWidth
                  size="small"
                  value={formData.freight}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                xs={2}
                container
                direction="column"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  backgroundCoor="#ffa500"
                  onClick={handleAddClick}
                  style={{backgroundColor:'#ffa500'}}
                >
                  {editMode ? "Update" : "Add"}
                
                </Button>
                <InputLabel
                  htmlFor="field-6-select"
                  style={{ textAlign: "center" }}
                >
                  Freight Details
                </InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={10}>
            <DataGrid
              density="compact"
              rows={rows}
              columns={columns}
              pageSize={5}
              autoHeight
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="nextfreight"
                    label="Freight"
                    fullWidth
                    size="small"
                    value={formData.nextfreight}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    name="collection"
                    label="C.C. Char"
                    fullWidth
                    size="small"
                    value={formData.collection}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    name="doorDelChar"
                    label="Door/Del_Char"
                    fullWidth
                    size="small"
                    value={formData.doorDelChar}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                 
                </Grid>
                <Grid item xs={12}>
                <TextField
                    name="otherChar"
                    label="Other Char"
                    fullWidth
                    size="small"
                    value={formData.otherChar}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    //disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="weightCharge"
                    label="Insuarance"
                    fullWidth
                    size="small"
                    value={formData.weightCharge}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    //disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    name="varaiHamali"
                    label="Varai/Hamali"
                    fullWidth
                    size="small"
                    value={formData.varaiHamali}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="statistical"
                    label="Docket"
                    fullWidth
                    size="small"
                    value={formData.statistical}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="total"
                    label="Total"
                    fullWidth
                    size="small"
                    value={formData.total}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                    
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{marginTop:'-70px'}}>
          <Grid item xs={6} md={3}>
            <TextField
              name="totalNoOfArticles"
              label="Total No. of Articles"
              fullWidth
              size="small"
              value={formData.totalNoOfArticles}
              onChange={handleInputChange}
              disabled
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              name="totalWeight"
              label="Total Weight"
              fullWidth
              size="small"
              value={formData.totalWeight}
              onChange={handleInputChange}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Transactiondetails;
