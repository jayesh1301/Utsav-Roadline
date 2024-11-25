import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FreightDetails from "./FreightDetails";
import BranchWisePayment from "./BranchWisePayment";
import { SelectBranch, getAllPlaces } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import { getallVehicle } from "../../../lib/api-vehicle";
import { getAllDrivers } from "../../../lib/api-driver";
import {
  Adddcmaster,
  getdatas,
  getloadingsheetbyid,
  getLoadingTripByIdPdfedit,
  getLoadingTripByIdPdfmail,
  getlrforloadingsheet,
  getOweneremail,
  saveloadingtripprint,
  sendMail,
  Updatedcmaster,
} from "../../../lib/api-loadingtrip";
import dayjs from "dayjs";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

const EditLodingTrip = () => {
  const navigate = useNavigate();
  const [isedit, setIsedit] = useState(false);
  const user = useSelector((state) => state.auth);
  const [branch, setBranch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);
  const [place, setPlace] = useState(null);
  const [savetrigger, setSavetrigger] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [newFile, setNewfile] = useState(null);
  const { id } = useParams();
  const [Lrnodetails, setLrnodetails] = useState([]);
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    branchId: "",
    challanNo: "",
    date: null,
    truckNo: "",
    vehicleOwner: "",
    ownerAddress: "",
    ownerContact: "",
    driverName: "",
    licenseNo: "",
    mobileNo: "",
    from: "",
    to: "",
    payableAt: "",
    remark: "",
    vehicalownerid:""
  });
  const [freightDetails, setFreightDetails] = useState(null);

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [errors, setErrors] = useState({
    truckNo: "",
    driverName: "",
    to: "",
  });
  const [branchwisepayment, setbranchwisepayment] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const getDCforupadte = async () => {
    setIsLoading(true);
    try {
      const response = await getloadingsheetbyid(id);
      const { data } = response;

      if (data) {
        const updatedFormData = {
          branchId: data[0].branchid,
          challanNo: data[0].dc_no,
          date: data[0].dc_date
            ? dayjs(data[0].dc_date).format("MM-DD-YYYY")
            : null,
          truckNo: data[0].vehicle_id,
          vehicleOwner: data[0].vehical_owner_name,
          ownerAddress: data[0].address,
          ownerContact: data[0].telephoneno,
          driverName: data[0].driver_id,
          licenseNo: data[0].licenseno,
          mobileNo: data[0].mobileno,
          from: data[0].from_loc,
          to: data[0].to_loc,
          payableAt: data[0].payble_at,
          remark: data[0].remarks,
          vehicalownerid:parseInt(data[0].vehicleownerid)
        };
        setFormData(updatedFormData);
        setIsedit(true);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDCforupadte();
  }, []);

  useEffect(() => {
    const cgecking = () => {
      if (
        formData.challanNo === "" &&
        formData.date === null &&
        formData.truckNo === "" &&
        formData.vehicleOwner === "" &&
        formData.ownerAddress === "" &&
        formData.ownerContact === "" &&
        formData.driverName === "" &&
        formData.licenseNo === "" &&
        formData.mobileNo === "" &&
        formData.from === "" &&
        formData.to === "" &&
        formData.payableAt === "" &&
        formData.remark === ""
      ) {
        setEmpty(true);
        reload();
      } else {
        setEmpty(false);
      }
    };

    if (isedit && dataLoaded) {
      cgecking();
    }
  }, [formData, isedit, dataLoaded]);

  const reload = () => {
    getDCforupadte();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handlecancel = () => {
    navigate("/loading_trip");
  };

  const handleChange = (event, value) => {
    const selectedType = branch.find((type) => type.branch_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        branchId: selectedType.branch_id,
      });
    } else {
      setFormData({
        ...formData,
        branchId: "",
      });
    }
  };
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date,
    });
  };

  const getInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        getBranches(),
        getdata()
        // getvehicle(),
        // getDrivers(),
        // getplace(),
        
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBranches = async () => {
    try {
      const response = await SelectBranch();
      const { data } = response;

      setBranch(data);

      const userBranch = data.find((b) => b.branch_id == user.branch);

      if (userBranch) {
        setFormData({
          ...formData,
          branchId: userBranch.branch_id,
        });
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  // const getvehicle = async () => {
  //   try {
  //     const response = await getallVehicle();
  //     const { data } = response;

  //     setVehicle(data);
  //   } catch (error) {
  //     console.error("Error fetching branches:", error);
  //   }
  // };
  // const getDrivers = async () => {
  //   try {
  //     const response = await getAllDrivers();
  //     const { data } = response;

  //     setDriver(data);
  //   } catch (error) {
  //     console.error("Error fetching branches:", error);
  //   }
  // };
  // const getplace = async () => {
  //   try {
  //     const response = await getAllPlaces();
  //     const { data } = response;

  //     setPlace(data);
  //   } catch (error) {
  //     console.error("Error fetching branches:", error);
  //   }
  // };
  const getdata = async () => {
    setIsLoading(true);
     try {
       const response = await getdatas();
       const { data } = response;
       
       setVehicle(data.vehicle);
       setDriver(data.driver);
       setPlace(data.place);
 
     } catch (error) {
       console.error("Error fetching branches:", error);
     } finally {
       setIsLoading(false);
     }
   };
  useEffect(() => {
    getInitialData();
  }, []);

  const handleAutocompleteChangeVehicle = (event, value) => {
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        truckNo: "This Field is required",
      }));
    }
    const selectedType = vehicle.find((type) => type.vehicleno === value);
    if (selectedType) {
      setFormData({
        ...formData,
        truckNo: selectedType.vehicle_id,
        ownerAddress: selectedType.address,
        vehicleOwner: selectedType.vehical_owner_name,
        telephoneno: selectedType.telephoneno,
        vehicalownerid:selectedType.vo_id
      });
    } else {
      setFormData({
        ...formData,
        truckNo: "",
        ownerAddress: "",
        vehicleOwner: "",
        telephoneno: "",
        vehicalownerid:""
      });
    }
  };
  const handleAutocompleteChangeDriver = (event, value) => {
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        driverName: "This Field is required",
      }));
    }
    const selectedType = driver.find((type) => type.driver_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        driverName: selectedType.driver_id,
        licenseNo: selectedType.licenseno,
        mobileNo: selectedType.mobileno,
      });
    } else {
      setFormData({
        ...formData,
        driverName: "",
        licenseNo: "",
        mobileNo: "",
      });
    }
  };
  const handleAutocompleteChangefrom = (event, value) => {
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
  const handleChanges = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAutocompleteChangepayableat = (event, value) => {
    const selectedType = branch.find((type) => type.branch_name === value);
    if (selectedType) {
      setFormData({
        ...formData,
        payableAt: selectedType.branch_id,
      });
    } else {
      setFormData({
        ...formData,
        payableAt: "",
      });
    }
  };
  const handleFreightDetails = (
    formState,
    rows,
    showAmtChecked,
    Lrnodetails
  ) => {
    setFreightDetails({
      formState: formState,
      rows: rows,
      showAmtChecked: showAmtChecked,
    });
    setLrnodetails(Lrnodetails);
  };
  const handlebranchwisepayment = (formData, rows,checkboxes) => {
   
    setbranchwisepayment({
      formData: formData,
      rows: rows,
      checkboxes:checkboxes
    });
  };
  const validation = () => {
    if (freightDetails.rows.length === 0) {
      setConfirmmessage("Select AtLeast One LR");
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: "warning",
      //   title: "Warning",
      //   text: "Select AtLeast One LR",
      // });
      return false;
    }
    return true;
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.truckNo) {
      isValid = false;
      newErrors.truckNo = "This Field is required";
    }

    if (!formData.driverName) {
      isValid = false;
      newErrors.driverName = "This Field is required";
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
      formData.truckNo === "" ||
      formData.driverName === "" ||
      formData.to === ""
    ) { 
      setConfirmmessage("Fill the mandatory fields");
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: "warning", // Corrected typo here
      //   title: "Something Went Wrong!",
      //   text: "Fill the mandatory fields",
      // });
    }
  };
  const handleSave = async () => {
    alertmessgae();
    if (validateForm()) {
      if (!validation()) {
        return;
      }
      setIsLoading(true);
      try {
        localStorage.setItem("formdatavehicalownerid",formData.vehicalownerid)
        const combinedData = {
          ...formData,
          freightDetails: freightDetails,
          freightDetailsrows: freightDetails.rows,
          branchwisepayment: branchwisepayment,
          in_lrtoshowamount: freightDetails.showAmtChecked,
          branchwisepaymentrows: branchwisepayment.rows,
          in_user_id: user.id,
          in_branch: user.branch,
        };

        const response = await Updatedcmaster(id, combinedData);
        if (branchwisepayment.checkboxes.emailowner == true){
        
          const vehicalownerid=localStorage.getItem("formdatavehicalownerid")
       
          handleEmail(vehicalownerid,id)
        }
        if(branchwisepayment.checkboxes.print == true){
          handlePrint(id)
          setConfirmmessage(response.data.message);
          setConfirmationopen(true);
          setColor('success')
        }
        //  Swal.fire({
        //    icon: "success",
        //   title: "Updated Successfull",
        //    text: response.data.message,
        // });

        setSavetrigger(true);
       // navigate("/loading_trip");
      } catch (error) {
        console.error("Error saving article:", error);
        setConfirmmessage(error.response.data);
          setConfirmationopen(true);
          setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Something Went Wrong!",
        //   text: error.response.data,
        // });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleEmail = async (owenerid,id) => {
    setIsLoading(true);
    try {
     
      const response = await getOweneremail(owenerid);
      const { data } = response;
      
      if (data && data.length > 0 && data[0].emailid) {

         localStorage.setItem("tomailowener",data[0].emailid)
        setEmailForm(prevState => ({
          ...prevState,
          id: id,
          toEmail: data[0].emailid
        }));
        
        const response1 = await getLoadingTripByIdPdfmail(id);
        const returnpath = response1.data.returnpath;
        const fileName = returnpath.split("/").pop();
        console.log("fileName",fileName)
        localStorage.setItem("messageowener",`Please find the attached file: ${fileName}`)
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
      setIsLoading(false);
    }
  };
  let pdfpathfile;
  const sendEmail = async (id) => {
    console.log(emailForm);
    setIsLoading(true);
    try {
      const response = await getLoadingTripByIdPdfmail(id);

      const pdfpath = response.data.returnpath;
  
      pdfpathfile = pdfpath;
      if (pdfpath) {
        console.log(pdfpath);
        setEmailForm({
          ...emailForm,
        });
        const emailid=localStorage.getItem("dcid")
        const tomail=localStorage.getItem("tomailowener")
      const message= localStorage.getItem("messageowener")
        const options = {
          pdfpathfile,
          emailForm:{
            id:parseInt(emailid),
            toEmail:tomail,
            message:message
                      },
        };
        const response = await sendMail(options);
      console.log("response",response)
        if (response.status == 200) {
          localStorage.removeItem("dcid");
          localStorage.removeItem("tomailowener");
          localStorage.removeItem("messageowener");
        } else {
          setConfirmmessage("Something went wrong!");
          setConfirmationopen(true);
          setColor('error')

          // Swal.fire({
          //   icon: "error",
          //   title: "Something went wrong!",
          // });
       
        }
      }
    } catch (error) {
      console.error("Error saving article:", error);
      // Handle error
    } finally {
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
          freightDetails: freightDetails,
          freightDetailsrows: freightDetails.rows,
          branchwisepayment: branchwisepayment,
          in_lrtoshowamount: freightDetails.showAmtChecked,
          branchwisepaymentrows: branchwisepayment.rows,
          in_user_id: user.id,
          in_branch: user.branch,
        };

        const response = await Updatedcmaster(id, combinedData);
        console.log(response);
        // Swal.fire({
        //   icon: "success",
        //   title: "Update Successful",
        //   text: response.data.message,
        // })
        setConfirmmessage(response.data.message);
        setConfirmationopen(true);
        setColor('success')
          if (id) {
            handlePrint(id);
          }
      

        setSavetrigger(true);
      } catch (error) {
        console.error("Error saving article:", error);
        setConfirmmessage(error.response.data);
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Something Went Wrong!",
        //   text: error.response.data,
        // });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handlePrint = async (id) => {
    setIsLoading(true);
    try {
      const response2 = await getLoadingTripByIdPdfmail(id);
      const pdfData = response2.data.returnpath;
      console.log("pdfData", pdfData);
      setPdfData(pdfData);

      //  setIsLoading(true)
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
      setOpen(true);
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={5}>
            <Autocomplete
              id="branchId"
              options={branch?.map((type) => type.branch_name) || []}
              value={
                formData.branchId
                  ? branch.length > 0
                    ? branch.find((p) => p.branch_id == formData.branchId)
                        ?.branch_name || ""
                    : ""
                  : ""
              }
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ width: "40%" }}
                  name="branchId"
                  variant="outlined"
                  label="Branch:"
                  size="small"
                  
                />
              )}
              onChange={(event, value) => handleChange(event, value)}
            />
          </Grid>

          <Grid item xs={6}>
            <h1>Loading Trip Sheet</h1>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: 16 }}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                
                  <TextField
                    id="challanNo-input"
                    name="challanNo"
                    value={formData.challanNo}
                    onChange={handleChange}
                    label="Challan No:"
                    fullWidth
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item xs={2}>
              
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(formData.date) || null}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            placeholder: "Date",
                            size: "small",
                            name: "date",
                            label:"Date"
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
            
                  {vehicle && (
                    <Autocomplete
                      id="truckNo"
                      options={vehicle?.map((type) => type.vehicleno) || []}
                      value={
                        formData.truckNo
                          ? vehicle.length > 0
                            ? vehicle.find(
                                (p) => p.vehicle_id == formData.truckNo
                              )?.vehicleno || ""
                            : ""
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
                          error={Boolean(errors.truckNo)}
                          helperText={errors.truckNo}
                        />
                      )}
                      onChange={(event, value) =>
                        handleAutocompleteChangeVehicle(event, value)
                      }
                    />
                  )}
                </Grid>
                <Grid item xs={2}>
            
                  <TextField
                    id="vehicleOwner-input"
                    name="vehicleOwner"
                    value={formData.vehicleOwner}
                    onChange={handleChange}
                    label="Vehicle Owner:"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                 
                  <TextField
                    id="ownerAddress-input"
                    name="ownerAddress"
                    value={formData.ownerAddress}
                    onChange={handleChange}
                    label="Owner Address:"
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={2}>
               
                  <TextField
                    id="ownerContact-input"
                    name="ownerContact"
                    value={formData.ownerContact}
                    onChange={handleChange}
                    label="Contact:"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={2}>
            
                  <Autocomplete
                    id="driverName"
                    options={driver?.map((type) => type.driver_name) || []}
                    value={
                      formData.driverName
                        ? driver && driver.length > 0
                          ? driver.find(
                              (p) => p.driver_id == formData.driverName
                            )?.driver_name || ""
                          : ""
                        : ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="driverName"
                        variant="outlined"
                        label="Driver Name:"
                        size="small"
                        fullWidth
                        error={Boolean(errors.driverName)}
                        helperText={errors.driverName}
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangeDriver(event, value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                 
                  <TextField
                    id="licenseNo-input"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    label="License no:"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={2}>
                
                  <TextField
                    id="mobileNo-input"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    label="Mobile no :"
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={2}>
          
                  <Autocomplete
                    id="Customer"
                    options={place?.map((type) => type.place_name) || []}
                    value={
                      formData.from
                        ? place && place.length > 0
                          ? place.find((p) => p.place_id == formData.from)
                              ?.place_name || ""
                          : ""
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
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangefrom(event, value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
         
                  <Autocomplete
                    id="Customer"
                    options={place?.map((type) => type.place_name) || []}
                    value={
                      formData.to
                        ? place && place.length > 0
                          ? place.find((p) => p.place_id == formData.to)
                              ?.place_name || ""
                          : ""
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
            </Paper>

            <Grid
              container
              spacing={2}
              style={{ marginTop: 16 }}
              alignItems="center"
              justifyContent="center"
            >
              <FreightDetails
                handleFreightDetails={handleFreightDetails}
                isedit={isedit}
              />
            </Grid>

            <Paper elevation={3} style={{ padding: 16, marginTop: 16 }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
               
                  <Autocomplete
                    id="Customer"
                    options={
                      branch ? branch.map((type) => type.branch_name) : []
                    }
                    value={
                      formData.payableAt
                        ? branch.length > 0 &&
                          branch.find((p) => p.branch_id == formData.payableAt)
                            ?.branch_name
                        : ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="payableAt"
                        variant="outlined"
                        label="Payable At:"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangepayableat(event, value)
                    }
                  />
                </Grid>

                <Grid item xs={6}>
          
                  <TextField
                    id="remark-input"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChanges}
                    label="Remark"
                    size="small"
                    fullWidth
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
              <BranchWisePayment
                branch={branch}
                handlebranchwisepayment={handlebranchwisepayment}
                isedit={isedit}
                Lrnodetails={Lrnodetails}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handlecancel}
              >
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

export default EditLodingTrip;
