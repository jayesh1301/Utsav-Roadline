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
  IconButton,
  Dialog,
  DialogActions,
  styled,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  Aaddbillmasterddlr,
  SelectBranch,
  billforExcel,
  billforprint,
  getLorryMasterListForBill,
  getbillbyid,
  getlrdetailsbyid,
  mailbill,
  sendMail,
} from "../../../lib/api-bill-list";
import { getAllCustomers } from "../../../lib/api-customer";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import { utils, writeFile } from "xlsx";
import InputAdornment from '@mui/material/InputAdornment';
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
const NewBill = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userId = user.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(user.branch);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billType, setBillType] = useState("TBB");
  const [lrNoOptions, setLrNoOptions] = useState([]);
  const [selectedLrId, setSelectedLrId] = useState(null);
  const [customerGST, setCustomerGST] = useState("");
  const [selectedLrNo, setSelectedLrNo] = useState(null);
  const [selectedLrDate, setSelectedLrDate] = useState(null);
  const [weight, setWight] = useState("");
  const [tabledate, setTableDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consignor, setConsignor] = useState("");
  const [consignee, setConsignee] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [gstPayableBy, setGstPayableBy] = useState("");
  const [totalArticle, setTotalArticle] = useState("");
  const [finalTotal, setFinalTotal] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [delChar, setDelChar] = useState("");
  const [Hamali, setHamali] = useState("");
  const [ServiceChar, setServiceChar] = useState("");
  const [otherChar, setOtherChar] = useState("");
  const [Demurage, setDemurage] = useState("");
  const [remark, setRemark] = useState("");
  const [rows, setRows] = useState([]);
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [newFile, setNewfile] = useState(null);
  const [errors, setErrors] = useState({
    selectedBranch:""
  });

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')



  const [formValues, setFormValues] = useState({
    freight: 0,
    weightCharge: 0,
    hamali: 0,
    otherCharge: 0,
    collection: 0,
    statistical: 0,
    doorDelivery: 0,
    gst: 0,
  });
  const [checkboxes, setCheckboxes] = useState({
    whatsapp: false,
    customer: false,
    print: true,
  });
  const [totals, setTotals] = useState({
    totalFreight: "",
    totalWeightCharge: "",
    totalHamali: "",
    totalOtherCharge: "",
    totalCollection: "",
    totalStatistical: "",
    totalDoorDelivery: "",
    totalGST: "",
    grandTotal: "",
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await SelectBranch();
        const { data } = response;
        const branchList = data.map((branch) => ({
          branch_id: branch.branch_id,
          branch_name: branch.branch_name,
        }));
        setBranchOptions(branchList);
        const userBranch = branchList.find((b) => b.branch_id == user.branch);
        if (userBranch) {
          setSelectedBranch(userBranch);
        }
      } catch (error) {
        console.error("Failed to fetch branch options:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers();
        setCustomerOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch customer options:", error);
      }
    };

    fetchBranches();
    fetchCustomers();
  }, []);

  const fetchLrNoOptions = async () => {
    if (selectedCustomer && billType) {
      setIsLoading(true);
      try {
        const response = await getLorryMasterListForBill(
          selectedCustomer.customer_id,
          billType
        );
        console.log("datahaaj",response.data)
        setLrNoOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch LR No options:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchLrNoOptions();
  }, [selectedCustomer, billType]);

  const fetchLrDetails = async () => {
    if (selectedCustomer && billType && selectedLrId) {
      setIsLoading(true);
      try {
        const response = await getlrdetailsbyid(
          selectedLrId,
          selectedCustomer.customer_id
        );
        const data = response.data;
       
        setSelectedLrDate(dayjs(data.lrdate, "DD-MM-YYYY"));
        setTableDate(data.lrdate);
        setConsignor(data.consignor_name);
        setConsignee(data.customer_name);
        setFromLocation(data.loc_from_name);
        setToLocation(data.loc_to_name);
        setGstPayableBy(data.gst_pay_by);
        setTotalArticle(data[`SUM(tlr.no_of_articles)`]);
        setWight(data[`SUM(tlr.actual_wt)`]);
        setSelectedLrNo(data.lrno);
        setFormValues((prevValues) => ({
          ...prevValues,
          freight: data.freight || 0,
          collection: data.collection || 0,
          hamali: data.hamali || 0,
          statistical: data.statatical || 0,
          doorDelivery: data.delivery || 0,
          otherCharge: data.other_charges || 0,
          weightCharge: data.wt_charges || 0,
        }));
      } catch (error) {
        console.error("Failed to fetch LR details:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLrDetails();
  }, [selectedCustomer, billType, selectedLrId]);

  const handleBranchChange = (event, value) => {
    if(value === "" ){
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
    setSelectedBranch(value);
  };

  const handleCustomerChange = (event, value) => {
    setSelectedCustomer(value);
    if (value) {
      setCustomerGST(value.gstno);
    } else {
      setCustomerGST("");
    }
    resetFormFields();
  
  };

  const handleBillTypeChange = (event) => {
    setBillType(event.target.value);
  };

  const handleLrNoChange = (event, newValue) => {
    setAutocompleteValue(newValue);
    if (newValue) {
      setSelectedLrNo(newValue.lr_no);
      setSelectedLrId(newValue.id);
    } else {
      setSelectedLrNo("");
      setSelectedLrId("");
    }
  };

  const handleClose = () => {
    setOpen(false)
     navigate("/Bill-List");
  };
  useEffect(() => {
    const calculateTotals = () => {
      const {
        freight,
        weightCharge,
        hamali,
        otherCharge,
        collection,
        statistical,
        doorDelivery,
        gst,
      } = formValues;
      const freightValue = parseFloat(freight) || 0;
      const weightChargeValue = parseFloat(weightCharge) || 0;
      const hamaliValue = parseFloat(hamali) || 0;
      const otherChargeValue = parseFloat(otherCharge) || 0;
      const collectionValue = parseFloat(collection) || 0;
      const statisticalValue = parseFloat(statistical) || 0;
      const doorDeliveryValue = parseFloat(doorDelivery) || 0;
      const gstValue = parseFloat(gst) || 0;
      const grandTotal =
        freightValue +
        weightChargeValue +
        hamaliValue +
        otherChargeValue +
        collectionValue +
        statisticalValue +
        doorDeliveryValue +
        gstValue;
      setTotals({
        grandTotal: grandTotal.toFixed(2),
      });
    };

    calculateTotals();
  }, [formValues]);

  useEffect(() => {
    const calculatedTotalAmount = calculateTotalAmount();
    setFinalTotal(calculatedTotalAmount);
  }, [rows]);

  const calculateTotalAmount = () => {
    let total = 0;
    rows.forEach((row) => {
      total += parseFloat(row.Amount);
    });
    return total;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const columns = [
    { field: "sn", headerName: "SN", flex: 1 },
    { field: "Description", headerName: "Description", flex: 1 },
    { field: "Article", headerName: "Article", flex: 1 },
    { field: "Weight", headerName: "Weight", flex: 1 },
    { field: "GCNNoandDate", headerName: "GCN No & Date", flex: 5 },
    { field: "table_lr_hamali", headerName: "Hamali", flex: 1 },
    { field: "Amount", headerName: "Amount", flex: 1 },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleTdsInputChange = (event) => {
    const { value } = event.target;
    setTdsPercentage(value);
  };
  useEffect(() => {
    const calculateTotalAmount = () => {
      const finalTotalValue = parseFloat(finalTotal) || 0;
      const tdsAmount = (finalTotalValue * tdsPercentage) / 100;
      const delCharAmount = parseFloat(delChar) || 0;
      const hamaliAmount = parseFloat(Hamali) || 0;
      const serviceCharAmount = parseFloat(ServiceChar) || 0;
      const otherCharAmount = parseFloat(otherChar) || 0;
      const demurageAmount = parseFloat(Demurage) || 0;
      const totalAmount =
        finalTotalValue -
        tdsAmount +
        delCharAmount +
        hamaliAmount +
        serviceCharAmount +
        otherCharAmount +
        demurageAmount;
      return totalAmount.toFixed(2);
    };

    const totalAmt = calculateTotalAmount();
    setTotalAmt(totalAmt);
  }, [
    finalTotal,
    tdsPercentage,
    delChar,
    Hamali,
    ServiceChar,
    otherChar,
    Demurage,
  ]);

  const handleDelCharChange = (event) => {
    const { value } = event.target;
    setDelChar(value);
  };
  const handleHamaliChange = (event) => {
    const { value } = event.target;
    setHamali(value);
  };

  const handleServiceCharChange = (event) => {
    const { value } = event.target;
    setServiceChar(value);
  };

  const handleOtherCharChange = (event) => {
    const { value } = event.target;
    setOtherChar(value);
  };

  const handleDemurageChange = (event) => {
    const { value } = event.target;
    setDemurage(value);
  };

  const handleEdit = (id) => {
    const index = rows.findIndex((row) => row.id === id);
    if (index !== -1) {
      const selectedRow = rows[index];
      setSelectedLrId(selectedRow.id);
      setFormValues({
        freight: selectedRow.table_lr_freight,
        weightCharge: selectedRow.table_lr_wtcharges,
        hamali: selectedRow.table_lr_hamali,
        otherCharge: selectedRow.table_lr_otherchar,
        collection: selectedRow.collection,
        statistical: selectedRow.table_lr_statistical,
        doorDelivery: selectedRow.table_lr_delivery,
        gst: selectedRow.table_lr_gst_amount,
      });
      setTotals({
        grandTotal: selectedRow.Amount,
      });
      const matchingLrNo = lrNoOptions.find(
        (option) => option.id === selectedRow.id
      );
      setAutocompleteValue(matchingLrNo);
      setEditMode(true);
      setEditRowIndex(index);
    }
  };

  const resetFormFields = () => {
    setFormValues({
      freight: "",
      weightCharge: "",
      hamali: "",
      otherCharge: "",
      collection: "",
      statistical: "",
      doorDelivery: "",
      gst: "",
    });
    setTotals({
      grandTotal: "",
    });
    setSelectedLrId("");
    setSelectedLrNo("");
    setSelectedLrDate(null);
    setTableDate(null);
    setConsignor("");
    setConsignee("");
    setFromLocation("");
    setToLocation("");
    setGstPayableBy("");
    setTotalArticle("");
    setWight("");
    setAutocompleteValue(null);
  };

  const handleDelete = (id) => {
    const index = rows.findIndex((row) => row.id === id);
    if (index !== -1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    } else {
      console.warn(`Row with ID ${id} not found.`);
    }
  };
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      in_bill_date: dayjs(date).format("YYYY-MM-DD"),
    });
  };
  const [formData, setFormData] = useState({
    in_bill_date: dayjs(selectedDate).format("YYYY-MM-DD"),
    bill_no: "",
  });
  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    });
  };
  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddButtonClick = () => {
    if (!selectedLrNo) {
      setConfirmmessage( "Please select an LR before adding to the table.");
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: "warning",
      //   title: "No LR Selected",
      //   text: "Please select an LR before adding to the table.",
      // });
      return;
    }

    const isDuplicateLrNo = rows.some(
      (row, index) =>
        row.table_lr_no === selectedLrNo &&
        (!editMode || index !== editRowIndex)
    );

    if (isDuplicateLrNo) {
      // Show a message if the LR No is already added
      setConfirmmessage("This LR No is already added to the table.");
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: "warning",
      //   title: "Duplicate LR No",
      //   text: "This LR No is already added to the table.",
      // });
      return; // Prevent adding the duplicate LR No
    }

    const description = `${fromLocation} to ${toLocation}`;
    const newRow = {
      id: selectedLrId,
      sn: rows.length + 1,
      Description: description,
      Article: totalArticle,
      Weight: weight,
      GCNNoandDate: `${selectedLrNo} ${tabledate}`,
      table_lr_hamali: formValues.hamali,
      Amount: totals.grandTotal,
      table_lr_from: fromLocation,
      table_lr_to: toLocation,
      table_lr_no: selectedLrNo,
      table_lr_consignee: consignee,
      table_lr_consignor: consignor,
      table_lr_date: tabledate,
      table_lr_delivery: formValues.doorDelivery,
      table_lr_collection: formValues.collection,
      table_lr_freight: formValues.freight,
      table_lr_gst_amount: formValues.gst,
      table_lr_gstpayby: gstPayableBy,
      table_lr_otherchar: formValues.otherCharge,
      table_lr_statistical: formValues.statistical,
      table_lr_wtcharges: formValues.weightCharge,
      table_gstn: customerGST,
      options: "",
    };

    console.log("Adding to table:", newRow);
    if (editMode) {
      const updatedRows = [...rows];
      updatedRows[editRowIndex] = newRow;
      setRows(updatedRows);

      setEditMode(false);
      setEditRowIndex(null);
    } else {
      setRows([...rows, newRow]);
    }

    setFinalTotal(totals.grandTotal);
    resetFormFields();
  };
  const handlereset=()=>{
    setSelectedCustomer(null)
    setRows([])
    setRemark("")
  }
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!selectedBranch) {
      isValid = false;
      newErrors.selectedBranch = "This Field is required";
    }
    
    setErrors(newErrors);
    return isValid;
  };
  const alertmessgae = () => {
    if (
      selectedBranch === "" || selectedBranch === null || selectedBranch === undefined
    ) {
      setConfirmmessage('Fill the mandatory fields');
      setConfirmationopen(true);
      setColor('warning')
     
    }
  };
  const handleAddBill = async () => {
    alertmessgae();
    if (validateForm()) {
    try {
      if (rows.length === 0) {
        setConfirmmessage("Please select at least one LR before adding the bill.");
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Please select at least one LR before adding the bill.",
        // });
        return;
      }

      console.log(rows);
      const billDetails = rows.map((row) => ({
        table_lr_totart: row.Article,
        table_lr_totwt: row.Weight,
        table_lr_hamali: row.table_lr_hamali,
        table_lr_collection: row.table_lr_collection,
        table_lr_total: row.Amount,
        table_lr_from: row.table_lr_from,
        table_lr_to: row.table_lr_to,
        table_lr_no: row.table_lr_no,
        table_lr_id: row.id,
        table_lr_consignee: row.table_lr_consignee,
        table_lr_consignor: row.table_lr_consignor,
        table_lr_date: row.table_lr_date,
        table_lr_delivery: row.table_lr_delivery,
        table_lr_freight: row.table_lr_freight,
        table_lr_gst_amount: row.table_lr_gst_amount,
        table_lr_gstpayby: row.table_lr_gstpayby,
        table_lr_otherchar: row.table_lr_otherchar,
        table_lr_statistical: row.table_lr_statistical,
        table_gstn: row.table_gstn,
        table_lr_wtcharges: row.table_lr_wtcharges,
      }));

      const dataToSend = {
        ...formData,
        bill_details: billDetails,
        bill_type: billType,
        branch: selectedBranch ? selectedBranch.branch_id : null,
        customer_id: selectedCustomer ? selectedCustomer.customer_id : null,
        del_char: delChar,
        demurage: Demurage,
        other_ch: otherChar,
        remarks: remark,
        service_ch: ServiceChar,
        tds: tdsPercentage,
        tot_amount: totalAmt,
        tot_freight: finalTotal,
        tot_hamali: Hamali,
        tot_tax: totalSTax || null,
        user_id: userId,
      };

      const response = await Aaddbillmasterddlr(dataToSend);
      
    const id = response.data.inserted_id;
    localStorage.setItem("billid",id)
      console.log(response);
      if(checkboxes.customer == true){
        localStorage.setItem("tomailCustomer",selectedCustomer.emailid)
       const Customer= localStorage.getItem("tomailCustomer")
       handleEmail(Customer,id)
      }
      if(checkboxes.print == true){
        handleView(id);

      }
      const message = response.data.message;
      // Swal.fire({
      //   icon: "success",
      //   title: "Success",
      //   text: message,
      // }).then(() => {
      //   // Redirect to another page after showing success message
      //   // navigate("/Bill-List");
        
      // });
      
      setConfirmmessage(message);
      setConfirmationopen(true);
      setColor('success')
      handlereset()
    } catch (error) {
      // Handle error here
      console.error("Error adding bill:", error);
      setConfirmmessage("Failed to add bill. Please try again later.");
      setConfirmationopen(true);
      setColor('error')
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Failed to add bill. Please try again later.",
      // });
    }
    }
  };
  const handleEmail = async (Customer,id) => {
    setIsLoading(true);
    try {
      if (Customer) {
       
        const response = await billforprint(id);
        const returnpath = response.data.returnPath;
       
        const fileName = returnpath.split("/").pop();
  
        localStorage.setItem("messagecustomer",`Please find the attached file: ${fileName}`)
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
      const response = await mailbill(id);
      const pdf = response.data.returnPath;
      pdfpathfile = pdf;

      if (pdf) {
    
        setEmailForm({
          ...emailForm,
        });
        const emailid=localStorage.getItem("billid")
        const tomail=localStorage.getItem("tomailCustomer")
      const message= localStorage.getItem("messagecustomer")
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
          
          localStorage.removeItem("billid");
          localStorage.removeItem("tomailCustomer");
          localStorage.removeItem("messagecustomer");
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
  const handleAddBillWithExcel = async () => {
    try {
      if (rows.length === 0) {
        setConfirmmessage("Please select at least one LR before adding the bill.");
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Please select at least one LR before adding the bill.",
        // });
        return;
      }

      const billDetails = rows.map((row) => ({
        table_lr_totart: row.Article,
        table_lr_totwt: row.Weight,
        table_lr_hamali: row.table_lr_hamali,
        table_lr_collection: row.table_lr_collection,
        table_lr_total: row.Amount,
        table_lr_from: row.table_lr_from,
        table_lr_to: row.table_lr_to,
        table_lr_no: row.table_lr_no,
        table_lr_id: row.id,
        table_lr_consignee: row.table_lr_consignee,
        table_lr_consignor: row.table_lr_consignor,
        table_lr_date: row.table_lr_date,
        table_lr_delivery: row.table_lr_delivery,
        table_lr_freight: row.table_lr_freight,
        table_lr_gst_amount: row.table_lr_gst_amount,
        table_lr_gstpayby: row.table_lr_gstpayby,
        table_lr_otherchar: row.table_lr_otherchar,
        table_lr_statistical: row.table_lr_statistical,
        table_lr_wtcharges: row.table_lr_wtcharges,
      }));

      // Proceed with bill addition
      const dataToSend = {
        ...formData,
        bill_details: billDetails,
        bill_type: billType,
        branch: selectedBranch ? selectedBranch.branch_id : null,
        customer_id: selectedCustomer ? selectedCustomer.customer_id : null,
        del_char: delChar,
        demurage: Demurage,
        other_ch: otherChar,
        remarks: remark,
        service_ch: ServiceChar,
        tds: tdsPercentage,
        tot_amount: totalAmt,
        tot_freight: finalTotal,
        tot_hamali: Hamali,
        tot_tax: totalSTax || null,
        user_id: userId,
      };

      const response = await Aaddbillmasterddlr(dataToSend);
      const insertedId = response.data.inserted_id;
      const message = response.data.message;
      const billResponse = await billforExcel(insertedId);
      console.log(billResponse);
      const billData = billResponse.data.bill;
      const {
        bill_no,
        bill_date,
        customer_name,
        customer_address,
        customer_gst_no,
        total_freight,
        total_amount,
        cc_charge,
        hamali,
        other_charges,
        total_amount_words,
      } = billData;
      const details = Array.isArray(billResponse.data.details)
        ? billResponse.data.details
        : [];

      console.log(billData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonText: "Export to Excel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Create a new workbook and add the data to it
          const workbook = utils.book_new();

          // Create the header row
          const header = [
            ["", "", "", "", "", "", "Frieght Bill", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            [
              `To: ${customer_name}`,
              "",
              "",
              "",
              "",
              "",
              "",
              `Bill No: ${bill_no}`,
              "",
              "",
              "",
            ],
            [
              `Address: ${customer_address}`,
              "",
              "",
              "",
              "",
              "",
              "",
              `Date: ${bill_date}`,
              "",
              "",
              "",
            ],
            [
              `GST No: ${customer_gst_no}`,
              "",
              "",
              "",
              "",
              "",
              "",
              `GST IN:27AFWPB6409B1ZJ	`,
              "",
              "",
              "",
            ],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
          ];

          // Convert bill details to worksheet format
          const worksheetData = [
            ...header,
            [
              "LR No.",
              "Date",
              "To Place",
              "INV No",
              "Vehicle No",
              "Consignee",
              "Article",
              "Weight",
              "Freight",
              "Hamali",
              "Other",
              "Amount",
            ],
            ...details.map((row) => [
              row.lr_no,
              row.lr_date,
              row.place_name,
              row.consignote,
              row.truck_tempo_number,
              row.customer_name,
              row.no_of_articles,
              row.char_weight,
              row.freight,
              row.hamali,
              row.other_charges,
              row.total,
            ]),
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            [
              "",
              "Freight:",
              `${total_freight}`,
              "Charges:",
              `${cc_charge}`,
              "Hamali:",
              `${hamali}`,
              "Charges:",
              `${other_charges}`,
              "Total:",
              `${total_amount}`,
              "",
            ],
            [
              "",
              "In Words:",
              `${total_amount_words}`,
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              "",
              "Bank Details:",
              "Corporation Bank",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              "",
              "Branch:",
              "Pune - Viman Nagar Brnach (0739), Pune-411014",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              "",
              "Account Number:",
              "510101003835005",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              "",
              "IFSC CODE:",
              "CORP0000739",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            [
              "",
              "Remark:",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "For Rajesh Transport",
              "",
              "",
            ],
          ];

          const worksheet = utils.aoa_to_sheet(worksheetData);
          utils.book_append_sheet(workbook, worksheet, "BillReceipt");

          // Export the workbook to a file
          writeFile(workbook, "BillReceipt.xlsx");

          console.log("Bill details exported to Excel.");
          navigate("/Bill-List");
        }
      });
    } catch (error) {
      console.error("Error adding bill:", error);
      setConfirmmessage("Failed to add bill. Please try again later.");
      setConfirmationopen(true);
      setColor('error')
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Failed to add bill. Please try again later.",
      // });
    }
  };

  const handleAddBillWithPRint = async () => {
    try {
      if (rows.length === 0) {
        setConfirmmessage("Please select at least one LR before adding the bill.");
      setConfirmationopen(true);
      setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Please select at least one LR before adding the bill.",
        // });
        return;
      }
      setIsSubmitting(true);
      const billDetails = rows.map((row) => ({
        table_lr_totart: row.Article,
        table_lr_totwt: row.Weight,
        table_lr_hamali: row.table_lr_hamali,
        table_lr_collection: row.table_lr_collection,
        table_lr_total: row.Amount,
        table_lr_from: row.table_lr_from,
        table_lr_to: row.table_lr_to,
        table_lr_no: row.table_lr_no,
        table_lr_id: row.id,
        table_lr_consignee: row.table_lr_consignee,
        table_lr_consignor: row.table_lr_consignor,
        table_lr_date: row.table_lr_date,
        table_lr_delivery: row.table_lr_delivery,
        table_lr_freight: row.table_lr_freight,
        table_lr_gst_amount: row.table_lr_gst_amount,
        table_lr_gstpayby: row.table_lr_gstpayby,
        table_lr_otherchar: row.table_lr_otherchar,
        table_lr_statistical: row.table_lr_statistical,
        table_lr_wtcharges: row.table_lr_wtcharges,
      }));

      const dataToSend = {
        ...formData,
        bill_details: billDetails,
        bill_type: billType,
        branch: selectedBranch ? selectedBranch.branch_id : null,
        customer_id: selectedCustomer ? selectedCustomer.customer_id : null,
        del_char: delChar,
        demurage: Demurage,
        other_ch: otherChar,
        remarks: remark,
        service_ch: ServiceChar,
        tds: tdsPercentage,
        tot_amount: totalAmt,
        tot_freight: finalTotal,
        tot_hamali: Hamali,
        tot_tax: totalSTax || null,
        user_id: userId,
      };

      const response = await Aaddbillmasterddlr(dataToSend);
      const message = response.data.message;
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
      }).then(() => {
        console.log(
          "Bill added successfully with the following details:",
          dataToSend
        );

        handleView(response.data.inserted_id);
      });
      setIsSubmitting(true);
    } catch (error) {
      console.error("Error adding bill:", error);
      setConfirmmessage("Failed to add bill. Please try again later.");
      setConfirmationopen(true);
      setColor('error')
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Failed to add bill. Please try again later.",
      // });
      setIsSubmitting(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await billforprint(id);
      const pdf = response.data.returnPath;
      setPdfData(pdf);
    } catch (error) {
      console.error("Failed to fetch bill details for print:", error);
    } finally {
      setOpen(true);
    }
  };

  const handleClosePrint = () => {
    setNewfile(null);
    setPdfData(null);
    // setSelectedInvoiceId(null);
    setOpen(false);
    //setOpen1(false);
    //navigate("/Bill-List");
    setIsSubmitting(false);
  };
  const [totalSTax, setTotalSTax] = useState();

  const handleTotalSTaxChange = (event) => {
    setTotalSTax(event.target.value);
  };

  return (
    <>
    <CustomSnackbar
    open={isConfirmationopen}
    message={confirmmessage}
    onClose = {()=> setConfirmationopen(false)}
    color={color}
    />
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      {isLoading && <LoadingSpinner />}
      <Grid item xs={5}>
        <Autocomplete
          sx={{ width: "40%" }}
          options={branchOptions}
          getOptionLabel={(option) => option.branch_name}
          value={selectedBranch}
          onChange={handleBranchChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Branch:"
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
        <h1>Bill Details</h1>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 10 }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={2}>
              <TextField
                label="Bill No"
                fullWidth
                size="small"
                value={formData.bill_no}
                onChange={handleInput}
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth size="small">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="inBillDate"
                    name="in_bill_date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                    placeholder="Select Date"
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "Date",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth size="small">
                <InputLabel htmlFor="bill-type-selector">Bill Type</InputLabel>
                <Select
                  id="bill-type-selector"
                  value={billType}
                  label="Bill Type"
                  onChange={handleBillTypeChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Select Type</em>
                  </MenuItem>
                  <MenuItem value="TBB">TBB</MenuItem>
                  <MenuItem value="To Pay">To Pay</MenuItem>
                  <MenuItem value="Material Inward">Material Inward</MenuItem>
                  <MenuItem value="Third Party">Third Party</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                id="customer-autocomplete"
                options={customerOptions}
                getOptionLabel={(option) => option.customer_name}
                value={selectedCustomer}
                onChange={handleCustomerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Name"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                id="vendor-code-input"
                label="Vendor Code"
                placeholder="Vendor Code"
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "2px" }}
      >
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 10 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Autocomplete
                  id="lr-no-autocomplete"
                  options={lrNoOptions}
                  getOptionLabel={(option) => `${option.lr_no}`}
                  value={autocompleteValue} // Set value from state
                  onChange={handleLrNoChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="LR No"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      id="lr-date-picker"
                      value={selectedLrDate}
                      onChange={(date) => setSelectedLrDate(date)}
                      disabled
                      slotProps={{
                        textField: {
                          size: "small",
                          disabled: true,
                          label: "LR Date",
                        },
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="consignor-input"
                  label="Consignor"
                  fullWidth
                  size="small"
                  value={consignor}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="consignee-input"
                  label="Consignee"
                  fullWidth
                  size="small"
                  value={consignee}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="from-input"
                  label="From"
                  fullWidth
                  size="small"
                  value={fromLocation}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="to-input"
                  label="To"
                  fullWidth
                  size="small"
                  value={toLocation}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="gst-no-input"
                  label="GST No"
                  fullWidth
                  size="small"
                  value={customerGST}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="gst-payable-by-input"
                  label="GST Payable By:"
                  fullWidth
                  size="small"
                  value={gstPayableBy}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: 10 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="freight-input"
                  name="freight"
                  label="Freight"
                  fullWidth
                  size="small"
                  value={formValues.freight}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}

                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="weight-charge-input"
                  name="weightCharge"
                  label="Weight Charge"
                  fullWidth
                  size="small"
                  value={formValues.weightCharge}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="hamali-input"
                  name="hamali"
                  label="Hamali"
                  fullWidth
                  size="small"
                  value={formValues.hamali}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="other-charge-input"
                  name="otherCharge"
                  label="Other Charge"
                  fullWidth
                  size="small"
                  value={formValues.otherCharge}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="collection-input"
                  name="collection"
                  label="Collection"
                  fullWidth
                  size="small"
                  value={formValues.collection}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="statistical-input"
                  name="statistical"
                  label="LR Charges"
                  fullWidth
                  size="small"
                  value={formValues.statistical}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="door-delivery-input"
                  name="doorDelivery"
                  label="Door Delivery"
                  fullWidth
                  size="small"
                  value={formValues.doorDelivery}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="gst-input"
                  name="gst"
                  label="GST"
                  fullWidth
                  size="small"
                  value={formValues.gst}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="grand-total-input"
                  label="Grand Total"
                  fullWidth
                  size="small"
                  value={totals.grandTotal}
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
              <Grid item xs={6}>
                <TextField
                  id="total-article-input"
                  label="Total Article"
                  fullWidth
                  size="small"
                  value={totalArticle}
                  disabled
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={6} textAlign="center">
        <Button
          variant="contained"
          color={editMode ? "primary" : "accent"}
          onClick={handleAddButtonClick}
          style={{backgroundColor:'#ffa500'}}
        >
          {editMode ? "Update" : "Add"}
        </Button>
      </Grid>
      <Grid container spacing={2}>
  <Grid item xs={12} sx={{ marginLeft: "10px" }}>
    <Paper elevation={3} style={{ padding: "2px" }}>
      <Grid container  alignItems="center" sx={{ padding: "10px" }}>
        <h3 style={{flexGrow:0.79}}>Bill Details</h3>
        <TextField
          label="Search"
          variant="outlined"
          size="small"

        />
      </Grid>
      <Grid container spacing={2}>
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
        <Grid item xs={12} md={2} sx={{ marginTop: "-40px" }}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Grid container spacing={2} justifyContent="center">
              <h3>Bill Details</h3>
              <Grid item xs={12}>
                <TextField
                  id="grand-total-input"
                  label="Freight"
                  fullWidth
                  size="small"
                  value={finalTotal}
                  InputProps={{ readOnly: true ,
                  
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
                  label="Hamali"
                  fullWidth
                  value={Hamali}
                  onChange={handleHamaliChange}
                  size="small"
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
                  label="Service_Char"
                  fullWidth
                  size="small"
                  value={ServiceChar}
                  onChange={handleServiceCharChange}
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
                  label="Del. Char"
                  fullWidth
                  value={delChar}
                  onChange={handleDelCharChange}
                  size="small"
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
                  label="Other Char"
                  fullWidth
                  size="small"
                  value={otherChar}
                  onChange={handleOtherCharChange}
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
                  label="Demurage"
                  fullWidth
                  size="small"
                  value={Demurage}
                  onChange={handleDemurageChange}
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
                  id="tds-input"
                  label="TDS (%)"
                  fullWidth
                  size="small"
                  value={tdsPercentage}
                  onChange={handleTdsInputChange}
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
                  id="total-stax-input"
                  label="Total S.Tax"
                  fullWidth
                  size="small"
                  disabled
                  value={totalSTax}
                  onChange={handleTotalSTaxChange}
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
                  label="Total Amt"
                  fullWidth
                  size="small"
                  value={totalAmt}
                  InputProps={{ startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ), readOnly: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
  <Grid item xs={4} sx={{ marginLeft: "10px" }}>
    <ResizableTextField
      id="remark-input"
      label="Remark"
      fullWidth
      size="small"
      value={remark}
      onChange={handleRemarkChange}
    />
  </Grid>
  <Grid item style={{ marginLeft: 16 }}>
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
              name="customer"
              checked={checkboxes.customer}
              onChange={handleCheckboxChange}
            size="small"
            />
          }
          label="Customer Mail"
          
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



      <Grid
        container
        spacing={2}
        style={{ marginTop: 10 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAddBill} style={{backgroundColor:'#ffa500'}}>
            Save
          </Button>
        </Grid>
        {/* <Grid item>
    <Button
      variant="contained"
      color="sky"
      onClick={handleAddBillWithPRint}
      disabled={isSubmitting}
    >
      Save And Print
    </Button>
  </Grid>
  <Grid item>
    <Button variant="contained" color="sky" onClick={handleAddBillWithExcel}>
      Export to Excel
    </Button>
  </Grid> */}
        <Grid item>
          <Button variant="contained" color="accent" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClosePrint}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={1200}
      >
        <iframe
          title="pdf-view"
          src={
            pdfData ? `${APP_BASE_PATH}${pdfData}` : newFile ? newFile : null
          }
          width="1000px"
          height="800px"
        ></iframe>
        <DialogActions>
          <Button onClick={handleClosePrint}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
    </>
  );
};

export default NewBill;
