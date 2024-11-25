import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getlrdetailsbybranchwise,
  getlrforloadingsheet,
} from "../../../lib/api-loadingtrip";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const BranchWisePayment = ({
  branch,
  handlebranchwisepayment,
  isedit,
  Lrnodetails,
}) => {
  console.log("Lrnodetails", Lrnodetails);
  let id = { id: 0 };
  if (isedit) {
    id = useParams();
  }
  const [checkboxes, setCheckboxes] = useState({
    whatsapp: false,
    emailowner: false,
    print: true,
  });
  const [rows, setRows] = useState([]);
  const user = useSelector((state) => state.auth);
  
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [lrno, setLrno] = useState([]);
  const [formData, setFormData] = useState({
    lrno: "",
    paymentbranch: "",
    amount: "",
    totalamount: 0,
  });
  const columns = [
    { field: "id", headerName: "Srno", flex: 1 },
    { field: "lr_no", headerName: "LR No", flex: 1 },
    { field: "lr_date", headerName: "LR Date", flex: 1 },
    { field: "branch", headerName: "Branch", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 ,valueFormatter: (params) => `₹ ${params.value}`},
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };
  useEffect(() => {
    const totalAmount = rows.reduce(
      (total, row) => total + (parseFloat(row.amount) || 0),
      0
    );

    setFormData((prevState) => ({
      ...prevState,
      totalamount: totalAmount,
    }));
  }, [rows]);
  useEffect(() => {
    handlebranchwisepayment(formData, rows,checkboxes);
  }, [formData, rows,checkboxes]);

  const handleAdd = () => {
    const existingRow = rows.find((row) => row.lrid == formData.lrno);
    if (existingRow) {
      setConfirmmessage("LR Number already exists in the list.");
      setConfirmationopen(true);
      setColor('warning')

      // Swal.fire({
      //   icon: "warning",
      //   title: "",
      //   text: "LR Number already exists in the list.",
      // });

      return;
    }
    const currentDate = new Date().toISOString().split("T")[0];
    const newRow = {
      id: rows.length + 1,
      lr_no: formData.lrno
        ? lrno.find((p) => p.id === formData.lrno)?.lrno
        : "",
      lrid: formData.lrno,
      lr_date: currentDate,
      branch: formData.paymentbranch
        ? branch.find((p) => p.branch_id === formData.paymentbranch)
            ?.branch_name
        : "",
      branchid: formData.paymentbranch,
      amount: formData.amount,
    };

    setRows([...rows, newRow]);
    setFormData({
      lrno: "",
      paymentbranch: "",
      amount: "",
    });
  };

  const handleAutocompleteChangepayableat = (event, value) => {
    const selectedType = branch.find((type) => type.branch_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        paymentbranch: selectedType.branch_id,
      });
    } else {
      setFormData({
        ...formData,
        paymentbranch: "",
      });
    }
  };
  const fetchData = async () => {
    try {
      const response = await getlrforloadingsheet(user.branch);
      const { data } = response;
      const filteredLrno = data
        .filter((lr) => lr.id != null && lr.lr_no != null)
        .map((lr) => ({
          id: lr.id,
          lrno: lr.lr_no,
        }));
      setLrno(filteredLrno);
    } catch (error) {
      console.error("Error fetching LR numbers:", error);
    }
  };
  const fetchlrdata = async () => {
    try {
      const response = await getlrdetailsbybranchwise(id.id);
      const { data } = response;
      const currentDate = new Date().toISOString().split("T")[0];
      if (Array.isArray(data)) {
        const newRows = data.map((item, index) => ({
          id: rows.length + index + 1,
          lr_no: item.lr_no_with_abbr,
          lrid: item.lr_id,
          lr_date: currentDate,
          branch: item.branch_name,
          branchid: item.pay_branch_id,
          amount: item.pay_amount,
        }));

        setRows([...rows, ...newRows]);
      } else {
        console.error("Error: Expected data to be an array");
      }
    } catch (error) {
      console.error("Error fetching LR numbers:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (isedit) {
      fetchlrdata();
    }
  }, []);
  console.log(rows);
  const handleAutocompleteChangelrno = (event, value) => {
    const selectedType = Lrnodetails.find((type) => type.lrno === value);
    if (selectedType) {
      setFormData({
        ...formData,
        lrno: selectedType.id,
        amount: parseInt(selectedType.total),
      });
    } else {
      setFormData({
        ...formData,
        lrno: "",
        amount: "",
      });
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    });
  };
  return (
    <>
     <CustomSnackbar
      open={isConfirmationopen}
      message={confirmmessage}
      onClose = {()=> setConfirmationopen(false)}
      color={color}
      />
      <h2>Branch - Wise Payment</h2>
      <Paper elevation={3} style={{ padding: 20, marginLeft: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Autocomplete
              id="Customer"
              options={Lrnodetails ? Lrnodetails.map((type) => type.lrno) : []}
              value={
                formData.lrno
                  ? Lrnodetails.find((p) => p.id === formData.lrno)?.lrno
                  : ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="lrno"
                  variant="outlined"
                  label="LR Number:"
                  size="small"
                  fullWidth
                />
              )}
              onChange={(event, value) =>
                handleAutocompleteChangelrno(event, value)
              }
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              id="Customer"
              options={branch ? branch.map((type) => type.branch_name) : []}
              value={
                formData.paymentbranch
                  ? branch.find((p) => p.branch_id === formData.paymentbranch)
                      ?.branch_name
                  : ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="paymentbranch"
                  variant="outlined"
                  label="Payment Branch:"
                  size="small"
                  fullWidth
                />
              )}
              onChange={(event, value) =>
                handleAutocompleteChangepayableat(event, value)
              }
            />
          </Grid>
          <Grid item xs={3}>
            
            <TextField
              name="amount"
              value={formData.amount}
              label="Amount"
              fullWidth
              size="small"
              onChange={handleFormChange}
              placeholder="₹"

              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true, 
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={handleAdd} style={{backgroundColor:'#ffa500'}}
            >
              Add
            </Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              rows={rows}
              density="compact"
              columns={columns}
              pageSize={5}
              autoHeight
              rowsPerPageOptions={[5]}
            />
          </Grid>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
  <Grid item xs={5} style={{ textAlign: "center" }}>
    <TextField
      label="Total:"
      size="small"
      name="totalamount"
      value={formData.totalamount}
      InputProps={{
        readOnly: true,
      }}
    />
  </Grid>
  <Grid item xs={7} style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
  <FormControlLabel
         control={
          <Checkbox
            name="whatsapp"
            checked={checkboxes.whatsapp}
            onChange={handleCheckboxChange}
            disabled size="small"
          />
        }
        label="WhatsApp"
          />
 
    <FormControlLabel
           control={
            <Checkbox
              name="emailowner"
              checked={checkboxes.emailowner}
              onChange={handleCheckboxChange}
            size="small"
            />
          }
          label="Vehicle Owner Mail"
          />
    <FormControlLabel
          control={
            <Checkbox
              name="print"
              checked={checkboxes.print}
              onChange={handleCheckboxChange}
            size="small"
            />
          }
          label="Print"
          
          />
  </Grid>
</Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default BranchWisePayment;
