import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Paper,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector } from "react-redux";
import { UpdateEmployees, getEmployeebyid } from "../../../lib/api-employee";
import dayjs from "dayjs";
const bloodGroups = {
  0: "A+",
  1: "A-",
  2: "B+",
  3: "B-",
  4: "O+",
  5: "O-",
  6: "AB+",
  7: "AB-",
};
const UpdateEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    employeeName: "",
    correspAddress: "",
    permanentAddress: "",
    dateOfBirth: null,
    mobileNo: "",
    emailId: "",
    joiningDate: null,
    qualification: "",
    bloodGroup: "",
    designation: "",
    branch: user.branch || null,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };
  const handalCancel = () => {
    navigate("/Employees-List");
  };
  const fetchdata = async () => {
    try {
      const response = await getEmployeebyid(id);
      const employee = response.data[0];
      console.log(employee);
      if (employee) {
        setFormData({
          employeeName: employee.employee_name,
          correspAddress: employee.corresp_address,
          dateOfBirth: employee.date_of_birth,
          emailId: employee.emailid,
          joiningDate: employee.joining_date,
          permanentAddress: employee.permanat_address,
          qualification: employee.qualification,
          mobileNo: employee.mobileno,
          bloodGroup: employee.blood_group,
          designation: employee.designation,
          branch: employee.branch,
        });
      } else {
        console.log("Driver data is null or undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await UpdateEmployees(id, formData);
      console.log("Place updated successfully:", response.data);
      navigate("/Employees-List");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("hiiii", id);
      fetchdata();
    }
  }, []);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <h1>Update Employee</h1>
      </Grid>
      <Paper elevation={3} style={{ padding: "16px", width: "100%" }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Grid item xs={5}>
              <TextField
                id="employeeName"
                name="employeeName"
                variant="outlined"
                label="Employee Name"
                size="small"
                fullWidth
                value={formData.employeeName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="correspAddress"
                name="correspAddress"
                variant="outlined"
                label="Corresp Address"
                size="small"
                fullWidth
                value={formData.correspAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="permanentAddress"
                name="permanentAddress"
                variant="outlined"
                label="Permanant Address"
                size="small"
                fullWidth
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="dateOfBirth"
                    value={dayjs(formData.dateOfBirth)}
                    onChange={(date) => handleDateChange("dateOfBirth", date)}
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "Date Of Birth",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="mobileNo"
                name="mobileNo"
                variant="outlined"
                label="Mobile No"
                size="small"
                fullWidth
                value={formData.mobileNo}
                onChange={handleChange}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="emailId"
                name="emailId"
                variant="outlined"
                label="Email Id"
                size="small"
                fullWidth
                value={formData.emailId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="joiningDate"
                    value={dayjs(formData.joiningDate)}
                    onChange={(date) => handleDateChange("joiningDate", date)}
                    format="MM-DD-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "Joining Date",
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="qualification"
                name="qualification"
                variant="outlined"
                label="Qualification"
                size="small"
                fullWidth
                value={formData.qualification}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  labelId="bloodGroup"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? bloodGroups[selected] : "Blood Group"
                  }
                >
                  <MenuItem value="">Select Blood Group</MenuItem>
                  <MenuItem value={"0"}>A+</MenuItem>
                  <MenuItem value={"1"}>A-</MenuItem>
                  <MenuItem value={"2"}>B+</MenuItem>
                  <MenuItem value={"3"}>B-</MenuItem>
                  <MenuItem value={"4"}>O+</MenuItem>
                  <MenuItem value={"5"}>O-</MenuItem>
                  <MenuItem value={"6"}>AB+</MenuItem>
                  <MenuItem value={"7"}>AB-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5} style={{ marginTop: "16px" }}>
              <TextField
                id="designation"
                name="designation"
                variant="outlined"
                label="Designation"
                size="small"
                fullWidth
                value={formData.designation}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "16px" }}
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handalCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default UpdateEmployee;
