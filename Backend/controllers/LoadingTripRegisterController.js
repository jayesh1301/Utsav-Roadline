const db = require("../config/dbConfig");


const getlslistforreportbydate = (req, res) => {

  const formattedFromDate = req.query.formattedFromDate; 
  let formattedToDate =req.query.formattedToDate; 
  const page = parseInt(req.query.page) || 0;
 const  dcnoSearchTerm = req.query.value ? req.query.value.toString() : '';
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = page * pageSize;
  let toDate = new Date(formattedToDate);
toDate.setDate(toDate.getDate() + 1);
formattedToDate = toDate.toISOString().split('T')[0];

  const query = 'CALL getlslistforreportbydate(?,?)';
  

  try {
    db.query(query, [ formattedFromDate, formattedToDate], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server error');
        return;
      }
      
      let LoadingTripRegister = results[0];
      
      if (dcnoSearchTerm) {
        LoadingTripRegister = LoadingTripRegister.filter(item =>
          item.dc_no && item.dc_no.toString().includes(dcnoSearchTerm) || 
          item.dc_date && item.dc_date.toString().includes(dcnoSearchTerm) ||
          item.hire && item.hire.toString().includes(dcnoSearchTerm) ||
          item.total && item.total.toString().includes(dcnoSearchTerm) ||
          item.total_packages && item.total_packages.toString().includes(dcnoSearchTerm) ||
          item.total_wt && item.total_wt.toString().includes(dcnoSearchTerm) ||
          item.vehicleno && item.vehicleno.toString().includes(dcnoSearchTerm) ||
          item.vehical_owner_name && item.vehical_owner_name.toString().includes(dcnoSearchTerm) ||
          item.driver_name && item.driver_name.toString().includes(dcnoSearchTerm) ||
          item.from && item.from.toString().includes(dcnoSearchTerm) ||
          item.to && item.to.toString().includes(dcnoSearchTerm) 
        );
      }

      const total = LoadingTripRegister.length;
      const paginatedloadingtrip = LoadingTripRegister.slice(offset, offset + pageSize);
     return res.json({
        Loadingtripregister: paginatedloadingtrip,
        total: total
      });
    });
  } catch (err) {
    console.error('Error:', err);
   return res.status(500).send('Server error');
  }
};
const getlslistforreportbydatesearch = (req, res) => {
  const branch = req.params.branch;
  const formattedFromDate = req.query.formattedFromDate; 
  let formattedToDate =req.query.formattedToDate; 
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  const lrnoSearchTerm = req.query.lrno ? req.query.lrno.toString() : '';
  const VehicleOwnerTerm = req.query.selectedVehicleOwner ? req.query.selectedVehicleOwner.toLowerCase() : '';
  const offset = page * pageSize;
  let toDate = new Date(formattedToDate);
toDate.setDate(toDate.getDate() + 1);
formattedToDate = toDate.toISOString().split('T')[0];

  const query = 'CALL getlslistforreportbydateforsearch(?,?,?)';
  

  try {
    db.query(query, [ formattedFromDate, formattedToDate,lrnoSearchTerm], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server error');
        return;
      }
      
      let LoadingTripRegister = results[0];



      
      if (VehicleOwnerTerm) {
        LoadingTripRegister = LoadingTripRegister.filter(item =>
          item.vehical_owner_name && item.vehical_owner_name.toLowerCase().includes(VehicleOwnerTerm)
        );
      }

      const total = LoadingTripRegister.length;
      const paginatedloadingtrip = LoadingTripRegister.slice(offset, offset + pageSize);
     return res.json({
        Loadingtripregister: paginatedloadingtrip,
        total: total
      });
    });
  } catch (err) {
    console.error('Error:', err);
   return res.status(500).send('Server error');
  }
};



  module.exports = {
    getlslistforreportbydate,
    getlslistforreportbydatesearch
  };