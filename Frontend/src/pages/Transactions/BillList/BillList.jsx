import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  IconButton,
  Checkbox,
  Autocomplete,
  InputLabel,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableContainer,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Aaddbillmasterddlr,
  SelectBranch,
  billforExcel,
  billforprint,
  deletebills,
  getbillsbybranch,
  mailbill,
  searchBills,
  sendMail,
} from "../../../lib/api-bill-list";
import { getAllCustomers } from "../../../lib/api-customer";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import Swal from "sweetalert2";
import DownloadIcon from '@mui/icons-material/Download';
import { utils, writeFile } from "xlsx";
import CustomPagination from "../../../components/common/ui/CustomPagination";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";
import { getemail } from "../../../lib/api-lorryreceipt";

const BillList = () => {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [newFile, setNewfile] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billNo, setBillNo] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  
  const [pageState, setPageState] = useState({
    total: 0,
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [email,setEmail]=useState([])
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });

 
    const fetchBranches = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await getAllCustomers();
        setCustomerOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch customer options:", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    getemaildetails()
    fetchBranches();
    fetchCustomers();
  }, []);
  const getemaildetails = async () => {
    try {
      const response = await getemail();
      const { data } = response;
      const mailList = data.map((mail) => ({
        mail_id: mail.id,
        emailid: mail.emailid,
      }));


      setEmail(mailList)
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await getbillsbybranch(
        selectedBranch.branch_id,
        paginationModel.page,
        paginationModel.pageSize
      );

      const billsbybranch = response.data.billsbybranch;
      const total = response.data.total;
      const startIdx = paginationModel.page * paginationModel.pageSize;

      const billsWithSrNo = billsbybranch.map((bill, index) => ({
        id: bill.id,
        srNo: startIdx + index + 1,
        ...bill,
      }));

      setBills(billsWithSrNo);
      setPageState({
        total: total,
      });
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchBills();
    }
  }, [ selectedBranch,paginationModel]);

  const handleAdd = () => {
    navigate("/Add-Bill");
  };
  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setConfirmationOpen(true);
    } else {
      console.log("Please select bills to delete.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletebills(selectedRows);
      fetchBranches()
      fetchBills(); 
      setSelectedRows([]); 
    } catch (error) {
      console.error("Failed to delete bills:", error);
    } finally {
      setConfirmationOpen(false); 
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleView = async (id) => {
    setLoading(true)
    try {
      const response = await billforprint(id);
      console.log("Bill details for print:", response.data);
      const pdf = response.data.returnPath;
      console.log(pdf);

      setPdfData(pdf);
    } catch (error) {
      console.error("Failed to fetch bill details for print:", error);
    } finally {
      setOpen(true);
      setLoading(false)
    }
  };

  const handlemail = async (id) => {
    setOpenEmailModal(true);
    setEmailForm({ ...emailForm, id: id });
    setLoading(true);
    try {
      // Fetch file name from the backend
      const response = await billforprint(id);

      console.log(response);

      // Extract the file name from the returnpath
      const returnpath = response.data.returnPath;
      console.log(returnpath);

      // Extract the file name from the path
      const fileName = returnpath.split("/").pop();

      setEmailForm({
        ...emailForm,
        id: id,
        toEmail:"rajesh.transport@gmail.com",
        message: `Please find the attached file: ${fileName}`,
      });
    } catch (error) {
      console.error("Error fetching file name:", error);
    } finally {
      setLoading(false);
    }
  };

  let pdfpathfile;
  const sendEmail = async () => {
    setLoading(true);
    try {
      const response = await mailbill(emailForm.id);
      console.log("Bill details for print:", response.data);
      const pdf = response.data.returnPath;
      console.log(pdf);
      pdfpathfile = pdf;

      if (pdfpathfile) {
        console.log(pdfpathfile);
        setEmailForm({
          ...emailForm,
          // Update emailForm state if needed
        });

        const options = {
          pdfpathfile,
          emailForm,
        };

        const response = await sendMail(options);
        console.log(response);

        if (response.status === 200) {
          setConfirmmessage(response.data);
          setConfirmationopen(true);
          setColor('success')
          // Swal.fire({
          //   icon: "success",
          //   title: "Success",
          //   text: response.data,
          // });
          getemaildetails()
          setOpenEmailModal(false);
        } else {
          setConfirmmessage( "Something went wrong!");
          setConfirmationopen(true);
          setColor('error')
          // Swal.fire({
          //   icon: "error",
          //   title: "Something went wrong!",
          // });
          setOpenEmailModal(false);
        }
      }
    } catch (error) {
      if(error.response.status == 400){
         
        setConfirmmessage(error.response.data);
        setConfirmationopen(true);
        setColor('warning')
      }
      console.error("Error sending email:", error);
      // Handle error appropriately
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleClose = () => {
    setNewfile(null);
    setPdfData(null);
    // setSelectedInvoiceId(null);
    setOpen(false);
    //setOpen1(false);
  };
  const handleEdit = (id) => {
    navigate(`/edit-Bill/${id}`);
  };

  const handleBranchChange = (event, value) => {
    setSelectedBranch(value);
  };

  const handleCustomerChange = (event, value) => {
    setSelectedCustomer(value);
  };

  const handleBillNoChange = (event) => {
    setBillNo(event.target.value);
  };

  const handleSearch = async () => {
    if (!billNo && !selectedCustomer?.customer_id) {
      // No customer selected and no bill number entered, call fetchBills instead
      fetchBills();
      return; // Exit the function early
    }
    setLoading(true);
    try {
      const response = await searchBills(
        billNo,
        selectedCustomer?.customer_id,
        selectedBranch?.branch_id
      );

      const searchData = response.data;

      const formattedBills = searchData.map((bill, index) => ({
        id: bill.id,
        srNo: index + 1,
        ...bill,
      }));

      setBills(formattedBills);
      setPageState({
        total: formattedBills.length,
      });
    } catch (error) {
      console.error("Failed to search bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "srNo", headerName: "SrNo", flex: 0.1 },
    {
      field: "bill_no",
      headerName: "Bill No",
      flex: 0.3,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(params.row.id)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "bill_date", headerName: "Date", flex: 0.3 },
    { field: "customer_name", headerName: "Customer", flex: 2 },
    
    { field: "tot_amount", headerName: "Bill Amount", flex: 0.3,
      renderCell: (params) => (
        <div>₹{params.value}</div>
      ),
     },
    {
      field: "options",
      headerName: "Options",
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleView(params.row.id)} size="small">
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handlemail(params.row.id)} size="small">
            <MailOutlinedIcon />
          </IconButton>
        
          <Checkbox
            size="small"
            checked={selectedRows.includes(params.row.id)}
            onChange={() => handleCheckboxChange(params.row.id)}
          />
        </div>
      ),
    },
  ];

  
  const handleAddBillWithExcel = async (id) => {
    setLoading(true)
    try {
      
      const billResponse = await billforExcel(id);
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
        statistics,
        other_charges,
        total_amount_words,
      } = billData;
      const details = Array.isArray(billResponse.data.details)
        ? billResponse.data.details
        : [];

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
          "LR Charges",
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
          row.statistics,
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

      // Swal.fire({
      //   icon: "success",
      //   title: "Success",
       
      //   confirmButtonText: "Export to Excel",
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     // Create a new workbook and add the data to it
       
      //     console.log("Bill details exported to Excel.");
          
      //   }
      // });
    } catch (error) {
      console.error("Error adding bill:", error);
      setConfirmmessage( "Failed to add bill. Please try again later.");
      setConfirmationopen(true);
      setColor('error')
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: "Failed to add bill. Please try again later.",
      // });
    }finally{
      setLoading(false)
    }
  };
  const handleRowsPerPageChange = (event) => {
 
    setPaginationModel({
      ...paginationModel,
      pageSize: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handlePageChange = (newPage) => {
    
    setPaginationModel({
      ...paginationModel,
      page: newPage,
    });
    
  }
  const handleInputChange = (event, newInputValue) => {
    setEmailForm({ ...emailForm, toEmail: newInputValue });
  };

  const handleChange = (event, newValue) => {
    const newemail=newValue.emailid
    setEmailForm({ ...emailForm, toEmail: newemail });
  };
  return (
    <> <CustomSnackbar
    open={isConfirmationopen}
    message={confirmmessage}
    onClose = {()=> setConfirmationopen(false)}
    color={color}
    />
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      {loading && <LoadingSpinner />}
      <Grid container item xs={6} alignItems="center">
        <Grid item xs={4}>
          <Autocomplete
            sx={{ width: "100%" }}
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
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <h1>Bill List</h1>
      </Grid>

      <Grid
        container
        item
        xs={12}
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ marginTop: "2px" }}
      >
        <Grid item xs={6} sx={{marginLeft:"330px"}}>
          <Paper
            elevation={3}
            style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  label="Enter Bill Number"
                  fullWidth
                  size="small"
                  value={billNo}
                  onChange={handleBillNoChange}
                />
              </Grid>
              <Grid item xs={5}>
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
              <Grid item xs={1} >
                <Button
                  variant="contained"
                  color="accent"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid container item xs={3} justifyContent="flex-end">
    <Grid item >
      <Button variant="contained" color="primary" onClick={handleAdd} style={{backgroundColor:'#ffa500'}}>
        New Bill
      </Button>
    </Grid>
    <Grid item sx={{marginLeft:"5px"}}>
      <Button variant="contained" color="accent" onClick={handleDelete}>
        Delete
      </Button>
    </Grid>
  </Grid>
      </Grid>

      <Grid item xs={12}>
        <TableContainer className="table-container" component={Paper}>
          <Table size="small">
            <TableHead className="table-header">
              <TableRow className="table-row">
                <TableCell className="table-header-cell">SrNo</TableCell>
                <TableCell className="table-header-cell">Bill No</TableCell>
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Customer</TableCell>
                <TableCell className="table-header-cell">Bill Amount</TableCell>
                <TableCell className="table-header-cell">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill, index) => (
                <TableRow key={bill.id} className="table-cell">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEdit(bill.id)}
                  >
                    {bill.bill_no}
                  </TableCell>
                  <TableCell>{bill.bill_date}</TableCell>
                  <TableCell>{bill.customer_name}</TableCell>
                  <TableCell>{`₹ ${bill.tot_amount}`}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        onClick={() => handleView(bill.id)}
                        size="small"
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handlemail(bill.id)}
                        size="small"
                      >
                        <MailOutlinedIcon />
                      </IconButton>
                      <IconButton onClick={() => handleAddBillWithExcel(bill.id)}  size="small">
          <DownloadIcon/>
          </IconButton>
                      <Checkbox
                        size="small"
                        checked={selectedRows.includes(bill.id)}
                        onChange={() => handleCheckboxChange(bill.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CustomPagination
              page={paginationModel.page}
              rowsPerPage={paginationModel.pageSize}
              count={pageState.total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
        </TableContainer>
        
      </Grid>
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
        messages={["Are you sure you want to delete selected bills?"]}
      />
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
            pdfData ? `${APP_BASE_PATH}${pdfData}` : newFile ? newFile : null
          }
          width="1000px"
          height="800px"
        ></iframe>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            width: "30%",
            maxWidth: "600px",
            backgroundColor: "white",
          },
        }}
      >
        <DialogTitle id="form-dialog-title">Compose Email</DialogTitle>
        <DialogContent>
        <InputLabel htmlFor="to-input">Customer Email</InputLabel>
          <Autocomplete
      freeSolo
      options={email}
      getOptionLabel={(option) => option.emailid}
      onChange={handleChange}
      value={email.find((emailItem) => emailItem.emailid == emailForm.toEmail) || null}

      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          margin="dense"
          placeholder="To"
          type="email"
     
          fullWidth
          size="small"
        />
       
      )}
    />
          <InputLabel htmlFor="message-input">Text</InputLabel>
          <TextField
            id="message-input"
            placeholder="Enter your message"
            multiline
            rows={4}
            fullWidth
            value={emailForm.message}
            onChange={(e) =>
              setEmailForm({ ...emailForm, message: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={sendEmail} color="primary" variant="contained">
            Send
          </Button>
          <Button
            onClick={() => setOpenEmailModal(false)}
            color="warning"
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
    </>
  );
};

export default BillList;
