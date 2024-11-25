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
  DialogActions,
  DialogTitle,
  DialogContent,
  TablePagination,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableContainer,
  TableHead,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SelectBranch } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import { getallVehicle } from "../../../lib/api-vehicle";
import { getallVehicleOwener } from "../../../lib/api-vehicleowner";
import {
  delete_dc_master,
  getallItssearch,
  getallLoadingtrip,
  getLoadingTripByIdPdfmail,
  sendMail,
} from "../../../lib/api-loadingtrip";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import { APP_BASE_PATH } from "../../../lib/api-base-path";
import Swal from "sweetalert2";
import ConfirmationDialog from "../../../components/common/Notification/ConfirmationDialog";
import CustomPagination from "../../../components/common/ui/CustomPagination";
import CustomSnackbar from "../../../components/common/ui/SnackbarComponent";
import { getemail } from "../../../lib/api-lorryreceipt";

const LodingTripList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [selectedBranch, setSelectedBranch] = useState(user.branch);
  const [selectedRows, setSelectedRows] = useState([]);
  const [branch, setBranch] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    memono: "",
    truckNo: "",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [email,setEmail]=useState([])
  const [emailForm, setEmailForm] = useState({
    id: "",
    toEmail: "",
    message: "",
  });
  const [newFile, setNewfile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const [confirmmessage,setConfirmmessage] = useState("")
  const [isConfirmationopen,setConfirmationopen] = useState(false)
  const [color,setColor]=useState('')


  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [pageState, setPageState] = useState({
    total: 0,
  });

  const handleAdd = () => {
    navigate("/Add-Loading-Trip");
  };

  const handleDelete = (id) => {
    console.log(`Delete ${id}`);
  };

  const handleOpen = (id) => {
    gedatabyid(id);
  };

  const handleEdit = (id) => {
    navigate(`/edit-Loading-Trip/${id}`);
  };

  const gedatabyid = async (id) => {
    console.log(id);
    setIsLoading(true);
    try {
      const response = await getLoadingTripByIdPdfmail(id);
      const { data } = response;
      const pdfData = response.data.returnpath;
      console.log("server checking", pdfData);

      setPdfData(pdfData);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
      setOpen(true);
    }
  };
  const handlemail = async (id) => {
    setOpenEmailModal(true);
    setEmailForm({ ...emailForm, id: id });
    setIsLoading(true);
    try {
      // Fetch file name from the backend
      const response = await getLoadingTripByIdPdfmail(id);

      // Extract the file name from the returnpath
      const returnpath = response.data.returnpath;
      const fileName = returnpath.split("/").pop(); // Extracts file name from path

      console.log("fileName", fileName);

      // Set the file name in the message field
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
  const columns = [
    { field: "srNo", headerName: "SrNo", flex: 1 },
    {
      field: "dc_no",
      headerName: "LTS No",
      flex: 1,
      renderCell: (params) => (
        <div style={{ cursor: "pointer" }}>{params.value}</div>
      ),
    },
    { field: "dc_date", headerName: "Date", flex: 1 },
    { field: "vehicle_number", headerName: "Vehicle No", flex: 1 },
    { field: "from_loc", headerName: "From", flex: 1 },
    { field: "to_loc", headerName: "To", flex: 1 },
    {
      field: "hire",
      headerName: "Hire Amt",
      flex: 1,
      renderCell: (params) => (
        <div>₹ {params.value}</div>
      ),
    },
    {
      field: "bal_amt",
      headerName: "Balance",
      flex: 1,
      renderCell: (params) => (
        <div>₹ {params.value}</div>
      ),
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleOpen(params.row.id)} size="small">
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handlemail(params.row.id)} size="small">
            <MailOutlinedIcon />
          </IconButton>
          <Checkbox
            size="small"

            onChange={(event) => handleCheckboxChange(params.row.id, event)}
            checked={params.row.isSelected}
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
    }
  };
  const handleConfirmDelete = async () => {
    console.log("selectedRows", selectedRows);
    for (const id of selectedRows) {
      try {
        await delete_dc_master(id);
        console.log(`LR with ID ${id} deleted successfully.`);

        setOpenConfirm(false);
      } catch (error) {
        console.error(`Error deleting article with ID ${id}:`, error);
      }
    }
    getbranch()
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };
  const handleCancelDelete = () => {
    setOpenConfirm(false);
  };
  let varbranch = 0;
  const fetchAllLr = async (branchid) => {
    setIsLoading(true);

    if (branchid == null) {
      varbranch = user.branch;
    } else {
      varbranch = branchid;
    }
    try {
      const response = await getallLoadingtrip(
        varbranch,
        paginationModel.page,
        paginationModel.pageSize
      );
      const loadingtrip = response.data.dc;
      const total = response.data.total;
      const startIdx = paginationModel.page * paginationModel.pageSize;
      const rowsWithSrNo = loadingtrip.map((loadingtrip, index) => ({
        ...loadingtrip,
        srNo: startIdx + index + 1,
        id: loadingtrip.id,
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
      const response = await getallItssearch(
        selectedBranch.branch_id,
        formData.memono,
        formData.truckNo,
        paginationModel.page + 1,
        paginationModel.pageSize
      );

      const dc = response.data;
      const total = dc.length > 0 ? dc[0]["@totc"] : 0;
      const startIdx = paginationModel.page * paginationModel.pageSize;
      const rowsWithSrNo = dc.map((dc, index) => ({
        ...dc,
        srNo: startIdx + index + 1,
        id: dc.id,
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

  const handleSearch = () => {
    // Trigger the data fetch with current formData
    setPaginationModel({ ...paginationModel, page: 0 }); // reset to first page

    if (formData.memo == "" && formData.truckNo == "") {
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
    getemaildetails();
    getvehicle();
    getbranch();
  }, []);
  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      console.log("Selected Branch ID:", newValue.branch_id);

      setSelectedBranch(newValue);
      fetchAllLr(newValue.branch_id);
    } else {
      setSelectedBranch(null);
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
  const handleCellClick = ({ field, row }) => {
    if (field === "dc_no") {
      handleEdit(row.id); // Ensure row.id is available and correct
    }
  };
  
  const handleClose = () => {
    setNewfile(null);
    setPdfData(null);
    // setSelectedInvoiceId(null);
    setOpen(false);
    //setOpen1(false);
  };
  let pdfpathfile;
  const sendEmail = async () => {
    console.log(emailForm);
    setIsLoading(true);
    try {
      const response = await getLoadingTripByIdPdfmail(emailForm.id);

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
        if (response.status == 200) {
          setConfirmmessage( response.data);
          setConfirmationopen(true);
          setColor('success')
          getemaildetails()
          // Swal.fire({
          //   icon: "success",
          //   title: "Success",
          //   text: response.data,
          // });
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
      console.error("Error saving article:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPaginationModel((prevModel) => ({ ...prevModel, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      pageSize: parseInt(event.target.value, 10),
      page: 0,
    }));
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

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={6}>
            <Autocomplete
              sx={{ width: "40%" }}
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

          <Grid item xs={6}>
            <h1>Loading Trip</h1>
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
                      label="Enter LTS Number"
                      fullWidth
                      size="small"
                      value={formData.memono}
                      onChange={(e) =>
                        setFormData({ ...formData, memono: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
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
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleAdd} style={{backgroundColor:'#ffa500'}}>
                New Loading Trip
              </Button>
            </Grid>

            <Grid item  sx={{marginLeft:"5px"}}>
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
                  onClick={() => handleCellClick({ field: column.field, row })}
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
                pdfData
                  ? `${APP_BASE_PATH}${pdfData}`
                  : newFile
                  ? newFile
                  : null
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
            fullWidth={true} // Ensure the dialog takes up full width
            maxWidth="sm" // Set the maximum width of the dialog
            sx={{
              // Apply custom styles here
              "& .MuiDialog-paper": {
                width: "30%", // Adjust width as needed
                maxWidth: "600px", // Maximum width if needed
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
      )}
    </>
  );
};

export default LodingTripList;
