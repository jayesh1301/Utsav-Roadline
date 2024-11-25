import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Paper,
  FormControl,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SelectBranch } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import { getAllCustomers } from "../../../lib/api-customer";
import { getlrlistforreportbydate } from "../../../lib/api-Lrreciptregistration";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomPagination from "../../../components/common/ui/CustomPagination";

const LorryReceiptRegister = () => {
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
  const handleTextSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      Lr_no: value,
    }));
  };
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branch, setBranch] = useState([]);
  const [lorryReceipts, setLorryReceipts] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs("2024-04-01"));
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedConsignor, setSelectedConsignor] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("option1");

  const user = useSelector((state) => state.auth);

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

  const fetchPendingAllLr = async () => {
    setLoading(true);
    try {
  
      const formattedFromDate = fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null;
      const formattedToDate = toDate ? dayjs(toDate).format("YYYY-MM-DD") : null;
      const paymentMode =
        selectedPaymentMode === "option1"
          ? ""
          : selectedPaymentMode === "option2"
          ? "To Pay"
          : selectedPaymentMode === "option3"
          ? "Paid"
          : "TBB";
      const response = await getlrlistforreportbydate(
        selectedBranch.branch_id,
        formattedFromDate,
        formattedToDate,
        paginationModel.page,
        paginationModel.pageSize,
        searchModel.Lr_no,
        selectedConsignor ? selectedConsignor.customer_name : "",
        paymentMode
      );
      const pendingLR = response.data.pendinglr;
      const total = response.data.total;

      setLorryReceipts(pendingLR);
      setPageState({
        total: total,
      });
    } catch (error) {
      console.error("Error fetching lorry receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranch && paginationModel) {
      fetchPendingAllLr();
    }
  }, [selectedBranch, paginationModel, searchModel]);

  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      setSelectedBranch(newValue);
    } else {
      setSelectedBranch(null);
    }
  };

  const handleSearch = () => {
    fetchPendingAllLr();
  };

  const handleConsignorChange = (event, value) => {
    setSelectedConsignor(value);
  };

  const handleDateChange = (setter) => (newValue) => {
    setter(newValue);
  };

  const handlePaymentModeChange = (event) => {
    setSelectedPaymentMode(event.target.value);
  };

  const columns = [
    { field: "srNo", headerName: "SrNo", flex: 0.5 },
    { field: "lr_no", headerName: "L.R. Note No", flex: 1.4 },
    {
      field: "lr_date",
      headerName: "Consign Date",
      flex: 1.3,
      renderCell: (params) => {
        // Log params.value to check its format
        console.log('Original date value:', params.value);
    
        // Convert to dayjs object and format to DD-MM-YYYY
        const date = params.value ? dayjs(params.value, "YYYY-MM-DD").format("DD-MM-YYYY") : "";
        
        return <div style={{ textAlign: 'center' }}>{date}</div>;
      }
    },
    { 
      field: "consignor", 
      headerName: "Consignor Name", 
      flex: 3.5,
      renderCell: (params) => {
        // Example logic to break lines after a certain number of characters
        const maxLengthBeforeBreak = 31;
        const text = params.value || "";
        const displayText = text.length > maxLengthBeforeBreak ? `${text.substring(0, maxLengthBeforeBreak)}<br />${text.substring(maxLengthBeforeBreak)}` : text;
        return <div dangerouslySetInnerHTML={{ __html: displayText }} style={{ textAlign: 'center' }} />;
      }
    },
    { 
      field: "consignee", 
      headerName: "Consignee Name", 
      flex: 3,
      
      renderCell: (params) => {
        // Example logic to break lines after a certain number of characters
        const maxLengthBeforeBreak = 31;
        const text = params.value || "";
        const displayText = text.length > maxLengthBeforeBreak ? `${text.substring(0, maxLengthBeforeBreak)}<br />${text.substring(maxLengthBeforeBreak)}` : text;
        return <div dangerouslySetInnerHTML={{ __html: displayText }} style={{ textAlign: 'center' }} />;
      }
    },

    { 
      field: "from_loc", 
      headerName: "From", 
      flex: 1.3,
      renderCell: (params) => {
        const text = params.value || "";
        const words = text.split(" ");
        const displayText = words.join("<br />");
        return <div dangerouslySetInnerHTML={{ __html: displayText }} style={{ textAlign: 'center' }} />;
      }
    },
    { field: "to_loc", headerName: "To", flex: 1.4,
      renderCell: (params) => {
        const text = params.value || "";
        const words = text.split(" ");
        const displayText = words.join("<br />");
        return <div dangerouslySetInnerHTML={{ __html: displayText }} style={{ textAlign: 'center' }} />;
      }
     },
    { field: "pay_type", headerName: "Payment Mode", flex: 1.4 },
    { field: "no_of_articles", headerName: "Total Qty", flex: 1 },
    { field: "weight", headerName: "Total Weight", flex: 1.2 },
    { field: "total", headerName: "Grand Total", flex: 1.2 ,},
  ];
  

  const fetchAllPendingLr = async () => {
    setLoading(true);
    try {
      const response = await getlrlistforreportbydate(
        selectedBranch.branch_id,
        dayjs(fromDate).format("YYYY-MM-DD"),
        dayjs(toDate).format("YYYY-MM-DD"),
        0,
        pageState.total,
        searchModel.Lr_no,
        selectedConsignor ? selectedConsignor.customer_name : "",
        selectedPaymentMode === "option1"
          ? ""
          : selectedPaymentMode === "option2"
          ? "To Pay"
          : selectedPaymentMode === "option3"
          ? "Paid"
          : "TBB"
      );
      const pendingLR = response.data.pendinglr;
      return pendingLR;
    } catch (error) {
      console.error("Error fetching all LR list:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    const allPendingLr = await fetchAllPendingLr();
    const filteredRows = allPendingLr.map(({lr_no, lr_date, no_of_articles, weight, consignor, consignee, from_loc, to_loc, pay_type, total }) => ({
      lr_no,
      lr_date,
      no_of_articles,
      chargeble_wt:weight,
      consignor_name: consignor,
      consignee_name:consignee,
      from:from_loc,
      to:to_loc,
      pay_mode:pay_type,
      total_amount:total,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LRREPORTFILE");
    XLSX.writeFile(workbook, "LRREPORTFILE.xlsx");
  };

  const exportToPDF = async () => {
    const allPendingLr = await fetchAllPendingLr();
    const filteredRows = allPendingLr.map(
      ({
        lr_no,
        lr_date,
        consignor,
        consignee,
        from_loc,
        to_loc,
        pay_type,
        no_of_articles,
        weight,
        total,
      }) => ({
        lr_no,
        lr_date,
        consignor,
        consignee,
        from_loc,
        to_loc,
        pay_type,
        no_of_articles,
        weight,
        total,
      })
    );
  
    const doc = new jsPDF();
    const tableColumn = [
      "L.R. Note No",
      "Consign Date",
      "Consignor Name",
      "Consignee Name",
      "From",
      "To",
      "Payment Mode",
      "Total Qty",
      "Total Weight",
      "Grand Total",
    ];
    const tableRows = filteredRows.map((row) => Object.values(row));
  

    doc.setFontSize(18);
    const title = "LR Register";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
  
    doc.text(title, textX, 15);
  
  
    const columnWidths = [
      20, // L.R. Note No
      20, // Consign Date
      30, // Consignor Name
      30, // Consignee Name
      15, // From
      15, // To
      20, // Payment Mode
      15, // Total Qty
      15, // Total Weight
      15, // Grand Total
    ];
    const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
    const margin = (pageWidth - tableWidth) / 2;
  
 
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      margin: { left: margin, right: margin },
      headStyles: {
        fontSize: 8, 
      },
      bodyStyles: {
        fontSize: 7, 
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },  // L.R. Note No
        1: { cellWidth: columnWidths[1] },  // Consign Date
        2: { cellWidth: columnWidths[2] },  // Consignor Name
        3: { cellWidth: columnWidths[3] },  // Consignee Name
        4: { cellWidth: columnWidths[4] },  // From
        5: { cellWidth: columnWidths[5] },  // To
        6: { cellWidth: columnWidths[6] },  // Payment Mode
        7: { cellWidth: columnWidths[7] },  // Total Qty
        8: { cellWidth: columnWidths[8] },  // Total Weight
        9: { cellWidth: columnWidths[9] },  // Grand Total
      },
    });
  
    doc.save("lr_report_export.pdf");
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

        <Grid item xs={6} alignItems="center">
          <h1>Lorry Receipt Register</h1>
        </Grid>

        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ marginTop: "5px" }}
        >
          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                
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
                            label:"From"
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
               
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
                            label:"To"
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  container
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <Autocomplete
                      id="consignor-autocomplete"
                      options={customerOptions}
                      getOptionLabel={(option) => option.customer_name}
                      value={selectedConsignor}
                      onChange={handleConsignorChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Customer Name"
                          fullWidth
                          label="Customer Name"
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
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

                <Grid
                  item
                  xs={12}
                  justifyContent="center"
                  alignContent="center"
                  textAlign="center"
                >
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="options"
                      name="options"
                      value={selectedPaymentMode}
                      onChange={handlePaymentModeChange}
                    >
                      <FormControlLabel
                        value="option1"
                        control={<Radio color="primary" />}
                        label="All"
                      />
                      <FormControlLabel
                        value="option2"
                        control={<Radio color="primary" />}
                        label="ToPay"
                      />
                      <FormControlLabel
                        value="option3"
                        control={<Radio color="primary" />}
                        label="Paid"
                      />
                      <FormControlLabel
                        value="option4"
                        control={<Radio color="primary" />}
                        label="TBB"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12} style={{  textAlign: "right" }}>
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
                  {lorryReceipts.map((row) => (
                    <TableRow className="table-cell" key={row.id}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          style={{
                            // minWidth: columnWidthssss[column.field],
                            fontSize: "12px",
                          }}
                        >
                         {column.field === "total"
                ? `₹ ${row[column.field]}`
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

        <Grid container item xs={12} justifyContent="flex-start">
          <Button
            variant="contained"
            color="accent"
            style={{ marginLeft: "5px" }}
            onClick={exportToExcel}
          >
            <VerticalAlignBottomIcon />
            Export To Excel
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

export default LorryReceiptRegister;
