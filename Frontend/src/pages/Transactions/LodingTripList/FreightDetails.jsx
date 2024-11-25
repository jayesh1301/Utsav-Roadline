import React, { useEffect, useState, useCallback } from "react";
import {
  Paper,
  Grid,
  TextField,
  Button,
  InputLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FixedSizeList } from "react-window";
import LoadingSpinner from "../../../components/common/ui/LoadingSpinner";
import { useSelector } from "react-redux";
import {
  getloadingsheetFreightbyid,
  getlrdetailsforloadsheet,
  getlrforloadingsheet,
  getlrforloadingsheetedit,
} from "../../../lib/api-loadingtrip";
import { useParams } from "react-router-dom";
import ImageList from '@mui/material/ImageList';
import InputAdornment from '@mui/material/InputAdornment';

const FreightDetails = ({ handleFreightDetails, isedit }) => {
  const [lrno, setLrno] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadin, setIsLoadin] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const user = useSelector((state) => state.auth);
  const [showAmtChecked, setShowAmtIds] = useState([]);
  const [Lrnodetails, setLrnodetails] = useState([]);
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [formState, setFormState] = useState({
    totHireRs: 0,
    extraWtChar: 0,
    hamali: 0,
    commission: 0,
    advAmt: 0,
    driverChar: 0,
    dieselChar: 0,
    petrolPump: "",
    total: 0,
    totalPackages: 0,
    totalWeight: 0,
  });
  const [count, setCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    handleFreightDetails(formState, rows, showAmtChecked, Lrnodetails);
  }, [formState, rows, showAmtChecked, Lrnodetails]);

  useEffect(() => {
    if ((isedit && count == 0) || count == 1) {
      getLrDetails(selectedIds);
    }
  }, [selectedIds]);
  const getDCforupadte = async () => {
    setIsLoading(true);
    try {
      const response = await getloadingsheetFreightbyid(id);
      const { data } = response;
      if (data) {
        const selectedIds = data.transectEntries.map((entry) => entry.lr_id);
        const showAmtIds = data.transectEntries
          .filter((entry) => entry.showamount_flag == 1)
          .map((entry) => entry.lr_id);
        setShowAmtIds(showAmtIds);
        setSelectedIds(selectedIds);
        setFormState({
          totHireRs: data.hire,
          extraWtChar: data.extra_wt_ch,
          hamali: data.hamali,
          commission: data.commission,
          advAmt: data.adv_amt,
          driverChar: data.driver_charges,
          dieselChar: data.diesel_ch,
          total: data.total,
          totalPackages: data.total_packages,
          totalWeight: data.total_wt,
        });
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
      getDCforupadte();
    }
  }, []);
  const fetchData = async () => {
    setIsLoadin(true);
    try {
      let response;
      if (id) {
        response = await getlrforloadingsheetedit(user.branch, id);
      } else {
        response = await getlrforloadingsheet(user.branch, id);
      }
      const { data } = response;
      const filteredLrno = data
        .filter((lr) => lr.id != null && lr.lr_no != null)
        .map((lr) => ({
          id: lr.id,
          lrno: lr.lr_no,
        }));
      setLrno(filteredLrno);
    } catch (error) {
      console.error("Error fetching LR numbers:", error);
    } finally {
      setIsLoadin(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      const updatedSelectedIds = prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id];
      return updatedSelectedIds;
    });
  };

  const handleShowAmtChange = (id) => {
    setShowAmtIds((prevShowAmtIds) =>
      prevShowAmtIds.includes(id)
        ? prevShowAmtIds.filter((showAmtId) => showAmtId !== id)
        : [...prevShowAmtIds, id]
    );
  };
  const handleAddButtonClick = useCallback(() => {
    getLrDetails(selectedIds);
  }, [selectedIds]);

  const getLrDetails = async (selectedIds) => {
    setIsLoading(true);
    setCount((prevCount) => prevCount + 1);
    try {
      const response = await getlrdetailsforloadsheet(selectedIds);
      const { data } = response;
      const dataWithSrno = data.map((item, index) => ({
        ...item,
        Srno: index + 1,
      }));
      setRows(dataWithSrno);
      const lrnodetails = data
        .filter((item) => item.pay_type == "To Pay")
        .map((item) => ({
          lrno: item.lr_no,
          id: item.id,
          total: item.total,
        }));

      setLrnodetails(lrnodetails);
    } catch (error) {
      console.error("Error fetching LR details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      total: calculateTotal({ ...prevState, [name]: value }),
    }));
  }, []);

  const calculateTotal = (data) => {
    const {
      totHireRs,
      extraWtChar,
      hamali,
      commission,
      driverChar,
      dieselChar,
      advAmt,
    } = data;

    const parseOrZero = (value) =>
      isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    let total =
      parseOrZero(totHireRs) +
      parseOrZero(extraWtChar) +
      parseOrZero(hamali) +
      parseOrZero(driverChar);

    // Subtract advAmt, commission, and dieselChar if they are valid numbers
    total -= parseOrZero(advAmt);
    total -= parseOrZero(commission);
    total -= parseOrZero(dieselChar);

    return total.toFixed(2);
  };

  useEffect(() => {
    const totalArticles = rows.reduce(
      (total, row) => total + (row.noofarticles || 0),
      0
    );
    const totalWeight = rows.reduce(
      (total, row) => total + (row.weight || 0),
      0
    );
    setFormState((prevState) => ({
      ...prevState,
      totalPackages: totalArticles,
      totalWeight: totalWeight,
    }));
  }, [rows]);


  const columns = [
    { field: "Srno", headerName: "Srno", flex: 1 },
    { field: "lr_no", headerName: "LR No", flex: 1 },
    { field: "lr_date", headerName: "LR Date", flex: 1 },
    { field: "consigner", headerName: "Consignor", flex: 1 },
    { field: "consignee", headerName: "Consignee", flex: 1 },
    { field: "to_loc", headerName: "To", flex: 1 },
    { field: "noofarticles", headerName: "Total Article", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
    { field: "total", headerName: "LR Amt", flex: 1 ,valueFormatter: (params) => `₹ ${params.value}`},
    // {
    //   field: "showAmt",
    //   headerName: "Show Amt",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Checkbox
    //     checked={showAmtChecked.includes(params.row.id)}
    //       onChange={() => handleShowAmtChange(params.id)}
    //     />
    //   ),
    // },
  ];

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredLrno = lrno.filter((item) =>
    item.lrno.toLowerCase().includes(searchInput.toLowerCase())
  );
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const matchingLrno = filteredLrno.find((item) => {
        const numericPart = item.lrno.split('-').pop(); 
        return numericPart === searchInput;
      });
      if (matchingLrno) {
        handleCheckboxChange(matchingLrno.id);
        setSearchInput("");
      }
    }
  };
  return (
    <>
      {isLoading || isLoadin ? (
        <LoadingSpinner />
      ) : (
        <Paper elevation={3} style={{ padding: "20px", marginLeft: "10px" }}>
        <Grid
    container
    elevation={3}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Grid item>
      <h3>Freight Details</h3>
    </Grid>
    <Grid item style={{ display: "flex", alignItems: "center" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddButtonClick}
        style={{ backgroundColor: '#ffa500', marginRight: '10px' }}
      >
        Add
      </Button>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchInput}
        onKeyDown={handleSearchKeyDown}
        onChange={handleSearchChange}
      />
    </Grid>
  </Grid>

{/* 
 <Grid
    container
    elevation={3}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Grid item>
      <h3>Freight Details</h3>
    </Grid>
    <Grid item style={{ display: "flex", alignItems: "center" }}>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchInput}
        onChange={handleSearchChange}
        style={{ marginRight: '10px' }} // Add marginRight to the TextField
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddButtonClick}
        style={{ backgroundColor: '#ffa500' }}
      >
        Add
      </Button>
    </Grid>
  </Grid>
 */}

          <Grid container spacing={2}>
          <Grid item xs={12}>
  <div
    style={{
      maxHeight: "170px",
      border: "1px solid #ccc",
      padding: "10px",
      display: "flex",
      flexWrap: "wrap",
      overflow: "auto",
    }}
  >
    {filteredLrno.map((item, idx) => {
      return (
        <div
          key={item.id}
          style={{
            width: "calc(100% / 6 - 10px)", 
            marginBottom: "2px", 
            display: "flex",  
            alignItems: "center", 
            whiteSpace: "nowrap" 
          }}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
            style={{ marginRight: "20px",width: "20px",  
              height: "20px" }} 
          />
          <label style={{ fontSize: "17px", fontWeight:'normal' }}>{item.lrno}</label>
        </div>
      );
    })}
  </div>
</Grid>



            {/* <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddButtonClick}
                style={{backgroundColor:'#ffa500'}}

              >
                Add
              </Button>
            </Grid> */}
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
            <Grid item xs={12} md={2}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Grid container spacing={2}>
                  <h4>Charges</h4>
                  <Grid item xs={12}>
                    <TextField
                      name="totHireRs"
                      label="Tot Hire Rs"
                      fullWidth
                      size="small"
                      value={formState.totHireRs}
                      onChange={handleFormChange}
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
                      name="extraWtChar"
                      label="Extra_Wt_Char"
                      fullWidth
                      size="small"
                      value={formState.extraWtChar}
                      onChange={handleFormChange}
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
                      name="hamali"
                      label="Hamali"
                      fullWidth
                      size="small"
                      value={formState.hamali}
                      onChange={handleFormChange}
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
                      name="commission"
                      label="Commission"
                      fullWidth
                      size="small"
                      value={formState.commission}
                      onChange={handleFormChange}
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
                      name="advAmt"
                      label="Adv. Amt"
                      fullWidth
                      size="small"
                      value={formState.advAmt}
                      onChange={handleFormChange}
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
                      name="driverChar"
                      label="Driver_char"
                      fullWidth
                      size="small"
                      value={formState.driverChar}
                      onChange={handleFormChange}
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
                      name="dieselChar"
                      label="Diesel_char"
                      fullWidth
                      size="small"
                      value={formState.dieselChar}
                      onChange={handleFormChange}
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
                    <FormControl fullWidth>
                      <InputLabel htmlFor="petrolPump">Petrol_Pump</InputLabel>
                      <Select
                        name="petrolPump"
                        label=" Petrol_Pump"
                        defaultValue=""
                        fullWidth
                        size="small"
                        value={formState.petrolPump}
                        onChange={handleFormChange}
                        
                       
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="pump1">Pump 1</MenuItem>
                        <MenuItem value="pump2">Pump 2</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="total"
                      label="Total"
                      fullWidth
                      size="small"
                      value={formState.total}
                      onChange={handleFormChange}
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
          <Grid container spacing={2} sx={{marginTop:"-70px"}}>
            <Grid item xs={6} md={3}>
              <TextField
                name="totalPackages"
                label="Packages"
                fullWidth
                size="small"
                value={formState.totalPackages}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                name="totalWeight"
                label="Weight"
                fullWidth
                size="small"
                value={formState.totalWeight}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default FreightDetails;
