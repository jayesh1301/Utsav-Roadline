import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Paper,
  IconButton,
  Checkbox,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SelectBranch } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import { getAllCustomers } from "../../../lib/api-customer";
import CustomPagination from '../../../components/common/ui/CustomPagination'
import {
  deletelrmaster,
  getLRByIdPdf,
  getLRByIdPdfmail,
  getallLr,
  getallLrsearch,
  getemail,
  getlrbyPrint,
  sendMail,
} from "../../../lib/api-lorryreceipt";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";

import Swal from "sweetalert2";
const LorryReceipt = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const user = useSelector((state) => state.auth);
  const [count, setCount] = useState(false);
  const [newFile, setNewfile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [pdfData1, setPdfData1] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')

  const [open1, setOpen1] = useState(false);
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(user.branch);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pageState, setPageState] = useState({
    total: 0,
  });
const [email,setEmail]=useState([])
  const [formData, setFormData] = useState({ customer: "", lr_no: "" });
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  let varbranch = 0;
  const fetchAllLr = async (branchid) => {
    setIsLoading(true);

    if (branchid == null) {
      varbranch = user.branch;
    } else {
      varbranch = branchid;
    }
    try {
      const response = await getallLr(
        varbranch,
        paginationModel.page,
        paginationModel.pageSize
      );
      console.log(response);
      const lr = response.data.lr;

      const total = response.data.total;
      
      const startIdx = paginationModel.page * paginationModel.pageSize;
      const rowsWithSrNo = lr.map((lr, index) => ({
        ...lr,
        srNo: startIdx + index + 1,
        id: lr.id,
        status: lr.statu,
      }));

      setRows(rowsWithSrNo);

      setPageState({

        total: total,
      });
      setIsLoading(false);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching places:", error);
      }
    }
  };
  useEffect(() => {
    if (!count) {
      fetchAllLr();
    }
  }, [paginationModel, varbranch]);
  
  const fetchLorryReceipts = async () => {
    setIsLoading(true);
    try {
      const response = await getallLrsearch(
        selectedBranch.branch_id,
        formData.lr_no,
        formData.customer,
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      const lr = response.data;
      const total = lr.length > 0 ? lr[0]["@totc"] : 0; // Accessing @tot_counts from the first item
      const startIdx = paginationModel.page * paginationModel.pageSize;
      const rowsWithSrNo = lr.map((lr, index) => ({
        ...lr,
        srNo: startIdx + index + 1,
        id: lr.id,
      }));

      setRows(rowsWithSrNo);
      setPageState({ total: total });
      setIsLoading(false);
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching lorry receipts:", error);
      }
    }
  };

  const getbranch = async () => {
    try {
      const response = await SelectBranch();
      const { data } = response;
      console.log(data);
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
  
  useEffect(() => {
    getcustomer();
    getbranch();
    getemaildetails();
  }, []);
  const handleAdd = () => {
    navigate("/Add-LR");
  };
  const handleSearch = () => {
    // Trigger the data fetch with current formData
    setPaginationModel({ ...paginationModel, page: 0 }); // reset to first page

    if (formData.customer == "" && formData.lr_no == "") {
      setCount(false);
      window.location.reload();
    } else {
      fetchLorryReceipts();
      setCount(true);
    }
  };
  useEffect(() => {
    if (count) {
      fetchLorryReceipts();
    }
  }, [count, paginationModel]);

  const handlePrint = (id) => {
    console.log("invoiceId", id);
    gedatabyidPrint(id);
  };
  const gedatabyidPrint = async (id) => {
    console.log(id);
    setIsLoading(true);
    try {
      const response = await getlrbyPrint(id);
      const { data } = response;
      const pdfData = response.data.returnpath;
      console.log("server checking", pdfData);

      setPdfData1(pdfData);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setOpen1(true);
      setIsLoading(false);
    }
  };
  const handleDelete = (id) => {
    console.log(`Delete ${id}`);
  };

  const handleView = (id) => {
    console.log(`View ${id}`);
    gedatabyid(id);
  };
  const handleOpen = (id) => {
    console.log("invoiceId", id);
    // setSelectedInvoiceId(id);
    //  setLoading(true);
    gedatabyid(id);
  };
  const handleClose = () => {
    setNewfile(null);
    setPdfData(null);
    // setSelectedInvoiceId(null);
    setOpen(false);
    //setOpen1(false);
  };
  const handleClose1 = () => {
    setNewfile(null);
    setPdfData1(null);
    // setSelectedInvoiceId(null);
    setOpen1(false);
    //setOpen1(false);
  };
  const gedatabyid = async (id) => {
    console.log(id);
    setIsLoading(true);
    try {
      const response = await getLRByIdPdf(id);
      const { data } = response;
      const pdfData = response.data.returnpath;
      console.log("server checking", pdfData);

      setPdfData(pdfData);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setOpen(true);
      setIsLoading(false);
    }
  };
  const columns = [
    { field: "srNo", headerName: "SrNo", flex: 0.5 },
    {
      field: "lr_no",
      headerName: "LR No",
      flex: 1.1,
      renderCell: (params) => (
        <div style={{ cursor: params.row.status == 3 ? "default" : "pointer" }}>
          {params.value}
        </div>
      ),
    },
    { field: "lr_date", headerName: "Date", flex: 1 },
    { field: "consigner", headerName: "Consignor", flex: 2 },
    { field: "loc_from", headerName: "From", flex: 1.5 },
    { field: "consignee", headerName: "Consignee", flex: 1.5 },
    { field: "loc_to", headerName: "To", flex: 1 },
    { field: "pay_type", headerName: "Pay Mode", flex: 0.8 },
    { field: "total", headerName: "Grand Total", flex: 1 , 
        renderCell: (params) => (
      <div>₹ {params.value}</div>
    ),},
    {
      field: "statu",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        let statusText = "";
        if (params.value == 1) {
          statusText = "New";
        } else if (params.value == 2) {
          statusText = "Challan";
        } else if (params.value == 3) {
          statusText = "Billed";
        } else if (params.value == 4) {
          statusText = "Delivered";
        }

        return <div>{statusText}</div>;
      },
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1.3,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Click Here To View LR">
            <IconButton onClick={() => handleOpen(params.row.id)} size="small">
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Click Here To Print LR">
            <IconButton onClick={() => handlePrint(params.row.id)} size="small">
              <LocalPrintshopOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Click Here To Send Mail">
            <IconButton onClick={() => handlemail(params.row.id)} size="small">
              <MailOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Checkbox
            size="small"
         
            onChange={(event) => handleCheckboxChange(params.row.id, event)}
            checked={params.row.isSelected}
            disabled={params.row.status == 3}
          />
        </div>
      ),
    },
  ];

  const handleCheckboxChange = (id) => {
    console.log(id);
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isSelected: !row.isSelected } : row
      )
    );

    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRows, id]
    );
  };
  const handleDeleteArticles = async () => {
    if (selectedRows.length > 0) {
      setOpenConfirm(true);
    } else {
      setConfirmmessage('Please select at least one record!');
      setConfirmationopen(true);
      setColor('warning')

      // Swal.fire({
      //   icon: "warning",
      //   title: "Nothing to delete!",
      //   text: "Please select at least one record!",
      // });
    }
  };
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setOpenConfirm(false);
    try {
      await deletelrmaster(selectedRows);
      console.log("LR with ID  deleted successfully.");
    } catch (error) {
      console.error("Error deleting article with ID :", error);
    } finally {
      setIsLoading(false);
    }

    fetchAllLr();
    getbranch()

    setSelectedRows([]);
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };
  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };

  const handleCellClick = ({ field, row }) => {
    console.log("Clicked field:", field);
    console.log("Clicked row:", row);
    if (parseInt(row.status) !== 3 && field === "lr_no") {
      handleEdit(row.id);
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit-LR/${id}`);
  };
  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      console.log("Selected Branch ID:", newValue.branch_id);

      setSelectedBranch(newValue);
      fetchAllLr(newValue.branch_id);
    } else {
      setSelectedBranch(null);
    }
  };
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
  const handlemail = async (id) => {
    setOpenEmailModal(true);
    setEmailForm({ ...emailForm, id: id });
    setIsLoading(true);
    try {
      const response = await getLRByIdPdf(id);
      const returnpath = response.data.returnpath;
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
      setIsLoading(false);
    }
  };

  let pdfpathfile;
  const sendEmail = async () => {
    console.log(emailForm);
    setIsLoading(true);
    try {
      const response = await getLRByIdPdfmail(emailForm.id);

      const pdfpath = response.data.returnpath;
      console.log("pdfpath", pdfpath);
      pdfpathfile = pdfpath;
      if (pdfpath) {
        console.log(pdfpath);
        setEmailForm({
          ...emailForm,
        });
        const options = {
          pdfpathfile,
          emailForm,
        };
        const response = await sendMail(options);
        console.log(response);
        console.log(response.status)
         
        if (response.status == 200) {

          setConfirmmessage(response.data);
          setConfirmationopen(true);
          setColor('success')
          getemaildetails()
          // Swal.fire({
          //   icon: "success",
          //   title: "Success",
          //   text: response.data,
          // });
          setOpenEmailModal(false);
        }
        else {
          setConfirmmessage("Something went wrong!");
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
      console.error("Error saving article:", error);
      // Handle error
    } finally {
      setIsLoading(false);
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
  };
  const handleInputChange = (event, newInputValue) => {
    setEmailForm({ ...emailForm, toEmail: newInputValue });
  };

  const handleChange = (event, newValue) => {
    const newemail=newValue.emailid
    setEmailForm({ ...emailForm, toEmail: newemail });
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
      <Grid container item xs={6} alignItems="center">
        <Grid item xs={4}>
          <Autocomplete
            sx={{ width: "100%" }}
            options={branch}
            getOptionLabel={(option) => option.branch_name}
            value={selectedBranch}
            onChange={handleBranchChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Branch"
                fullWidth
                size="small"
                value={selectedBranch ? selectedBranch.branch_name : ""}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <h1>Lorry Receipt</h1>
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
        <Grid item xs={6} sx={{ marginLeft: "330px" }}>
          <Paper
            elevation={3}
            style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  label="LR No"
                  fullWidth
                  size="small"
                  value={formData.lr_no}
                  onChange={(e) =>
                    setFormData({ ...formData, lr_no: e.target.value })
                  }
                />
              </Grid>
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
                      label="Customer Name"
                      size="small"
                      fullWidth
                    />
                  )}
                  onChange={(event, value) =>
                    handleAutocompleteChange(event, value)
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="accent"
                  fullWidth
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid container item xs={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleAdd} style={{backgroundColor:'#ffa500'}}>
              New LR
            </Button>
          </Grid>

          <Grid item sx={{ marginLeft: "5px" }}>
            <Button
              variant="contained"
              color="accent"
              onClick={handleDeleteArticles}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* DataGrid */}
      <Grid item xs={12}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <TableContainer className="table-container" component={Paper}>
              <Table size="small">
                <TableHead className="table-header">
                  <TableRow className="table-row">
                    {columns.map((column) => (
                      <TableCell
                        className="table-header-cell"
                        key={column.field}
                        // style={{ minWidth: columnWidthssss[column.field] }}
                      >
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
            <TableRow className="table-cell" key={row.id}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  style={{ fontSize: "12px" }}
                  onClick={(event) => handleCellClick({ field: column.field, row, value: row[column.field] })}
                >
                  {column.renderCell
                    ? column.renderCell({ value: row[column.field], row })
                    : row[column.field]}
                </TableCell>
              ))}
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
          )}
         
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
        open={open1}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={1400}
      >
        <iframe
          title="pdf-view"
          src={
            pdfData1 ? `${APP_BASE_PATH}${pdfData1}` : newFile ? newFile : null
          }
          width="800px"
          height="800px"
        ></iframe>
        <DialogActions>
          <Button onClick={handleClose1}>Close</Button>
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
            width: "30%", // Adjust width as needed
            maxWidth: "600px",
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
      <ConfirmationDialog
        open={openConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        messages={["Are you sure?", "You won't be able to revert this!"]}
      />
    </Grid>
    </>
  );
};

export default LorryReceipt;
