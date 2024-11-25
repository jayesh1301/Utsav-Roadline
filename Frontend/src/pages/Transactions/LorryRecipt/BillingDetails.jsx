import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  styled,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { SelectBranch } from "../../../lib/api-branch";
import { useSelector } from "react-redux";
const ResizableTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    // Default size settings
    height: "30px", // Set the default height
    overflow: "auto", // Scroll if content exceeds
    resize: "both", // Allow resizing
    minHeight: "40px", // Ensure a minimum height
  },
  // Adjusting the wrapper to control resizing behavior
  "& .MuiInputBase-root textarea": {
    height: "auto", // Allow the textarea to grow when resized by user
    maxHeight: "none", // No maximum height constraint
    minHeight: "100%",
    textAlign: 'center',
  },
});

const BillingDetails = ({handleBillingData,datatosend}) => {
const [pay,setPay]=useState('TBB')
const [gst,setGST]=useState('Consigner')
const [customer,setCustomer]=useState('Consigner Copy')
const [toBill,settoBill]=useState('Consignor')
const [delivery,setdeliveryType]=useState('Door')
const [material,setmaterialCost]=useState('')
const [remarkss,setremark]=useState('')
const [deliveryD,setdeliveryD]=useState('0')
const [checkboxes, setCheckboxes] = useState({
  whatsapp: false,
  emailConsigner: false,
  emailConsignee: false,
  print: true,
});
  const [formData, setFormData] = useState({
    materialCost: "",
    deliveryType: "",
    deliveryDays: '',
    payType: "",
    collectAt: "",
    gstPayBy: "",
    customerCopy: "",
    toBilled: "",
    remark: "",
  });
  useEffect(() => {
    if (datatosend) {
      setPay(datatosend.pay_type)
      setGST(datatosend.gst_pay_by)
      setCustomer(datatosend.cust_copy)
      settoBill(datatosend.to_billed)
      setdeliveryType(datatosend.delivery_type)
      setmaterialCost(datatosend.material_cost)
      setremark(datatosend.remarks)
      setdeliveryD(datatosend.delivery_days)
      console.log('datatosend.pay_type:', datatosend.pay_type);
        setFormData((prevState) => ({
          ...prevState,
          materialCost: datatosend.material_cost,
          deliveryType:datatosend.delivery_type,
          deliveryDays:datatosend.delivery_days,
          payType:datatosend.pay_type,
          collectAt:datatosend.collect_at_branch,
          gstPayBy:datatosend.gst_pay_by,
          customerCopy:datatosend.cust_copy,
          toBilled:datatosend.to_billed,
          remark:datatosend.remarks
        }));
       
    }
    // setPay(localStorage.getItem("paytype"))
}, [datatosend]);
  const [branch,setBranch]=useState([])
  const user = useSelector(state => state.auth);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleRemarkChange = (event) => {
    const { value } = event.target;
    setremark(value); // Update the local state for remarks
    setFormData((prevFormData) => ({
      ...prevFormData,
      remark: value, // Update the form data state for remarks
    }));
  };
  const handlematerial = (event) => {
    const { value } = event.target;
    setmaterialCost(value); // Update the local state for remarks
    setFormData((prevFormData) => ({
      ...prevFormData,
      materialCost: value, // Update the form data state for remarks
    }));
  };
  const handledeliveryDays = (event) => {
    const { value } = event.target;
    setdeliveryD(value); // Update the local state for remarks
    setFormData((prevFormData) => ({
      ...prevFormData,
      deliveryDays: value, // Update the form data state for remarks
    }));
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
        setFormData({
          ...formData,
          collectAt: userBranch.branch_name,
        });
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  useEffect(() => {
    
    getbranch()
   
  }, []);
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes({
      ...checkboxes,
      [name]: checked,
    });
  };
  const prepareFormData = (formData, checkboxes) => {
  return {
    ...formData,
    ...checkboxes,
  };
};

  useEffect(() => {
    // Ensure formData.payType is set to pay state if user has not changed it
    if (!formData.payType) {
      setFormData(prevFormData => ({
        ...prevFormData,
        payType: pay
      }));
    }
    if (!formData.gstPayBy) {
      setFormData(prevFormData => ({
        ...prevFormData,
        gstPayBy: gst
      }));
    }
    if (!formData.customerCopy) {
      setFormData(prevFormData => ({
        ...prevFormData,
        customerCopy: customer
      }));
    }
    if (!formData.toBilled) {
      setFormData(prevFormData => ({
        ...prevFormData,
        toBilled: toBill
      }));
    }
    if (!formData.deliveryType) {
      setFormData(prevFormData => ({
        ...prevFormData,
        deliveryType: delivery
      }));
    }
    if (!formData.materialCost) {
      setFormData(prevFormData => ({
        ...prevFormData,
        materialCost: material
      }));
    }
    if (!formData.remark) {
      setFormData(prevFormData => ({
        ...prevFormData,
        remark: remarkss
      }));
    }
    const combinedData = prepareFormData(formData, checkboxes);
    handleBillingData(combinedData);
  }, [formData, checkboxes,pay,gst,customer,toBill,delivery,material,remarkss]);
//console.log("checkboxes",checkboxes)

  return (
    <>
      <h2>Billing Details</h2>
      <Paper elevation={3} style={{ padding: 20, marginLeft: "10px" }}>
        <Grid container spacing={2}>
          
       <Grid item xs={2}>
  <FormControl fullWidth>
    <TextField
      id="material-cost-input"
      name="materialCost"
      type="number"
      label="Material Cost "
      fullWidth
      size="small"
      value={formData.materialCost || material}
      onChange={handlematerial}
      placeholder="₹"
      InputLabelProps={{
        shrink: true,
      }}
    />
  </FormControl>
</Grid> 


          <Grid item xs={2}>
  <FormControl fullWidth>
    <InputLabel htmlFor="delivery-type-select">Delivery Type</InputLabel>
    <Select
      id="delivery-type-select"
      name="deliveryType"
      label="Delivery Type"
      fullWidth
      size="small"
      value={formData.deliveryType || delivery}
      onChange={handleInputChange}
    >
      <MenuItem value="Door">Door</MenuItem>
      <MenuItem value="Standard">Standard</MenuItem>
      <MenuItem value="Express">Express</MenuItem>
    </Select>
  </FormControl>
</Grid>

          <Grid item xs={2}>
          
            <TextField
              id="delivery-days-input"
              name="deliveryDays"
              label="Delivery (in days)"
              fullWidth
              size="small"
              value={formData.deliveryDays || deliveryD}
              onChange={handledeliveryDays}
            />
          </Grid>
          <Grid item xs={2}>
          <FormControl fullWidth >
          <InputLabel shrink htmlFor="pay-type-select">Pay Type</InputLabel>
            <Select
              id="pay-type-select"
              label="Pay Type"
              name="payType"
              fullWidth
              size="small"
              value={formData.payType || pay}
              onChange={handleInputChange}
            >
              <MenuItem value="To Pay">To Pay</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="TBB">TBB</MenuItem>
              <MenuItem value="FOC">FOC</MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
      
            <TextField
              id="material-cost-input"
              name="collectAt"
              label="Collect At"
              fullWidth
              size="small"
              value={formData.collectAt}
              onChange={handleInputChange}
              disabled
            />
           
          </Grid>
          <Grid item xs={2}>
          <FormControl fullWidth >
          <InputLabel shrink htmlFor="gst-pay-by-select">GstPayBy</InputLabel>
            <Select
              id="gst-pay-by-select"
              label="GstPayBy"
              name="gstPayBy"
              fullWidth
              size="small"
              value={formData.gstPayBy || gst}
              onChange={handleInputChange}
            >
              <MenuItem value="Consigner">Consignor</MenuItem>
              <MenuItem value="Consignee">Consignee</MenuItem>
              <MenuItem value="Transporter">Transporter</MenuItem>
              <MenuItem value="Exempted">Exempted</MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
          <FormControl fullWidth>
          <InputLabel shrink htmlFor="customer-copy-select">Customer Copy:</InputLabel>
            <Select
              id="customer-copy-select"
              label="Customer Copy"
              name="customerCopy"
              fullWidth
              size="small"
              value={formData.customerCopy ||customer }
              onChange={handleInputChange}
            >
              <MenuItem value="Consigner Copy">Consignor Copy</MenuItem>
              <MenuItem value="Consignee Copy">Consignee Copy</MenuItem>
              <MenuItem value="Acknowledge Copy">Acknowledge Copy</MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
          <FormControl fullWidth>
          <InputLabel shrink htmlFor="to-billed-select">ToBilled:</InputLabel>
            <Select
              id="to-billed-select"
              label="ToBilled"
              name="toBilled"
              fullWidth
              size="small"
              value={formData.toBilled || toBill}
              onChange={handleInputChange}
            >
              <MenuItem value="Consignor">Consignor</MenuItem>
              <MenuItem value="Consignee">Consignee</MenuItem>
              <MenuItem value="Third Party">Third Party</MenuItem>
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
    
            <ResizableTextField
              id="remark-input"
              name="remark"
              label="Remark"
              fullWidth
              size="small"
              value={formData.remark || remarkss}
              onChange={handleRemarkChange}
            />
          </Grid>
          <Grid item xs={5} style={{ marginLeft: 16 }}>
          <FormControlLabel
         control={
          <Checkbox
            name="whatsapp"
            checked={checkboxes.whatsapp}
            onChange={handleCheckboxChange}
            disabled size="small"
          />
        }
        label="WhatsApp"
          />
          <FormControlLabel
          control={
            <Checkbox
              name="emailConsigner"
              checked={checkboxes.emailConsigner}
              onChange={handleCheckboxChange}
              size="small"
            />
          }
          label="Consignor Mail"
          />
          <FormControlLabel
           control={
            <Checkbox
              name="emailConsignee"
              checked={checkboxes.emailConsignee}
              onChange={handleCheckboxChange}
            size="small"
            />
          }
          label="Consignee Mail"
          />
          <FormControlLabel
          control={
            <Checkbox
              name="print"
              checked={checkboxes.print}
              onChange={handleCheckboxChange}
            size="small"
            />
          }
          label="Print"
          
          />
        </Grid>
          
        </Grid>
        
      </Paper>
    </>
  );
};

export default BillingDetails;
