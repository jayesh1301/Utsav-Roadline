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
  DialogTitle,
  DialogActions,
  styled,
} from "@mui/material";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import Transactiondetails from "./Transactiondetails";
import BillingDetails from "./BillingDetails";
import { useNavigate, useParams } from "react-router-dom";
import { SelectBranch, getAllPlaces } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import { getAllCustomers } from "../../../lib/api-customer";
import { getallVehicle } from "../../../lib/api-vehicle";
import { getArticals } from "../../../lib/api-artical";
import {
  Addlr,
  checklrforupdate,
  getConsignor,
  getLRByIdPdf,
  getLRByIdPdfForPrintwithoutvalue,
  getLRByIdPdfmail,
  getlrbyPrint,
  getlrbyid,
  sendMail,
  upadtelrmaster,
} from "../../../lib/api-lorryreceipt";
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
  },
});
const EditLR = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const handalClose = () => {
    navigate("/LR");
  };
  const [errors, setErrors] = useState({
    consignee: "",
    from: "",
    consignor: "",
    to: "",
  });
  const [transactionData, setTransactionData] = useState({
    formData: {},
    rows: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [BillingDetail, setBillingDetails] = useState({});
  const [formData, setFormData] = useState({
    lrNo: "",
    date: null,
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
  const [vehicle, setVehicle] = useState(null);
  const [newFile, setNewfile] = useState(null);
  const [place, setPlace] = useState(null);
  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')
  const [transaction, setTransaction] = useState([]);
  const [updatetrigger, setUpdateTrigger] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [custo, setCusto] = useState("");
  const [truck, setTruck] = useState("");
  const handleVehicleContactsChange = (contacts) => {
    setTransaction(contacts);
  };
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  const [isLoading1, setIsLoading1] = useState(false);
  const [datatosend, setDatatosend] = useState([]);
  const [transection, setTransection] = useState([]);
  const [tranlength, setTranlength] = useState("");
  const checkLrforupadte = async () => {
    try {
      const response = await checklrforupdate(id);
      const { data } = response;
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const getLrforupadte = async () => {
    setIsLoading(true);
    try {
      const response = await getlrbyid(id);
      const { data } = response;
      setTransection(data.transactionData);
      setTranlength(data.transactionDataLength);
      console.log(data);
      setDatatosend(data[0]);
      if (data) {
        setFormData({
          lrNo: data[0].lr_no,
          date: data[0].lrdate,
          consignmentNoteNo: data[0].consignote,
          truckNo: data[0].truck_tempo_number,
          consignor: data[0].consigner,
          consignorGst: data[0].consignorgst,
          consignorAddress: data[0].consigner_address,
          from: data[0].loc_from,
          consignee: data[0].consignee,
          consigneeGst: data[0].consigneegst,
          consigneeAddress: data[0].consignee_address,
          to: data[0].loc_to,
          toPlaceContact: data[0].toplacecontact,
        });
      }
      setCusto(
        data[0].consigner
          ? customer.find((p) => p.customer_id == data[0].consigner)
              ?.customer_name
          : ""
      );
      setTruck(
        data[0].truck_tempo_number
          ? vehicle.find((p) => p.vehicle_id == data[0].truck_tempo_number)
              ?.vehicleno
          : ""
      );
      console.log("custo", custo);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      checkLrforupadte();
      getLrforupadte();
    }
  }, []);
  useEffect(() => {
    if (custo == undefined || truck == undefined ) {
      getLrforupadte();
    }
  }, [custo,truck]);
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
     // setIsLoading(true)
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
    if (newValue) {
      setSelectedBranch(newValue);
    //  setBranch(newValue.branch_id)
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
      const correspondingPlace = place.find(
        (p) => p.place_name === selectedType.customer_city
      );
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
      const correspondingPlace = place.find(
        (p) => p.place_name === selectedType.customer_city
      );
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
    if (!dayjs.isDayjs(date)) {
      date = dayjs(date);
    }

    const formattedDate = date.format("YYYY-MM-DD");

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

    setErrors(newErrors);
    return isValid;
  };
  const alertmessgae = () => {
    if (
      formData.consignee === "" ||
      formData.consignor === "" ||
      formData.form === "" ||
      formData.to === ""
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

        const response = await upadtelrmaster(id, combinedData);
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
        setConfirmmessage(response.data.message);
      setConfirmationopen(true);
      setColor('success')
      
        setUpdateTrigger(true);
        // navigate("/LR");
      } catch (error) {
        console.error("Error saving article:", error);
        Swal.fire({
          icon: "error",
          title: "Something Went Wrong!",
          text: error.response.data,
        });
      } finally {
        setIsLoading(false);
      }
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
          setConfirmmessage('Something went wrong!');
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
          setConfirmmessage('Something went wrong!');
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
  const handleSavePrint = async () => {
    alertmessgae();
    if (validateForm()) {
      if (!validation()) {
        return;
      }

      setIsLoading(true);
      try {
        const combinedData = {
          ...formData,
          ...BillingDetail,
          rows: transactionData.rows,
          transactionData: transactionData.formData,
          in_user_id: user.id,
          in_branch: user.branch,
        };

        const response = await upadtelrmaster(id, combinedData);

        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: response.data.message,
        }).then(() => {
          setUpdateTrigger(true);
          if (id) {
            gedatabyidPrint(id);
          }
        });

        // navigate("/LR")
      } catch (error) {
        console.error("Error saving article:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const gedatabyidPrint = async (id) => {
    setIsLoading(true);
    try {
      const response = await getlrbyPrint(id);
      const { data } = response;
      const pdfData = response.data.returnpath;

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
  return (
    <>
     <CustomSnackbar
      open={isConfirmationopen}
      message={confirmmessage}
      onClose = {()=> setConfirmationopen(false)}
      color={color}
      />
      {isLoading || isLoading1 ? (
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
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Branch:"
                  fullWidth
                  size="small"
                  value={selectedBranch ? selectedBranch.branch_name : ""}
                  
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
                    onChange={handleInputChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        placeholder="LR Date:"
                        format="DD-MM-YYYY"
                        value={dayjs(formData.date) || null}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            size: "small",
                            name: "date",
                            label: "Date",
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
                    value={
                      formData.truckNo
                        ? vehicle &&
                          vehicle.find((p) => p.vehicle_id == formData.truckNo)
                            ?.vehicleno
                        : ""
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
              <Grid container spacing={2} style={{ marginTop: 5 }}>
                <Grid item xs={3}>
               
                  <Autocomplete
                    id="Customer"
                    options={
                      customer ? customer.map((type) => type.customer_name) : []
                    }
                    value={
                      formData.consignor
                        ? customer.find(
                            (p) => p.customer_id == formData.consignor
                          )?.customer_name
                        : ""
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
                    value={formData.consignorAddress}
                    onChange={handleInputChange}
                    maxRows={10}
                    multiline
                    InputProps={{
                      readOnly: true,
                    }}
                    inputProps={{
                      style: { textAlign: 'center', paddingTop: '15px' }, // Add top padding to the text
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
          
                  <Autocomplete
                    id="Customer"
                    options={place ? place.map((type) => type.place_name) : []}
                    value={
                      formData.from && place
                        ? place.find((p) => p.place_id == formData.from)
                            ?.place_name
                        : null
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
              <Grid container spacing={2} style={{ marginTop: 5 }}>
                <Grid item xs={3}>
                 
                  <Autocomplete
                    id="Customer"
                    options={
                      customer ? customer.map((type) => type.customer_name) : []
                    }
                    value={
                      formData.consignee
                        ? customer.find(
                            (p) => p.customer_id == formData.consignee
                          )?.customer_name
                        : null
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
                    maxRows={10}
                    multiline
                    InputProps={{
                      readOnly: true,
                    
                    }}
                    inputProps={{
                      style: { textAlign: 'center', paddingTop: '15px' }, // Add top padding to the text
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
             
                  <Autocomplete
                    id="Customer"
                    options={place ? place.map((type) => type.place_name) : []}
                    value={
                      formData.to && place
                        ? place.find((p) => p.place_id == formData.to)
                            ?.place_name
                        : null
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
              style={{ marginTop: 5 }}
              alignItems="center"
              justifyContent="center"
            >
              <Transactiondetails
                onDataUpdate={handleData}
                datatosend={datatosend}
                transection={transection}
                tranlength={tranlength}
              />
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ marginTop: 16 }}
              alignItems="center"
              justifyContent="center"
            >
              <BillingDetails
                handleBillingData={handleBillingData}
                datatosend={datatosend}
              />
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
              <Button variant="contained" color="primary" onClick={handleSave}>
                Update
              </Button>
            </Grid>
            {/* <Grid item>
              <Button variant="contained" color="sky" onClick={handleSavePrint}>
                Update & Print
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

export default EditLR;
