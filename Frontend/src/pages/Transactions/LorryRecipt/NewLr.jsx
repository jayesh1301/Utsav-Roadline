import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  FormControl,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  styled,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useRef, useState } from "react";
import Transactiondetails from "./Transactiondetails";
import BillingDetails from "./BillingDetails";
import { useNavigate } from "react-router-dom";
import { SelectBranch, getAllPlaces } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import { getAllCustomers } from "../../../lib/api-customer";
import { getallVehicle } from "../../../lib/api-vehicle";
import { getArticals } from "../../../lib/api-artical";
import {
  Addlr,
  generatelrno,
  getConsignor,
  getLRByIdPdf,
  getLRByIdPdfForPrintwithoutvalue,
  getLRByIdPdfmail,
  getlrbyPrint,
  savelrprint,
  sendMail,
} from "../../../lib/api-lorryreceipt";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";
const ResizableTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    // Default size settings
    height: "30px", // Set the default height
    overflow: "auto", // Scroll if content exceeds
    resize: "both", // Allow resizing
    minHeight: "40px", // Ensure a minimum height
  },
  // Adjusting the wrapper to control resizing behavior
  "& .MuiInputBase-root textarea": {
    height: "auto", // Allow the textarea to grow when resized by user
    maxHeight: "none", // No maximum height constraint
    minHeight: "100%",
    textAlign: 'center',
    marginTop: '14px',
    overflow: "auto",
  },
});
const NewLr = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [customer, setCustomer] = useState([]);
  const mandatoryFieldRef = useRef(null);
  const handalClose = () => {
    navigate("/LR");
  };
  const [transactionData, setTransactionData] = useState({
    formData: {},
    rows: [],
  });
  const [BillingDetail, setBillingDetails] = useState({});
  const [errors, setErrors] = useState({
    consignee: "",
    from: "",
    consignor: "",
    to: "",
    selectedBranch:""
  });
  const [formData, setFormData] = useState({
    lrNo: "",
    date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    consignmentNoteNo: "",
    truckNo: "",
    consignor: "",
    consignorGst: "",
    consignorAddress: "",
    from: "",
    consignee: "",
    consigneeGst: "",
    consigneeAddress: "",
    to: "",
    toPlaceContact: "",
  });
  const user = useSelector((state) => state.auth);
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [lrno, setLrno] = useState(null);
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')
  const [savetrigger, setSavetrigger] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [articleNameError, setArticleNameError] = useState("");
  const [place, setPlace] = useState(null);
  const [transaction, setTransaction] = useState([]);
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [newFile, setNewfile] = useState(null);
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  const handleVehicleContactsChange = (contacts) => {
    setTransaction(contacts);
  };

  const getbranch = async () => {
    try {
      const response = await SelectBranch();
      const { data } = response;

      const branchList = data.map((branch) => ({
        branch_id: branch.branch_id,
        branch_name: branch.branch_name,
      }));

      setBranch(branchList);

      const userBranch = branchList.find((b) => b.branch_id == user.branch);

      if (userBranch) {
        setSelectedBranch(userBranch);
      }
    } catch (error) {
      
      console.error("Error fetching branches:", error);
    }
  };
  const getcustomer = async () => {
    try {
      setIsLoading(true)
      const response = await getAllCustomers();
      const { data } = response;

      const customers = data
        
        .map((customer) => ({
          customer_id: customer.customer_id,
          customer_name: customer.customer_name,
          customer_gstno: customer.gstno,
          customer_address: customer.address,
          customer_city: customer.city,
        }));

      setCustomer(customers);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }finally{
      setIsLoading(false)
    }
  };
  const getvehicle = async () => {
    try {
      const response = await getallVehicle();
      const { data } = response;

      const vehicle = data
        .filter(
          (vehicle) => vehicle.vehicle_id != null && vehicle.vehicleno != null
        )
        .map((vehicle) => ({
          vehicle_id: vehicle.vehicle_id,
          vehicleno: vehicle.vehicleno,
        }));

      setVehicle(vehicle);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const getplace = async () => {
    try {
      const response = await getAllPlaces();
      const { data } = response;

      const place = data
        .filter((place) => place.place_id != null && place.place_name != null)
        .map((place) => ({
          place_id: place.place_id,
          place_name: place.place_name,
        }));

      setPlace(place);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    getcustomer();
    getbranch();
    getvehicle();
    getplace();
  }, []);
  const handleBranchChange = (event, newValue) => {
    if(newValue === "" ){
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedBranch: "This Field is required",
      }));
    }else{
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedBranch: "",
      }));
    }
     if (newValue) {
      //console.log("newValue",newValue.branch_id)
     // setSelectedBranch(newValue);
      setSelectedBranch(newValue)
    } else {
      setSelectedBranch(null);
    }
  };
  const handleAutocompleteChangeConsignor = (event, value) => {
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        consignor: "This Field is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        consignor: "",
      }));
    }

    const selectedType = customer.find((type) => type.customer_name === value);
    if (selectedType) {
      const correspondingPlace = place.find((p) => {
        return (
          p.place_name.trim().toLowerCase() ===
          selectedType.customer_city.trim().toLowerCase()
        );
      });
      setFormData({
        ...formData,
        consignor: selectedType.customer_id,
        consignorGst: selectedType.customer_gstno,
        consignorAddress: selectedType.customer_address,
        from: correspondingPlace ? correspondingPlace.place_id : "",
      });
    } else {
      setFormData({
        ...formData,
        consignor: "",
      });
    }
  };
  const handleAutocompleteChangeConsignee = (event, value) => {
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        consignee: "This Field is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        consignee: "",
      }));
    }
    const selectedType = customer.find((type) => type.customer_name === value);
    if (selectedType) {
      const correspondingPlace = place.find((p) => {
        return (
          p.place_name.trim().toLowerCase() ===
          selectedType.customer_city.trim().toLowerCase()
        );
      });

      setFormData({
        ...formData,
        consignee: selectedType.customer_id,
        consigneeGst: selectedType.customer_gstno,
        consigneeAddress: selectedType.customer_address,
        to: correspondingPlace ? correspondingPlace.place_id : "",
      });
    } else {
      setFormData({
        ...formData,
        consignee: "",
      });
    }
  };
  const handleAutocompleteChangefrom = (event, value) => {
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        from: "This Field is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        from: "",
      }));
    }

    const selectedType = place.find((type) => type.place_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        from: selectedType.place_id,
      });
    } else {
      setFormData({
        ...formData,
        from: "",
      });
    }
  };
  const handleAutocompleteChangeto = (event, value) => {
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        to: "This Field is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        to: "",
      }));
    }

    const selectedType = place.find((type) => type.place_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        to: selectedType.place_id,
      });
    } else {
      setFormData({
        ...formData,
        to: "",
      });
    }
  };
  const handleAutocompleteChangeVehicle = (event, value) => {
    const selectedType = vehicle.find((type) => type.vehicleno === value);
    if (selectedType) {
      setFormData({
        ...formData,
        truckNo: selectedType.vehicle_id,
      });
    } else {
      setFormData({
        ...formData,
        truckNo: "",
      });
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    if (!date) {
      console.error("handleDateChange: Invalid date received:", date);
      return;
    }

    if (!dayjs.isDayjs(date)) {
      console.error("handleDateChange: Date is not a Day.js object:", date);

      date = dayjs(date);
    }

    const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");

    setFormData((prevData) => ({
      ...prevData,
      date: formattedDate,
    }));
  };

  const handleData = (formData, rows) => {
    setTransactionData({ formData, rows });
  };
  const handleBillingData = (combinedData) => {
    setBillingDetails(combinedData);
  
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.consignor) {
      isValid = false;
      newErrors.consignor = "This Field is required";
    }

    if (!formData.consignee) {
      isValid = false;
      newErrors.consignee = "This Field is required";
    }

    if (!formData.from) {
      isValid = false;
      newErrors.from = "This Field is required";
    }

    if (!formData.to) {
      isValid = false;
      newErrors.to = "This Field is required";
    }
    if (!selectedBranch) {
      isValid = false;
      newErrors.selectedBranch = "This Field is required";
    }
    
    setErrors(newErrors);
    return isValid;
  };
  const alertmessgae = () => {
    if (
      formData.consignee === "" ||
      formData.consignor === "" ||
      formData.form === "" ||
      formData.to === "" ||
      selectedBranch === "" || selectedBranch === null || selectedBranch === undefined
    ) {
      setConfirmmessage('Fill the mandatory fields');
      setConfirmationopen(true);
      setColor('warning')
     
    }
  };
  const validation = () => {
    if (transactionData.rows.length === 0) {
      setConfirmmessage('Please Fill LR Data');
      setConfirmationopen(true);
      setColor('warning')
   
      return false;
    }
    return true;
  };
  const handleSave = async () => {
    alertmessgae();

    if (validateForm()) {
      if (!validation()) {
        return;
      }
      
      setIsLoading(true);
      try {
        localStorage.setItem("formdataConsignor",formData.consignor)
        localStorage.setItem("formdataconsignee",formData.consignee)
        
        const combinedData = {
          ...formData,
          ...BillingDetail,
          rows: transactionData.rows,
          transactionData: transactionData.formData,
          in_user_id: user.id, 
          in_branch: selectedBranch, 
        };

        const response = await Addlr(combinedData);
        const id = response.data.inserted_id;
        localStorage.setItem("id",id)
        
        console.log(response.data.message)
       if(response.data.message != 'LR Already Exists!'){

        setConfirmmessage(response.data.message);
        setConfirmationopen(true);
        setColor('success')
       
        if (BillingDetail.emailConsigner== true){
          const consignor=localStorage.getItem("formdataConsignor")
          
          handleEmail(consignor,id)
        }
        if(BillingDetail.print == true){
          
          handlePrint(id)
        }
        if(BillingDetail.emailConsignee == true){
          const consignee=localStorage.getItem("formdataconsignee")
          
          handleConsEmail(consignee,id)
        }
      }else{

        setConfirmmessage(response.data.message);
        setConfirmationopen(true);
        setColor('warning')
      }
        
      } catch (error) {
        console.error("Error saving article:", error);
        console.log(error.data);
        setConfirmmessage('Something Went Wrong!');
        setConfirmationopen(true);
        setColor('error')
     
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleConsEmail = async (consignee, id) => {
    setIsLoading1(true);
    try {
     
      const response = await getConsignor(consignee);
      const { data } = response;
      if (data && data.length > 0 && data[0].emailid) {

        localStorage.setItem("tomails",data[0].emailid)
        setEmailForm(prevState => ({
          ...prevState,
          id: id,
          toEmail: data[0].emailid
        }));
        const response1 = await getLRByIdPdf(id);
        const returnpath = response1.data.returnpath;
        const fileName = returnpath.split("/").pop();

        localStorage.setItem("message",`Please find the attached file: ${fileName}`)
        setEmailForm(prevState => ({
          ...prevState,
          message: `Please find the attached file: ${fileName}`
        }));
        
          sendEmails(id)
        
      } else {
        console.error('Consignor data is missing or invalid.');
      }
    } catch (error) {
      console.error('Error handling email:', error);
    }finally{
      setIsLoading1(false);
    }
  };
  const handleEmail = async (consignor, id) => {
    setIsLoading1(true);
    try {
     
      const response = await getConsignor(consignor);
      const { data } = response;
      if (data && data.length > 0 && data[0].emailid) {
       
        localStorage.setItem("tomail",data[0].emailid)
        setEmailForm(prevState => ({
          ...prevState,
          id: id,
          toEmail: data[0].emailid
        }));
        const response1 = await getLRByIdPdf(id);
        const returnpath = response1.data.returnpath;
        const fileName = returnpath.split("/").pop();
  
        // Update email form with the message and file name
        localStorage.setItem("message",`Please find the attached file: ${fileName}`)
        setEmailForm(prevState => ({
          ...prevState,
          message: `Please find the attached file: ${fileName}`
        }));
        
          sendEmail(id)
        
      } else {
        console.error('Consignor data is missing or invalid.');
      }
    } catch (error) {
      console.error('Error handling email:', error);
    }finally{
      setIsLoading1(false);
    }
  };
  let pdfpathfile;
  const sendEmail = async (id) => {
  
    setIsLoading1(true);
    try {
      const response = await getLRByIdPdfmail(id);

      const pdfpath = response.data.returnpath;
     
      pdfpathfile = pdfpath;
      if (pdfpath) {
        
        setEmailForm({
          ...emailForm,
        });
        const emailid=localStorage.getItem("id")
        const tomail=localStorage.getItem("tomail")
      const message= localStorage.getItem("message")
        const options = {
          pdfpathfile,
          emailForm:{
id:parseInt(emailid),
toEmail:tomail,
message:message
          },
        };
        const response = await sendMail(options);
       
        if (response.status == 200) {
         
          localStorage.removeItem("tomail");

        } else {
          setConfirmmessage('Something Went Wrong!');
          setConfirmationopen(true);
          setColor('error')
       
        
        }
      }
    } catch (error) {
      console.error("Error saving article:", error);
      // Handle error
    } finally {
      setIsLoading1(false);
    }
  };
  const sendEmails = async (id) => {
    
     setIsLoading1(true);
     try {
       const response = await getLRByIdPdfmail(id);
 
       const pdfpath = response.data.returnpath;
      
       pdfpathfile = pdfpath;
       if (pdfpath) {
        
         setEmailForm({
           ...emailForm,
         });
         const emailid=localStorage.getItem("id")
         const tomail=localStorage.getItem("tomails")
       const message= localStorage.getItem("message")
         const options = {
           pdfpathfile,
           emailForm:{
 id:parseInt(emailid),
 toEmail:tomail,
 message:message
           },
         };
         const response = await sendMail(options);
         
         if (response.status == 200) {
          
           localStorage.removeItem("tomails");

         } else {
          setConfirmmessage('Something Went Wrong!');
          setConfirmationopen(true);
          setColor('error')
       
         
         }
       }
     } catch (error) {
       console.error("Error saving article:", error);
       // Handle error
     } finally {
       setIsLoading1(false);
     }
   };
  const handlePrint = async (id) => {
    setIsLoading(true);
    try {
      const response2 = await getlrbyPrint(id);
      const pdfData = response2.data.returnpath;
      setPdfData(pdfData);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setOpen(true);
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setPdfData(null);

    setOpen(false);
    window.location.reload();
  };
  const handleLrNoInput = (event) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      setConfirmmessage('Only numeric values are allowed for LR No.');
      setConfirmationopen(true);
      setColor('warning')
   
    }
  };

  const handleLrNoBlur = (event) => {
    const value = event.target.value;
    if (!/^\d+$/.test(value)) {
      setConfirmmessage('LR No. should only contain numeric values.');
      setConfirmationopen(true);
      setColor('warning')
   
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
      {isLoading  || isLoading1? (
        <LoadingSpinner />
      ) : (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={5}>
            <Autocomplete
              sx={{ width: "40%" }}
              options={branch}
              getOptionLabel={(option) => option.branch_name}
              value={selectedBranch}
              onChange={handleBranchChange}
              renderInput={(params) => (
                <TextField
                  label="Branch:"
                  {...params}
                  fullWidth
                  size="small"
                  value={selectedBranch ? selectedBranch.branch_name : ""}
                  error={Boolean(errors.selectedBranch)}
                  helperText={errors.selectedBranch}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <h1>Lorry Receipt Details</h1>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: 16 }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    name="lrNo"
                    label="LR No:"
                    fullWidth
                    size="small"
                    value={formData.lrNo}
                    onKeyPress={handleLrNoInput}
                    onBlur={handleLrNoBlur}
                    onChange={handleInputChange}
                    
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth style={{backgroundColor:'white'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                      
                        label="LR Date:"
                        format="DD-MM-YYYY"
                  
                        value={dayjs(formData.date)}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            size: "small",
                            name: "date",
                            
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="consignmentNoteNo"
                    label="Consignment Note No:"
                    fullWidth
                    size="small"
                    value={formData.consignmentNoteNo}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="truckNo"
                    options={
                      vehicle ? vehicle.map((type) => type.vehicleno) : []
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="truckNo"
                        variant="outlined"
                        label="Truck/Tempo No:"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangeVehicle(event, value)
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    id="Customer"
                    options={
                      customer ? customer.map((type) => type.customer_name) : []
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="consignor"
                        variant="outlined"
                        label="Consignor:"
                        size="small"
                        fullWidth
                        error={Boolean(errors.consignor)}
                        helperText={errors.consignor}
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangeConsignor(event, value)
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="consignorGst"
                    label="Consignor's GST No"
                    fullWidth
                    size="small"
                    value={formData.consignorGst}
                    onChange={handleInputChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={3}>
                  <ResizableTextField
                    name="consignorAddress"
                    label="Consignor Address:"
                    fullWidth
                    size="small"
                    multiline
                    maxRows={10}
                    
                    value={formData.consignorAddress}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                    }}
                    
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="Customer"
                    options={place ? place.map((type) => type.place_name) : []}
                    value={
                      formData.from
                        ? place.find((p) => p.place_id === formData.from)
                            ?.place_name
                        : ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="from"
                        variant="outlined"
                        label="From:"
                        size="small"
                        fullWidth
                        error={Boolean(errors.from)}
                        helperText={errors.from}
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangefrom(event, value)
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={3}>
                  <Autocomplete
                    id="Customer"
                    options={
                      customer ? customer.map((type) => type.customer_name) : []
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="consignee"
                        variant="outlined"
                        label="Consignee:"
                        size="small"
                        fullWidth
                        error={Boolean(errors.consignee)}
                        helperText={errors.consignee}
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangeConsignee(event, value)
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="consigneeGst"
                    label="Consignee's GST No"
                    fullWidth
                    size="small"
                    value={formData.consigneeGst}
                    onChange={handleInputChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={3}>
                  <ResizableTextField
                    name="consigneeAddress"
                    label="Consignee Address:"
                    fullWidth
                    size="small"
                    value={formData.consigneeAddress}
                    onChange={handleInputChange}
                    multiline
                    maxRows={10}
                    InputProps={{
                      readOnly: true,
                    }}
                    
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="Customer"
                    options={place ? place.map((type) => type.place_name) : []}
                    value={
                      formData.to
                        ? place.find((p) => p.place_id === formData.to)
                            ?.place_name
                        : ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="to"
                        variant="outlined"
                        label="To:"
                        size="small"
                        fullWidth
                        error={Boolean(errors.to)}
                        helperText={errors.to}
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangeto(event, value)
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={3}>
                  <TextField
                    name="toPlaceContact"
                    label="To place Contact:"
                    fullWidth
                    size="small"
                    value={formData.toPlaceContact}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Paper>
            <Grid
              container
              spacing={2}
              style={{ marginTop: 16 }}
              alignItems="center"
              justifyContent="center"
            >
              <Transactiondetails onDataUpdate={handleData} />
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ marginTop: 16 }}
              alignItems="center"
              justifyContent="center"
            >
              <BillingDetails handleBillingData={handleBillingData} />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            style={{ marginTop: 16 }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSave} style={{backgroundColor:'#ffa500'}}>
                Save
              </Button>
            </Grid>
            {/* <Grid item>
              <Button variant="contained" color="sky" onClick={handleSavePrint}>
                Save & Print
              </Button>
            </Grid> */}

            <Grid item>
              <Button variant="contained" color="accent" onClick={handalClose}>
                Cancel
              </Button>
            </Grid>
   
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={1200}
          >
            <iframe
              title="pdf-view"
              src={
                pdfData
                  ? `${APP_BASE_PATH}${pdfData}`
                  : newFile
                  ? newFile
                  : null
              }
              width="800px"
              height="800px"
            ></iframe>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        
      )}
     
    </>
  );
};

export default NewLr;
