import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  TextField,
  Button,
  Paper,
  Autocomplete,
  FormControl,
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
import dayjs from "dayjs";
import { getAllCustomers } from "../../../lib/api-customer";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import { getlslistforreportbydate, getlslistforreportbydatesearch } from "../../../lib/api-LoadingTripResistration";
import SearchIcon from "@mui/icons-material/Search";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getallVehicleOwener } from "../../../lib/api-vehicleowner";
import CustomPagination from "../../../components/common/ui/CustomPagination";

const LoadingTripRegister = () => {
  const user = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [clicksearch,setClicksearch]=useState(false)
  const [branch, setBranch] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs("2024-04-01"));
  const [toDate, setToDate] = useState(dayjs());
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedConsignor, setSelectedConsignor] = useState(null);
  const [lrNo, setLrNo] = useState("");
  const [rows, setRows] = useState([]);
  const [vehicleOwner, setVehicleOwner] = useState([]);
  const [selectedVehicleOwner, setSelectedVehicleOwner] = useState("");
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

    // setSearchModel((prevModel) => ({
    //   ...prevModel,
    //   Lr_no: value,
    // }));
    
      fetchLoadingTrips(value)
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

  const fetchLoadingforserach = async () => {
    setLoading(true);
    if ( fromDate && toDate) {
      try {
        const response = await getlslistforreportbydatesearch(
          null,
          fromDate.format("YYYY-MM-DD"),
          toDate.format("YYYY-MM-DD"),
          paginationModel.page,
          paginationModel.pageSize,
          searchModel.Lr_no,
          lrNo,
          selectedVehicleOwner  
        );

        const lodingtrip = response.data.Loadingtripregister;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const loadingtripregister = lodingtrip.map((lr, index) => ({
          id: lr.lr_id,
          SrNo: startIdx + index + 1,
          ...lr,
          dc_date: lr.dc_date ? dayjs(lr.dc_date).format("DD-MM-YYYY") : "",
        }));

        setRows(loadingtripregister);
        setPageState({
          total: total,
        });
      } catch (error) {
        console.error("Failed to fetch loading trips:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const fetchLoadingTrips = async (value) => {
    
    setLoading(true);
    if ( fromDate && toDate) {
      try {
        const response = await getlslistforreportbydate(
          null,
          fromDate.format("YYYY-MM-DD"),
          toDate.format("YYYY-MM-DD"),
          paginationModel.page,
          paginationModel.pageSize,
          value 
        );

        const lodingtrip = response.data.Loadingtripregister;
        const total = response.data.total;
        const startIdx = paginationModel.page * paginationModel.pageSize;
        const loadingtripregister = lodingtrip.map((lr, index) => ({
          id: lr.lr_id,
          SrNo: startIdx + index + 1,
          ...lr,
          dc_date: lr.dc_date ? dayjs(lr.dc_date).format("DD-MM-YYYY") : "",
        }));
        
          setRows(loadingtripregister);
        
        
        setPageState({
          total: total,
        });
      } catch (error) {
        console.error("Failed to fetch loading trips:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if ( paginationModel) {
      fetchLoadingTrips();
if(clicksearch){
  fetchLoadingforserach()
}
    }
  }, [ paginationModel, searchModel]);

  const handleSearch = () => {
    setClicksearch(true)
    fetchLoadingforserach();
  };
const handleReset =()=>{
  window.location.reload();
}
  const handleLrNoChange = (event) => {
    setLrNo(event.target.value);
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
  

  const columns = [
    { field: "SrNo", headerName: "SrNo" },
    { field: "dc_no", headerName: "LTS No" },
    { field: "dc_date", headerName: "Date" },
    { field: "from", headerName: "From" },
    { field: "to", headerName: "To" },
    { field: "vehicleno", headerName: "Vehicle No" },
    { field: "vehical_owner_name", headerName: "Vehicle Owener Name" },
    { field: "hire", headerName: "Hire Amt" },
    { field: "total", headerName: "Balace Amt" },
    { field: "driver_name", headerName: "Driver Name" },
    { field: "total_packages", headerName: "Total No Of Pck" },
    { field: "total_wt", headerName: "Total Weight" },
    { field: "staus", headerName: "Status", }
  ];
  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      setSelectedBranch(newValue);
    } else {
      setSelectedBranch(null);
    }
  };

  const handleDateChange = (setter) => (newValue) => {
    setter(newValue);
  };
  const handleConsignorChange = (event, value) => {
    setSelectedConsignor(value);
  };

  const ExcelLodingtrip = async () => {
    if ( fromDate && toDate) {
      try {
        const response = await getlslistforreportbydatesearch(
          null,
          fromDate.format("YYYY-MM-DD"),
          toDate.format("YYYY-MM-DD"),
          0, // Fetch all data for export
          pageState.total, // Assuming this is the total number of rows
          searchModel.Lr_no,
          lrNo,
          selectedVehicleOwner  
        );
        const lodingtrip = response.data.Loadingtripregister;
        const startIdx = 0;
        return lodingtrip.map((lr, index) => ({
          id: lr.lr_id,
          SrNo: startIdx + index + 1,
          ...lr,
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
      const allPendingLr = await ExcelLodingtrip();
      const filteredRows = allPendingLr.map(
        ({
          dc_no,
          dc_date,
          from,
          to,
          driver_name,
          vehical_owner_name,
          vehicleno,
          hire,
          total,
          total_packages,
          total_wt, 
          pay_type,
        }) => ({
          dc_no,
          dc_date,
          from,
          to,       
          driver_name,
          vehical_owner_name,
          vehicleno,
          hire,
          total,
          total_packages,
          total_wt, 
          pay_type,
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(filteredRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "LTSREPORTFILE_export");
      XLSX.writeFile(workbook, "LTSREPORTFILE_export.xlsx");
    } catch (error) {
      console.error("Failed to export to Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const allPendingLr = await ExcelLodingtrip();
      const filteredRows = allPendingLr.map(
        ({
          dc_no,
          dc_date,
          from,
          to,
          driver_name,
          vehical_owner_name,
          vehicleno,
          hire,
          total,
          total_packages,
          total_wt, 
          pay_type,
        }) => ({
          dc_no,
          dc_date,
          from,
          to,
          driver_name,
          vehical_owner_name,
          vehicleno,
          hire,
          total,
          total_packages,
          total_wt, 
          pay_type,
        })
      );

      const doc = new jsPDF();
      const tableColumn = [
        "LTS No",
        "Date",
        "From",
        "To",
        "Driver Name",
        "Vehical Owner Name",
        "Vehicle No",
        "Hire Amount",
        "Total Amount",
        "No. of Package",
        "Weight",
        "Status",
      ];
      const tableRows = filteredRows.map((row) => Object.values(row));
      doc.setFontSize(18);
      const title = "LTS REPORT";
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(title);
      const textX = (pageWidth - textWidth) / 2;

      doc.text(title, textX, 15);

      const columnWidths = [
        9, //LTSNo
        10, //Challan Generated From
        10, //Date
        10, //Vehicle No
        15, //To
        16, //Total Amount
        15, //LR No
        9, //Consignor Name
        9, //Consignee Name
        9, //No. of Article
        9, //Weight
        9, //Status
      ];

      const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
      const margin = (pageWidth - tableWidth) / 2;
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        margin: { left: margin, right: margin },
        headStyles: {
          fontSize: 6,
        },
        bodyStyles: {
          fontSize: 6,
        },
        columnStyles: {
          0: { cellWidth: columnWidths[0] },
          1: { cellWidth: columnWidths[1] },
          2: { cellWidth: columnWidths[2] },
          3: { cellWidth: columnWidths[3] },
          4: { cellWidth: columnWidths[4] },
          5: { cellWidth: columnWidths[5] },
          6: { cellWidth: columnWidths[6] },
          7: { cellWidth: columnWidths[7] },
          8: { cellWidth: columnWidths[8] },
          9: { cellWidth: columnWidths[9] },
          10: { cellWidth: columnWidths[10] },
          11: { cellWidth: columnWidths[11] },
          12: { cellWidth: columnWidths[12] },
        },
      });

      doc.text("LTSREPORTFILE_export", 14, 15);
      doc.save("LTSREPORTFILE_export.pdf");
    } catch (error) {
      console.error("Failed to export to PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleOwner = async () => {
    try {
      const response = await getallVehicleOwener();
      const { data } = response;

      const uniqueOwnerNames = new Set();
      const vehicleOwnerList = [];

      data.forEach((vehicleOwner) => {
        if (!uniqueOwnerNames.has(vehicleOwner.vehical_owner_name)) {
          uniqueOwnerNames.add(vehicleOwner.vehical_owner_name);
          vehicleOwnerList.push({
            id: vehicleOwner.vod_id,
            vehical_owner_name: vehicleOwner.vehical_owner_name,
          });
        }
      });

      setVehicleOwner(vehicleOwnerList);
    } catch (error) {
      console.error("Error fetching vehicle owners:", error);
    }
  };
  
  const handleAutocompleteChangeVehicle = (event, value) => {
    if (!value || !value.name) {
      setSelectedVehicleOwner("");
      return;
    }
  
    const selectedType = vehicleOwner.find(
      (type) => type.vehical_owner_name === value.name
    );
  
    if (selectedType) {
      setSelectedVehicleOwner(selectedType.vehical_owner_name);
    } else {
      setSelectedVehicleOwner("");
    }
  };
  

  useEffect(() => {
    getVehicleOwner();
  }, []);
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
          <h1>Loading Trip Register</h1>
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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={1.6}>
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
                <Grid item xs={1.6}>
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
                {/* <Grid item xs={2}>
                  <TextField
                    label="DC No."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={dcNo}
                    onChange={handleDcNoChange}
                  />
                </Grid> */}

                <Grid item xs={2}>
                  <TextField
                    label="LR No."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={lrNo}
                    onChange={handleLrNoChange}
                  />
                </Grid>
                <Grid item xs={2.8}>
                  <Autocomplete
                    id="vehicleOwnerName"
                    options={
                      vehicleOwner
                        ? vehicleOwner.map((type) => ({
                            id: type.id,
                            name: type.vehical_owner_name,
                          }))
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="vehicleOwnerName"
                        variant="outlined"
                        label="Vehicle Owner Name"
                        size="small"
                        fullWidth
                      />
                    )}
                    onChange={(event, value) =>
                      handleAutocompleteChangeVehicle(event, value)
                    }
                  />
                </Grid>

                <Grid item xs={1}>
                  <Button
                    variant="contained"
                    color="accent"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
                 <Grid item xs={1}>
                  <Button
                    variant="contained"
                    color="accent"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* TextField */}
        <Grid item xs={12} style={{ textAlign: "right", }}>
          <TextField
          label="Search"
          
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
                         // style={{ minWidth: columnWidthssss[column.field] }}
                       >
                                 {(column.field === "total" || column.field === "hire")
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

        {/* Buttons */}
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

export default LoadingTripRegister;
