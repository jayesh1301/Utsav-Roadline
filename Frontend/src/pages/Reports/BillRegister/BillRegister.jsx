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
  FormControl,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SelectBranch } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import { getAllCustomers } from "../../../lib/api-customer";
import dayjs from "dayjs";
import { getBillreports } from "../../../lib/api-billreport";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import SearchIcon from "@mui/icons-material/Search";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomPagination from "../../../components/common/ui/CustomPagination";

const BillRegister = () => {
  const user = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branch, setBranch] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs("2024-04-01"));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedConsignor, setSelectedConsignor] = useState(null);
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [lrNo, setLrNo] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [pageState, setPageState] = useState({
    total: 0,
  });

  const [searchModel, setSearchModel] = useState({
    Lr_no: "",
  });
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
    getbranch();
    fetchCustomers();
  }, []);

  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      setSelectedBranch(newValue);
    } else {
      setSelectedBranch(null);
    }
  };
  const handleConsignorChange = (event, value) => {
    setSelectedConsignor(value);
  };

  const handleDateChange = (setter) => (newValue) => {
    setter(newValue);
  };

  const handleLrNoChange = (event) => {
    const trimmedValue = event.target.value.trim();
    setLrNo(trimmedValue);
  };

  const fetchBillReports = async () => {
    if (  fromDate && toDate) {
      setLoading(true);
      try {
        const response = await getBillreports(
          null,
          fromDate.format("YYYY-MM-DD"),
          toDate.format("YYYY-MM-DD"),
          paginationModel.page,
          paginationModel.pageSize,
          searchModel.Lr_no,
          selectedConsignor ? selectedConsignor.customer_name : "",
          lrNo
        );
        console.log(response);

        const Billregister = response.data.BillRegisters;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const Billregisters = Billregister.map((lr, index) => ({
          SrNo: startIdx + index + 1,
          ...lr,
          grand_total: lr.total_amount,
          bill_date: lr.bill_date
            ? dayjs(lr.bill_date).format("DD-MM-YYYY")
            : "",
        }));
        setRows(Billregisters);
        setPageState({
          total: total,
        });

        setTotalAmount(response.data.totalAmount);
      } catch (error) {
        console.error("Failed to fetch bill reports:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    
      fetchBillReports();
    
  }, [ paginationModel, searchModel]);

  const columns = [
    { field: "SrNo", headerName: "SrNo", flex: 0.1 },
    { field: "bill_no", headerName: "Bill No", flex: 1 },
    { field: "bill_date", headerName: "Date", flex: 1 },
    { field: "customer_name", headerName: "Customer Name", flex: 5 },
    { field: "total_amount", headerName: "Total", flex: 1 },
    { field: "grand_total", headerName: "Grand Total", flex: 1 },
  ];

  const handleSearch = () => {
    fetchBillReports();
  };

  const handleTextSearch = (event) => {
    const { value } = event.target;
    const trimmedValue = value.trim();

    setSearchModel((prevModel) => ({
      ...prevModel,
      Lr_no: trimmedValue,
    }));
  };
  const ExportBillRegister = async () => {
    if (fromDate && toDate) {
      try {
        const response = await getBillreports(
          null,
          fromDate.format("YYYY-MM-DD"),
          toDate.format("YYYY-MM-DD"),
          0, // Fetch all data for export
          pageState.total, // Assuming this is the total number of rows
          searchModel.Lr_no,
          selectedConsignor ? selectedConsignor.customer_name : "",
          lrNo
        );

        const Billregister = response.data.BillRegisters;
        console.log(BillRegister)
        const startIdx = 0;
        return Billregister.map((lr, index) => ({
          SrNo: startIdx + index + 1,
          ...lr,
          grand_total: lr.total_amount,
        }));
      } catch (error) {
        console.error("Failed to fetch loading trips for export:", error);
        return [];
      }
    }
    return [];
  };
  const exportToExcel = async () => {
    setLoading(true);
    try {
      const allPendingLr = await ExportBillRegister();
      console.log("allPendingLr",allPendingLr)
      const filteredRows = allPendingLr.map(
        ({ bill_no, bill_date, customer_name, total_amount,grand_total }) => ({
          bill_no,
          bill_date: bill_date ? dayjs(bill_date).format("DD-MM-YYYY") : "",
          customer_name,
          total_amount,
          grand_total
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(filteredRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "BILLREPORTFILE_export"
      );
      XLSX.writeFile(workbook, "BILLREPORTFILE_export.xlsx");
    } catch (error) {
      console.error("Failed to export to Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const allPendingLr = await ExportBillRegister();
      
      const filteredRows = allPendingLr.map(
        ({ bill_no, bill_date, customer_name, total_amount, grand_total }) => ({
          bill_no,
          bill_date: bill_date ? dayjs(bill_date).format("DD-MM-YYYY") : "",
          customer_name,
          total_amount,  // Make sure this is correct
          grand_total,  // Make sure this is correct
        })
      );
  
      const doc = new jsPDF();
      const tableColumn = [
        "Bill Number",
        "Date",
        "Customer Name",
        "Total",
        "Grand Total",
      ];
      const tableRows = filteredRows.map((row) => [
        row.bill_no,
        row.bill_date,
        row.customer_name,
        row.total_amount,  // Ensure this is the total amount
        row.grand_total,  // Ensure this is the grand total
      ]);
  
      // Title text settings
      const title = "Bill Register";
      const titleWidth =
        (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) / 2;
      const pageWidth = doc.internal.pageSize.getWidth();
      const titleX = (pageWidth - titleWidth) / 2;
  
      // Add centered title
      doc.setFontSize(18); // Set font size for title
      doc.text(title, titleX, 15);
  
      // AutoTable configuration
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35, // Adjust startY to leave space below the title
      });
  
      // Save the PDF with filename
      doc.save("Bill_Register.pdf");
    } catch (error) {
      console.error("Failed to export to PDF:", error);
    } finally {
      setLoading(false);
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
  return (
    <>
      {loading && <LoadingSpinner />}
      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        <Grid container item xs={6} alignItems="center">
          <Grid item xs={4}>
            {/* <Autocomplete
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
            /> */}
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <h1>Bill Register</h1>
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
          <Grid item xs={12}>
            <Paper
              elevation={3}
              style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: "2px" }}
              >
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        placeholder="From Date"
                        format="DD-MM-YYYY"
                        value={fromDate}
                        onChange={handleDateChange(setFromDate)}
                        slotProps={{
                          textField: {
                            size: "small",
                            name: "fromDate",
                            label: "From",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        placeholder="To Date"
                        format="DD-MM-YYYY"
                        value={toDate}
                        onChange={handleDateChange(setToDate)}
                        slotProps={{
                          textField: {
                            size: "small",
                            name: "toDate",
                            label: "To",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    id="consignor-autocomplete"
                    options={customerOptions}
                    getOptionLabel={(option) => option.customer_name}
                    value={selectedConsignor}
                    onChange={handleConsignorChange}
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
                <Grid item xs={3}>
                  <TextField
                    label="LR No."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={lrNo}
                    onChange={handleLrNoChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="accent"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* TextField */}
        <Grid item xs={12} style={{ textAlign: "right" }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <SearchIcon style={{ color: "black" }} />,
            }}
            onChange={(event) => {
              handleTextSearch(event);
            }}
          />
        </Grid>

        {/* DataGrid */}
        <Grid item xs={12}>
          {loading ? (
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
                          style={{
                            // minWidth: columnWidthssss[column.field],
                            fontSize: "12px",
                          }}
                        >
    {column.field === "total_amount" || column.field === "grand_total"  ? `₹ ${row[column.field]}`
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

        {/* Buttons */}
        <Grid container item xs={12} justifyContent="flex-start">
          <Button
            variant="contained"
            color="accent"
            style={{ marginLeft: "5px" }}
            onClick={exportToExcel}
          >
            <VerticalAlignBottomIcon />
            Export To Excell
          </Button>
          <Button
            variant="contained"
            color="accent"
            style={{ marginLeft: "5px" }}
            onClick={exportToPDF}
          >
            <VerticalAlignBottomIcon />
            Export To PDF
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default BillRegister;
