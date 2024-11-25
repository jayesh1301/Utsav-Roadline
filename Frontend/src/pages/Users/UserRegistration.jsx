import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import { getNewUser } from "../../lib/api-user";
import { SelectBranch } from "../../lib/api-branch";
import{ useSelector }from'react-redux';
const UserRegistration = () => {
  const navigate = useNavigate();
const [branch,setBranch]=useState([])
const [selectedBranch, setSelectedBranch] = useState(null);
const [rows, setRows] = useState([]);
const user = useSelector(state => state.auth);
 
  

  const columns = [
    { field: "srNo", headerName: "Sr. No", flex: 1 },
    { field: "employee_name", headerName: "Employee Name", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "password", headerName: "Password", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "country", headerName: "Options", flex: 1 },
    { field: "email", headerName: "	Actions", flex: 1 },
  ];

  const rowsWithSrNo = rows.map((row, index) => ({ ...row, srNo: index + 1 }));

  const handleAddUserClick = () => {
    navigate("/new-user-registration");
  };
  const getbranch = async () => {
    try {
      const response = await SelectBranch();
      const { data } = response;
console.log(data)
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
  const getdata = async () => {
    const branch=10
    try {
      const response = await getNewUser(user.branch);
      const { data } = response;
      const rowsWithSrNo = data.map((data, index) => ({
        ...data,
        srNo: index + 1,
        id: data.id,
      }));
      
      setRows(rowsWithSrNo);
      
    } catch (error) {}
  };
  useEffect(() => {
    getdata();
    getbranch()
  }, []);
  const handleBranchChange = (event, newValue) => {
    if (newValue) {
      console.log("Selected Branch ID:", newValue.branch_id);
      setSelectedBranch(newValue);
    } else {
      setSelectedBranch(null);
    }
  };
  return (
    <Grid container justifyContent="center" style={{ marginTop: 20 }}>
      <Grid item xs={12} md={10}>
        <Grid container direction="column" alignItems="center">
          <h1>User List</h1>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddUserClick}
                style={{backgroundColor:'#ffa500'}}
              >
                Register User
              </Button>
            </Grid>
            <Grid item xs={3}>
            <Autocomplete
                options={branch}
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
            <Grid item xs={4}>
              <TextField
                label="Search"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon style={{ color: "black" }} />,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div style={{ width: "100%", marginTop: 20 }}>
        <DataGrid
          autoHeight
          density="compact"
          rows={rowsWithSrNo}
          columns={columns}
          pageSize={5}
        />
      </div>
    </Grid>
  );
};

export default UserRegistration;
