import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  TextField,
  Button,
  Paper,
  Autocomplete,
  IconButton,
  Typography,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SelectBranch } from "../../../lib/api-branch";
import { getpendinglrlistforreportbydefault } from "../../../lib/api-pendinglr";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import SearchIcon from "@mui/icons-material/Search";
import { getAllCustomers } from "../../../lib/api-customer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import dayjs from "dayjs";
import CustomPagination from "../../../components/common/ui/CustomPagination";

const PendingLRStatus = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branch, setBranch] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedConsignor, setSelectedConsignor] = useState(null);
  const [selectedConsignee, setSelectedConsignee] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [pageState, setPageState] = useState({
    total: 0,
  });
  const [searchModel, setSearchModel] = useState({
    lr_no: "",
  });

  const handleTextFieldSearch = (event) => {
    const { value } = event.target;
    setSearchModel((prevModel) => ({
      ...prevModel,
      lr_no: value,
    }));
  };

  const handleConsignorChange = (event, value) => {
    setSelectedConsignor(value);
  };

  const handleConsigneeChange = (event, value) => {
    setSelectedConsignee(value);
  };

  const handleSearch = () => {
    fetchPendingAllLr();
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

  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      setSelectedBranch(newValue);
      fetchPendingAllLr(newValue.branch_id);
    } else {
      setSelectedBranch(null);
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

  const fetchPendingAllLr = async () => {
    setLoading(true);
    try {
      const response = await getpendinglrlistforreportbydefault(
        selectedBranch.branch_id,
        paginationModel.page,
        paginationModel.pageSize,
        searchModel.lr_no,
        selectedConsignor ? selectedConsignor.customer_name : "",
        selectedConsignee ? selectedConsignee.customer_name : ""
      );
      const pendingLR = response.data.pendingLR;
      const total = response.data.total;
      const formattedPendingLR = pendingLR.map((lr) => ({
        ...lr,
        lr_date: lr.lr_date ? dayjs(lr.lr_date).format("DD-MM-YYYY") : "",
      }));
      setRows(formattedPendingLR);
      setPageState({
        total: total,
      });
    } catch (error) {
      console.error("Error fetching LR list:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchAllPendingLr = async () => {
    setLoading(true);
    try {
      const response = await getpendinglrlistforreportbydefault(
        selectedBranch.branch_id,
        0,
        pageState.total, // Fetch all records
        searchModel.lr_no,
        selectedConsignor ? selectedConsignor.customer_name : "",
        selectedConsignee ? selectedConsignee.customer_name : ""
      );
      const pendingLR = response.data.pendingLR;
      return pendingLR;
    } catch (error) {
      console.error("Error fetching all LR list:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranch && paginationModel) {
      fetchPendingAllLr();
    }
  }, [selectedBranch, paginationModel, searchModel]);

  useEffect(() => {
    getbranch();
    fetchCustomers();
  }, []);

  const columns = [
    { field: "srNo", headerName: "SrNo", flex: 0.1 },
    { field: "lr_no", headerName: "LR No", flex: 0.5 },
    { field: "lr_date", headerName: "Date", flex: 0.4 },
    { field: "consignor", headerName: "Consignor", flex: 1 },
    { field: "consignee", headerName: "Consignee", flex: 1 },
    { field: "no_of_articles", headerName: "No. of Articles", flex: 0.5 },
    { field: "weight", headerName: "Weight", flex: 0.5 },
  ];

  const exportToExcel = async () => {
    const allPendingLr = await fetchAllPendingLr();
    const filteredRows = allPendingLr.map(({ id, srNo, ...rest }) => ({
      lr_no: rest.lr_no,
      lr_date: rest.lr_date,
      no_of_articles: rest.no_of_articles,
      actual_weight: rest.weight,
      consignor_name: rest.consignor,
      consignee_name: rest.consignee,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LRREPORTFILE");
    XLSX.writeFile(workbook, "LRREPORTFILE.xlsx");
  };

  const exportToPDF = async () => {
    const allPendingLr = await fetchAllPendingLr();
    const doc = new jsPDF();

    const filteredRows = allPendingLr.map(({ id, srNo, ...rest }) => ({
      LR_No: rest.lr_no,
      Date: rest.lr_date,
      No_of_Articles: rest.no_of_articles,
      Weight: rest.weight,
      Consignor: rest.consignor,
      Consignee: rest.consignee,
    }));

    const tableColumn = [
      "LR No",
      "Date",
      "No. of Articles",
      "Weight",
      "Consignor",
      "Consignee",
    ];
    const tableRows = filteredRows.map(row => Object.values(row));

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.text("Pending LR Report", 14, 15);
    doc.save("LRREPORTFILE.pdf");
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

        <Grid item xs={6}>
          <h1>Pending LR</h1>
        </Grid>

        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justifyContent="center"
          spacing={2}
        
        >
          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{ paddingRight: 50, paddingLeft: 20, paddingBottom: 20 }}
            >
              <Grid container spacing={2} alignItems="center">
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
                        label="Consignor"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={5}>
            
                  <Autocomplete
                    id="consignee-autocomplete"
                    options={customerOptions}
                    getOptionLabel={(option) => option.customer_name}
                    value={selectedConsignee}
                    onChange={handleConsigneeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Consignee"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={1}>
                  <Button variant="contained" color="accent" onClick={handleSearch}>
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
            onChange={handleTextFieldSearch}
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
                          {row[column.field]}
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
          <Button  variant="contained" color="accent" onClick={exportToExcel}>
          <VerticalAlignBottomIcon />
            Export to Excel
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

export default PendingLRStatus;
