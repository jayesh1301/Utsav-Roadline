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
  FormControlLabel,
  Checkbox,
  styled,
  InputAdornment,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectBranch, getAllCustomers, getCustomerbyid } from "../../../lib/api-customer";
import {
  billforExcel,
  billforprint,
  getLorryMasterListForBill,
  getLorryMasterListForBillUpdate,
  getbillbyid,
  getlrdetailsbyid,
  mailbill,
  sendMail,
  updateBill,
} from "../../../lib/api-bill-list";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import { utils, writeFile } from "xlsx";
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

const EditBill = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [newFile, setNewfile] = useState(null);




  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    whatsapp: false,
    customer: false,
    print: true,
  });
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  const columns = [
    { field: "sn", headerName: "SN", flex: 1 },
    { field: "Description", headerName: "Description", flex: 2 },
    { field: "Article", headerName: "Article", flex: 1 },
    { field: "Weight", headerName: "Weight", flex: 1 },
    { field: "GCN No & Date", headerName: "GCN No & Date", flex: 2 },
    { field: "Hamali", headerName: "Hamali", flex: 1 ,valueFormatter: (params) => `₹ ${params.value}`},
    { field: "Amount", headerName: "Amount", flex: 1 ,valueFormatter: (params) => `₹ ${params.value}`},
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];
  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    selectedCustomer: null,

    selectedLrId: "",
    billDate: null,
    billType: "TBB",
    lrNoOptions: [],
    selectedLrDate: null,
    tableDate: "",
    consignor: "",
    consignee: "",
    fromLocation: "",
    toLocation: "",
    gstPayableBy: "",
    totalArticle: "",
    customer: "",
    weight: "",
    selectedLrNo: "",
    gstNo: "",
    totfreight: "",
    tot_amt: "",
    remarks: "",
    hamali: "",
    branchId: "",
    user_id: "",
  });
  const [customerOptions, setCustomerOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [charges, setCharges] = useState({
    hamali: 0,
    otherCharge: 0,
    freight: 0,
    weightcharge: 0,
    collection: 0,
    statistical: 0,
    doordelivery: 0,
    gst: 0,
    total: 0,
  });

  const [billDetailsTotal, setBillDetailsTotal] = useState({
    hamali: "",
    service_char: "",
    Del_Char: "",
    Other_Char: "",
    Demurage: "",
    tds: "",
    Total_S_Tax: "",
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    });
  };
  const handleUpdateClick = async () => {

    try {
      if (rows.length === 0) {
        // No LRs selected, show error message
        setConfirmmessage( "Please select at least one LR before updating the bill.");
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Please select at least one LR before updating the bill.",
        // });
        return; // Exit the function early
      }
      const totalHamali = rows.reduce(
        (sum, row) => sum + parseFloat(row.Hamali || 0),
        0
      );

      const freightSum = rows.reduce((sum, row) => {
        return sum + parseFloat(row.freight || 0);
      }, 0);
      console.log(formData.billDate);
      setIsLoading(true);
      const dataToUpdate = {
        billNo: formData.billNo,
        billDate: formData.billDate
          ? formData.billDate.format("YYYY-MM-DD")
          : "",
        billType: formData.billType,
        customer_id: formData.customer,
        tot_freight: totalAmount,
        tot_hamali: billDetailsTotal.hamali,
        branchId: formData.branchId,
        user_id: formData.user_id,
        remarks: formData.remarks,
        service_ch: billDetailsTotal.service_char,
        delivery_ch: billDetailsTotal.Del_Char,
        other_ch: billDetailsTotal.Other_Char,
        demurage: billDetailsTotal.Demurage,
        tds: billDetailsTotal.tds,
        tot_tax: billDetailsTotal.Total_S_Tax,
        tot_amount: formData.tot_amt,
        bill_details: rows.map((row) => ({
          table_lr_id: row.lr_id,
          table_lr_freight: row.freight || 0,
          table_lr_hamali: row.Hamali || 0,
          table_lr_collection: row.collection || 0,
          table_lr_delivery: row.door_delivery || 0,
          table_lr_wtcharges: row.wt_charges || 0,
          table_lr_otherchar: row.other_charges || 0,
          table_lr_statistical: row.statistics || 0,
          table_lr_total: row.Amount || 0,
          table_lr_gstpayby: row.gstpayby || 0,
          table_lr_gst_amount: row.gst_amount || 0,
        })),
      };
      console.log(billDetailsTotal);
      const response = await updateBill(id, dataToUpdate);
      if(checkboxes.customer == true){
        handleEmail(formData.customer)
        console.log("customer_id",formData.customer)
      }
      if(checkboxes.print == true){
        handleView(id);

      }
      setConfirmmessage(`Bill No ${formData.billNo} updated successfully`);
      setConfirmationopen(true);
      setColor('success')
      // Swal.fire({
      //   title: "Success!",
      //   text: `Bill No ${formData.billNo} updated successfully`,
      //   icon: "success",
      //   confirmButtonText: "OK",
      // }).then(() => {
      //   //navigate(`/Bill-List`); // Update with your actual target route
      // });
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating bill:", error);
        setConfirmmessage( "Failed to update bill");
        setConfirmationopen(true);
        setColor('error')
        
      // Swal.fire({
      //   title: "Error!",
      //   text: "Failed to update bill",
      //   icon: "error",
      //   confirmButtonText: "OK",
      // });
      setIsLoading(false);
    }
  };
  const handleEmail = async (custid) => {
    setIsLoading(true);
    try {
     
      const response = await getCustomerbyid(custid);
      const { data } = response;
      console.log(data.customer[0].emailid)
      if (data) {
        localStorage.setItem("tomailCustomer",data.customer[0].emailid)
        setEmailForm(prevState => ({
          ...prevState,
          id: id,
          toEmail: data.customer[0].emailid
        }));
        
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
    
        const tomail=localStorage.getItem("tomailCustomer")
      const message= localStorage.getItem("messagecustomer")
        const options = {
          pdfpathfile,
          emailForm:{
            id:id,
            toEmail:tomail,
            message:message
                      },
        };
        const response = await sendMail(options);
     
        if (response.status == 200) {
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
  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = rows.reduce((sum, row) => {
        const amount = !isNaN(row.Amount) ? parseInt(row.Amount, 10) : 0;

        return sum + amount;
      }, 0);
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [rows]);

  useEffect(() => {
    const total =
      Number(charges.hamali) +
      Number(charges.otherCharge) +
      Number(charges.freight) +
      Number(charges.weightcharge) +
      Number(charges.collection) +
      Number(charges.statistical) +
      Number(charges.doordelivery) +
      Number(charges.gst);

    const formattedTotal = total.toFixed(2);

    setCharges((prevState) => ({ ...prevState, total: formattedTotal }));
  }, [
    charges.hamali,
    charges.otherCharge,
    charges.freight,
    charges.weightcharge,
    charges.collection,
    charges.statistical,
    charges.doordelivery,
    charges.gst,
  ]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCharges((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlebilldetailstotal = (event) => {
    const { name, value } = event.target;
    setBillDetailsTotal({
      ...billDetailsTotal,
      [name]: value,
    });
  };
  const calculateTotalAmountbilldetails = () => {
    const hamaliAmount = parseFloat(billDetailsTotal.hamali) || 0;
    const serviceCharAmount = parseFloat(billDetailsTotal.service_char) || 0;
    const DelCharAmount = parseFloat(billDetailsTotal.Del_Char) || 0;
    const OtherCharAmount = parseFloat(billDetailsTotal.Other_Char) || 0;
    const DemurageAmount = parseFloat(billDetailsTotal.Demurage) || 0;
    const freightAmount = parseFloat(totalAmount) || 0;

    const calculatedTotal =
      hamaliAmount +
      serviceCharAmount +
      DelCharAmount +
      OtherCharAmount +
      DemurageAmount +
      freightAmount;

    const tdsPercentage = parseFloat(billDetailsTotal.tds) || 0;
    const tdsAmount = freightAmount * (tdsPercentage / 100);

    const totalAfterTDS = calculatedTotal - tdsAmount;

    return totalAfterTDS.toFixed(2);
  };

  useEffect(() => {
    const totalAmt = calculateTotalAmountbilldetails();
    setFormData({
      ...formData,
      tot_amt: totalAmt,
    });
  }, [
    billDetailsTotal.hamali,
    billDetailsTotal.service_char,
    billDetailsTotal.Del_Char,
    billDetailsTotal.Other_Char,
    billDetailsTotal.Demurage,
    billDetailsTotal.tds,
    totalAmount,
  ]);

  useEffect(() => {
    fetchCustomers();

    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await SelectBranch();
      const { data } = response;
      const branchList = data.map((branch) => ({
        branch_id: branch.branch_id,
        branch_name: branch.branch_name,
      }));
      setBranchOptions(branchList);
    } catch (error) {
      console.error("Failed to fetch branch options:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBillById(id);
    }
  }, [id]);
  const fetchBillById = async (id) => {
    try {
      const response = await getbillbyid(id);
      const billData = response.data;

      const customer_id = billData.customer_id;
      localStorage.setItem('customer_idbill',customer_id)
      const bill_date = billData.bill_date;
      const bill_type = billData.bill_type;
      const bill_no = billData.bill_no;
      const branch_id = billData.branch;
      const gstNo = billData.gstno || "";
      const branchName = branchOptions.find(
        (branch) => branch.branch_id == branch_id
      )?.branch_name;
      const tot_freight = billData["IFNULL(tot_freight,0)"] || "0";
      const tot_hamali = billData["IFNULL(tot_hamali,0)"] || "0";
      const service_ch = billData["IFNULL(service_ch,0)"] || "0";
      const delivery_ch = billData["IFNULL(delivery_ch,0)"] || "0";
      const other_ch = billData["IFNULL(other_ch,0)"] || "0";
      const demurage = billData["IFNULL(demurage,0)"] || "0";
      const tds = billData["IFNULL(tds,0)"] || "0";
      const tot_tax = billData["IFNULL(tot_tax,0)"] || "0";
      const tot_amt = billData["IFNULL(tot_amount,0)"] || "0";
      const remarks = billData.remarks || "";
      const user_id = billData.user_id || null;

      setFormData({
        customer: customer_id,
        billDate: dayjs(bill_date, "YYYY-MM-DD"),
        billType: bill_type,
        billNo: formatBillNo(bill_no),
        branchId: branch_id,
        gstNo: gstNo,
        totfreight: tot_freight,
        tot_amt: tot_amt,
        remarks: remarks,
        user_id: user_id,
        
      });
      setBillDetailsTotal({
        hamali: tot_hamali,
        service_char: service_ch,
        Del_Char: delivery_ch,
        Other_Char: other_ch,
        Demurage: demurage,
        tds: tds,
        Total_S_Tax: tot_tax,
      });

      const billDetailsResults = billData.billDetailsResults || [];
      const billDetails = Array.isArray(billDetailsResults)
        ? billDetailsResults
        : [billDetailsResults];

      const formattedRows = billDetails.map((detail, index) => ({
        id: detail.id,
        sn: index + 1,
        Description: `${billData.details.loc_from_name} TO ${billData.details.loc_to_name}`,
        Article: detail["SUM(IFNULL(tlr.no_of_articles,0))"] || 0,
        Weight: detail["sum(IFNULL(tlr.actual_wt,0))"] || 0,
        "GCN No & Date": `${detail.lrno} ${detail.lrdate}`,
        Hamali: detail["IFNULL(bd.hamali,0)"] || 0,
        Amount: detail["IFNULL(bd.total,0)"] || 0,
        lr_id: detail.lr_id,
        consigner_id: detail.consigner_id,
        pay_type: detail.pay_type,
        collection: detail["IFNULL(bd.collection,0)"] || 0,
        door_delivery: detail["IFNULL(bd.door_delivery,0)"] || 0,
        freight: detail["IFNULL(bd.freight,0)"] || 0,
        gst_amount: detail["IFNULL(bd.gst_amount,0)"] || 0,
        other_charges: detail["IFNULL(bd.other_ch,0)"] || 0,
        statistics: detail["IFNULL(bd.statistics,0)"] || 0,
        wt_charges: detail["IFNULL(bd.wt_charges,0)"] || 0,
        customer_name: detail.consigner_name || detail.customer_name || "",
        gstn: detail.gstn || "",
        gstpayby: detail.gstpayby || "",
        place_name: detail.to_place || "",
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Failed to fetch bill details:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      const { data } = response;

      const cust = data
        .filter(
          (cust) => cust.customer_id != null && cust.customer_name != null
        )
        .map((cust) => ({
          customer_id: cust.customer_id,
          customer_name: cust.customer_name,
          gstno: cust.gstno,
        }));
      setCustomerOptions(cust);
    } catch (error) {
      console.error("Failed to fetch customer options:", error);
    }
  };

  useEffect(() => {
    const fetchLrNoOptions = async () => {
      if (formData.customer && formData.billType) {
        setIsLoading(true);
        try {
          const response = await getLorryMasterListForBillUpdate(
            formData.customer,
            formData.billType
          );

          setFormData((prevState) => ({
            ...prevState,
            lrNoOptions: response.data,
          }));
        } catch (error) {
          console.error("Failed to fetch LR No options:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLrNoOptions();
  }, [formData.customer, formData.billType]);

  useEffect(() => {
    const fetchLrDetails = async () => {
      if (formData.selectedLrId && formData.customer) {
        setIsLoading(true);
        try {
          const response = await getlrdetailsbyid(
            formData.selectedLrId,
            formData.customer
          );

          const data = response.data;

          // Update formData state
          setFormData((prevState) => ({
            ...prevState,
            selectedLrDate: dayjs(data.lrdate, "DD-MM-YYYY"),
            tableDate: data.lrdate,
            consignor: data.consignor_name,
            consignee: data.customer_name,
            fromLocation: data.loc_from_name,
            toLocation: data.loc_to_name,
            gstPayableBy: data.gst_pay_by,
            totalArticle: data["SUM(tlr.no_of_articles)"],
            weight: data["SUM(tlr.actual_wt)"],
            selectedLrNo: data.lrno,
            freight: data.freight || 0,
            weightCharge: data.wt_charges,
            hamali: data.hamali,
            otherCharge: data.other_charges,
            collection: data.collection,
            statistical: data.statatical,
            doorDelivery: data.delivery,
            gst: data.to_billed,
          }));

          if (!isEditing) {
            setCharges((prevCharges) => ({
              ...prevCharges,
              freight: data.freight || 0,
              weightcharge: data.wt_charges || 0,
              statistical: data.statatical || 0,
              hamali: data.hamali || 0,
              collection: data.collection || 0,
              otherCharge: data.other_charges || 0,
              doordelivery: data.delivery || 0,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch LR details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLrDetails();
  }, [formData.selectedLrId, formData.customer, isEditing]); // Added isEditing as a dependency

  const handleCustomerChange = (event, value) => {
    const selectedCustomer = customerOptions.find(
      (cust) => cust.customer_name === value
    );

    setFormData((prevState) => ({
      ...prevState,
      selectedCustomer: selectedCustomer,
      customer: selectedCustomer ? selectedCustomer.customer_id : "",
      customerName: selectedCustomer ? selectedCustomer.customer_name : "",
      gstNo: selectedCustomer?.gstno || "",
    }));
  };

  const handleBranchChange = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      branch: value ? value.branch_name : "",
      branchId: value ? value.branch_id : "",
    }));
  };

  const handleLrNoChange = (event, value) => {
    const selectedType = formData.lrNoOptions.find(
      (type) => type.lr_no == value
    );
    if (selectedType) {
      setFormData({
        ...formData,
        selectedLrId: selectedType.id,
      });
    } else {
      setFormData({
        ...formData,
        selectedLrId: "",
      });
    }
  };
  const handleBillTypeChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      billType: event.target.value,
    }));
  };

  const handalClose = () => {
    navigate("/Bill-List");
  };

  const formatBillNo = (billNo) => {
    return billNo.toString().padStart(5, "0");
  };

  const handleSaveButtonClick = () => {
    if (!formData.selectedLrId) {
      setConfirmmessage("Please select an LR before adding to the table.");
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
      (row) => row.lr_id === formData.selectedLrId && !isEditing
    );

    if (isDuplicateLrNo) {
      // Show a message if the LR No is already added
      setConfirmmessage( "This LR No is already added to the table.");
      setConfirmationopen(true);
      setColor('warning')
      // Swal.fire({
      //   icon: "warning",
      //   title: "Duplicate LR No",
      //   text: "This LR No is already added to the table.",
      // });
      return; // Prevent adding the duplicate LR No
    }
    const newRow = {
      id: formData.selectedLrId,
      sn: isEditing ? selectedRow.sn : rows.length + 1,
      Description: `${formData.fromLocation} TO ${formData.toLocation}`,
      Article: formData.totalArticle,
      Weight: formData.weight,
      "GCN No & Date": `${formData.selectedLrNo} ${dayjs(
        formData.selectedLrDate
      ).format("YYYY-MM-DD")}`,
      Hamali: charges.hamali,
      Amount: charges.total,
      collection: charges.collection || "0",
      customer_name: formData.selectedCustomer?.customer_name || "",
      customer_id: formData.customer,
      door_delivery: charges.doordelivery || "0",
      freight: charges.freight || "0",
      gst_amount: charges.gst || "0",
      gstn: formData.gstNo || "",
      gstpayby: formData.gstPayableBy || "Consignor",
      lr_id: formData.selectedLrId || "",
      other_charges: charges.otherCharge || "0",
      statistics: charges.statistical || "0",
      wt_charges: charges.weightcharge || "0",
    };

    if (isEditing) {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === selectedRow.id ? newRow : row))
      );
    } else {
      setRows((prevRows) => [...prevRows, newRow]);
    }

    setIsEditing(false);
  };

  const handleEdit = (rowData) => {
    const custid = localStorage.getItem('customer_idbill')

    setSelectedRow(rowData);
    const selectedCustomer = customerOptions.find(
      (cust) => cust.customer_id == custid
    );

    setCharges({
      ...setCharges,
      freight: rowData.freight || 0,
      weightcharge: rowData.wt_charges || 0,
      hamali: rowData.Hamali || 0,
      otherCharge: rowData.other_charges || 0,
      collection: rowData.collection || 0,
      statistical: rowData.statistics || 0,
      doordelivery: rowData.door_delivery || 0,
      gst: rowData.gst_amount || 0,
      total: rowData.Amount || 0,
    });

 console.log()
    setFormData({
      ...formData,
      totalArticle: String(rowData.Article) || "",
      selectedLrId: rowData.lr_id || "",
      customer:  custid ,
      customerName: selectedCustomer.customer_name || "",
    });

    setIsEditing(true);
  };
  const handleUpdateAndPrint = async () => {
    try {
      if (rows.length === 0) {
        // No LRs selected, show error message
        setConfirmmessage("Please select at least one LR before updating the bill.");
        setConfirmationopen(true);
        setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Please select at least one LR before updating the bill.",
        // });
        return; // Exit the function early
      }

      setIsSubmitting(true);
      setIsLoading(true);
      const dataToUpdate = {
        billNo: formData.billNo,
        billDate: formData.billDate
          ? formData.billDate.format("YYYY-MM-DD")
          : "",
        billType: formData.billType,
        customer_id: formData.customer,
        tot_freight: totalAmount,
        tot_hamali: billDetailsTotal.hamali,
        branchId: formData.branchId,
        user_id: formData.user_id,
        remarks: formData.remarks,
        service_ch: billDetailsTotal.service_char,
        delivery_ch: billDetailsTotal.Del_Char,
        other_ch: billDetailsTotal.Other_Char,
        demurage: billDetailsTotal.Demurage,
        tds: billDetailsTotal.tds,
        tot_tax: billDetailsTotal.Total_S_Tax,
        tot_amount: formData.tot_amt,
        bill_details: rows.map((row) => ({
          table_lr_id: row.lr_id,
          table_lr_freight: row.freight || 0,
          table_lr_hamali: row.Hamali || 0,
          table_lr_collection: row.collection || 0,
          table_lr_delivery: row.door_delivery || 0,
          table_lr_wtcharges: row.wt_charges || 0,
          table_lr_otherchar: row.other_charges || 0,
          table_lr_statistical: row.statistics || 0,
          table_lr_total: row.Amount || 0,
          table_lr_gstpayby: row.gstpayby || 0,
          table_lr_gst_amount: row.gst_amount || 0,
        })),
      };

      const response = await updateBill(id, dataToUpdate);

      Swal.fire({
        title: "Success!",
        text: `Bill No ${formData.billNo} updated successfully`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        console.log(
          "Bill added successfully with the following details:",
          dataToUpdate
        );
        handleView(response.data.inserted_id);
      });
      setIsSubmitting(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating bill:", error);
      setConfirmmessage("Failed to update bill");
      setConfirmationopen(true);
      setColor('error')
      // Swal.fire({
      //   title: "Error!",
      //   text: "Failed to update bill",
      //   icon: "error",
      //   confirmButtonText: "OK",
      // });
      setIsSubmitting(false);
    }
  };

  const handleView = async (id) => {
    setIsLoading(true);
    try {
      const response = await billforprint(id);
      const pdf = response.data.returnPath;
      setPdfData(pdf);
    } catch (error) {
      console.error("Failed to fetch bill details for print:", error);
    } finally {
      setOpen(true);
      setIsLoading(false);
    }
  };
  const handleClosePrint = () => {
    setNewfile(null);
    setPdfData(null);
    // setSelectedInvoiceId(null);
    setOpen(false);
   // navigate(`/Bill-List`);
    setIsSubmitting(false);
  };

  const handleUpdateAndExcel = async () => {
    try {
      if (rows.length === 0) {
        // No LRs selected, show error message
        setConfirmmessage("Please select at least one LR before updating the bill.");
      setConfirmationopen(true);
      setColor('error')
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Please select at least one LR before updating the bill.",
        // });
        return; // Exit the function early
      }
      const totalHamali = rows.reduce(
        (sum, row) => sum + parseFloat(row.Hamali || 0),
        0
      );

      const freightSum = rows.reduce((sum, row) => {
        return sum + parseFloat(row.freight || 0);
      }, 0);

      const dataToUpdate = {
        billNo: formData.billNo,
        billDate: formData.billDate
          ? formData.billDate.format("YYYY-MM-DD")
          : "",
        billType: formData.billType,
        customer_id: formData.customer,
        tot_freight: totalAmount,
        tot_hamali: billDetailsTotal.hamali,
        branchId: formData.branchId,
        user_id: formData.user_id,
        remarks: formData.remarks,
        service_ch: billDetailsTotal.service_char,
        delivery_ch: billDetailsTotal.Del_Char,
        other_ch: billDetailsTotal.Other_Char,
        demurage: billDetailsTotal.Demurage,
        tds: billDetailsTotal.tds,
        tot_tax: billDetailsTotal.Total_S_Tax,
        tot_amount: formData.tot_amt,
        bill_details: rows.map((row) => ({
          table_lr_id: row.lr_id,
          table_lr_freight: row.freight || 0,
          table_lr_hamali: row.Hamali || 0,
          table_lr_collection: row.collection || 0,
          table_lr_delivery: row.door_delivery || 0,
          table_lr_wtcharges: row.wt_charges || 0,
          table_lr_otherchar: row.other_charges || 0,
          table_lr_statistical: row.statistics || 0,
          table_lr_total: row.Amount || 0,
          table_lr_gstpayby: row.gstpayby || 0,
          table_lr_gst_amount: row.gst_amount || 0,
        })),
      };

      const response = await updateBill(id, dataToUpdate);
      const insertedId = response.data.inserted_id;
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
      Swal.fire({
        title: "Success!",
        text: `Bill No ${formData.billNo} updated successfully`,
        icon: "success",
        confirmButtonText: "OK",
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
        }
        navigate(`/Bill-List`);
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
          value={
            branchOptions.find(
              (option) => option.branch_id == formData.branchId
            ) || null
          }
          disabled
          onChange={handleBranchChange}
          renderInput={(params) => (
            <TextField {...params} label="Branch:" fullWidth size="small"  />
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
                value={formData.billNo}
                size="small"
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formData.billDate}
                    onChange={(date) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        billDate: date,
                      }))
                    }
                    format="DD-MM-YYYY"
                    placeholder="Select Date"
                    renderInput={(props) => (
                      <TextField {...props} size="small" />
                    )}
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
                  value={formData.billType}
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
                options={
                  customerOptions
                    ? customerOptions.map((type) => type.customer_name)
                    : []
                }
                value={
                  formData.customer
                    ? customerOptions.find(
                        (p) => p.customer_id == formData.customer || null
                      )?.customer_name
                    : ""
                }
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
              <TextField label="Vendor Code" fullWidth size="small" disabled />
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
                {isEditing ? (
                  <TextField
                    label="LR No"
                    value={formData.selectedLrNo}
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                    
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                   
                  />
                ) : (
                  <Autocomplete
                    id="lr-no-autocomplete"
                    options={
                      formData.lrNoOptions
                        ? formData.lrNoOptions.map((type) => type.lr_no)
                        : []
                    }
                    value={
                      formData.selectedLrId
                        ? formData.lrNoOptions &&
                          formData.lrNoOptions.find(
                            (p) => p.id == formData.selectedLrId
                          )?.lr_no
                        : ""
                    }
                    onChange={(event, value) => handleLrNoChange(event, value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="LR No"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      id="lr-date-picker"
                      value={formData.selectedLrDate}
                      onChange={(date) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          selectedLrDate: date,
                        }))
                      }
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
                  value={formData.consignor}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Consignee"
                  fullWidth
                  size="small"
                  value={formData.consignee}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="From"
                  fullWidth
                  size="small"
                  value={formData.fromLocation}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="To"
                  fullWidth
                  size="small"
                  value={formData.toLocation}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="GST No"
                  fullWidth
                  size="small"
                  value={formData.gstNo}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="GST Payable By"
                  fullWidth
                  size="small"
                  value={formData.gstPayableBy}
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
                  label="Freight"
                  fullWidth
                  size="small"
                  name="freight"
                  value={charges.freight}
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
                  label="Weight Charge"
                  fullWidth
                  size="small"
                  name="weightcharge"
                  value={charges.weightcharge}
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
                  value={charges.hamali}
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
                  value={charges.otherCharge}
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
                  label="Collection"
                  fullWidth
                  size="small"
                  name="collection"
                  value={charges.collection}
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
                  label="LR Charges"
                  fullWidth
                  size="small"
                  name="statistical"
                  value={charges.statistical}
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
                  label="Door Delivery"
                  fullWidth
                  size="small"
                  name="doordelivery"
                  value={charges.doordelivery}
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
                  label="GST"
                  fullWidth
                  size="small"
                  name="gst"
                  value={charges.gst}
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
                  label="Total"
                  fullWidth
                  size="small"
                  InputProps={{  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),readOnly: true }}
                  value={charges.total}
                  
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="total-article-input"
                  label="Total Article"
                  fullWidth
                  value={formData.totalArticle}
                  size="small"
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
          color="accent"
          onClick={handleSaveButtonClick}
        >
          {isEditing ? "Update" : "Add"}
        </Button>
      </Grid>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            marginLeft: "10px",
          }}
        >
          <Paper elevation={3} style={{ padding: "2px" }}>
            <Grid
              elevation={3}
              style={{
                display: "flex",
          
              }}
            >
              <h3 style={{flexGrow:0.79}}>Bill Details</h3>
              <TextField label="Search" variant="outlined" size="small"  />
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
              <Grid item xs={12} md={2} sx={{marginTop:"-40px"}}>
                <Paper elevation={3} style={{ padding: "20px" }}>
                  <Grid container spacing={2} justifyContent="center">
                    <h3>Bill Details</h3>
                    <Grid item xs={12}>
                      <TextField
                        label="Freight"
                        value={totalAmount}
                        fullWidth
                        size="small"
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
                        label="Hamali"
                        fullWidth
                        size="small"
                        name="hamali"
                        value={billDetailsTotal.hamali}
                        onChange={handlebilldetailstotal}
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
                        name="service_char"
                        value={billDetailsTotal.service_char}
                        onChange={handlebilldetailstotal}
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
                        label="Del_Char"
                        fullWidth
                        size="small"
                        name="Del_Char"
                        value={billDetailsTotal.Del_Char}
                        onChange={handlebilldetailstotal}
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
                        label="Other_Char"
                        fullWidth
                        size="small"
                        name="Other_Char"
                        value={billDetailsTotal.Other_Char}
                        onChange={handlebilldetailstotal}
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
                        name="Demurage"
                        value={billDetailsTotal.Demurage}
                        onChange={handlebilldetailstotal}
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
                        label="TDS"
                        fullWidth
                        size="small"
                        name="tds"
                        value={billDetailsTotal.tds}
                        onChange={handlebilldetailstotal}
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
                        label="Total S.Tax"
                        fullWidth
                        size="small"
                        name="Total_S_Tax"
                        value={billDetailsTotal.Total_S_Tax}
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
                        label="Total Amt"
                        value={formData.tot_amt}
                        fullWidth
                        size="small"
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
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            marginLeft: "10px",
          }}
        >
          <ResizableTextField
            label="Remark"
            value={formData.remarks}
            onChange={(event) =>
              setFormData((prevState) => ({
                ...prevState,
                remarks: event.target.value,
              }))
            }
            fullWidth
            size="small"
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
        style={{ marginTop: 16 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateClick}
          >
            Update
          </Button>
        </Grid>
        {/* <Grid item>
          <Button
            variant="contained"
            color="sky"
            onClick={handleUpdateAndPrint}
            disabled={isSubmitting}
          >
            Update And Print
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="sky"
            onClick={handleUpdateAndExcel}
          >
            Export to Excel
          </Button>
        </Grid> */}
        <Grid item>
          <Button variant="contained" color="accent" onClick={handalClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item style={{ marginLeft: 16 }}>
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

export default EditBill;
