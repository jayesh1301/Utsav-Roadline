const db = require("../config/dbConfig");
const getallVehicle = (req, res) => {
    // Assuming req.body.branch contains the branch parameter, or null if not provided
    const branch =  null; // Replace with your actual branch value if needed

    const query = 'CALL getallvehicles(?)';
    
    try {
        db.query(query, [branch], async (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            const vehicles = results[0];

            // Mapping the data to extract necessary fields
            const vehicleList = vehicles.map((vehicle) => ({
                vehicle_id: vehicle.vehicle_id,
                vehicleno: vehicle.vehicleno,
                vehical_owner_name: vehicle.vehical_owner_name,
                address: vehicle.address,
                telephoneno:vehicle.telephoneno,
                vehicleownerid:vehicle.vo_id
            }));

           return res.json(vehicleList); // Send the mapped data as response
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};

const getallVehicles = (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const offset = page * pageSize;
    const searchTerm = req.query.search; 
const branch=req.query.branch

    const query = 'CALL getallvehicles(?)';
    
    try {
        db.query(query,branch, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            let vehicle = results[0];

            if (searchTerm) {
                vehicle = vehicle.filter(vehicle => 
                    (vehicle.vehicleno && vehicle.vehicleno.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (vehicle.vehical_owner_name && vehicle.vehical_owner_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (vehicle.address && vehicle.address.toLowerCase().includes(searchTerm.toLowerCase())) 
                    
                );
            }

            vehicle.reverse(); 

            const total = vehicle.length;
            vehicle = vehicle.map(vehicle => ({
                ...vehicle,
                vehicleno: vehicle.vehicleno.toUpperCase(),
                vehical_owner_name: vehicle.vehical_owner_name ? vehicle.vehical_owner_name.toUpperCase() : null,
                address: vehicle.address ? vehicle.address.toUpperCase() : null,
            

            }));
            const paginatedPlaces = vehicle.slice(offset, offset + pageSize);

           return res.json({
                vehicle: paginatedPlaces,
                total: total
            });
        });
    } catch (err) {
        console.error('Error:', err);
       return res.status(500).send('Server error');
    }
};
 const getVehiclebyid = (req, res) => {
   // const id = '4250';
     const id = req.params.id.toString(); 

    const query = 'CALL getvehiclebyid(?)';

    try {
        db.query(query, id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

          return  res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
      return  res.status(500).send('Server error');
    }
};


const AddVehicle = (req, res) => {
  

    const {
        vehicleOwnerName,
        vehicleType,
        vehicleNo,
        capacity,
        make,
        description,
        regDate,
        expDate,
        engineNo,
        chasisNo,
        pucNo,
        pucExpDate,
        body,
        remark,
        branch
    } = req.body;
    const formattedregDate = new Date(regDate).toLocaleDateString('en-IN').split('/').reverse().join('-');
    const formattedexpDate = new Date(expDate).toLocaleDateString('en-IN').split('/').reverse().join('-');
    const formattedpucExpDate = new Date(pucExpDate).toLocaleDateString('en-IN').split('/').reverse().join('-');
    const query = `
        SET @message = '';
        CALL insertvehicledetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @message);
        SELECT @message as message;
    `;

    try {
        db.query(query, [
            vehicleOwnerName, 
            vehicleNo,        
            make,             
            formattedregDate,          
            engineNo,         
            vehicleType,      
            capacity,         
            chasisNo,         
            description,      
            '',          
            '',   
            '',   
            '',       
            '',       
            '',         
            remark,           
            branch,           
            formattedexpDate,          
            pucNo,            
            formattedpucExpDate,       
            body              
        ], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            const message = results[1][0].message;
            console.log(`Message: ${message}`);
           return res.json({ message });
        });
    } catch (err) {
        console.error('Error:', err);
       return res.status(500).send('Server error');
    }
};




const UpdateVehicle = (req, res) => {

    const branchid=req.params.branch

   const id=req.params.id
    const {
        vehicleOwnerName,
        vehicleType,
        vehicleNo,
        capacity,
        make,
        description,
        regDate,
        expDate,
        engineNo,
        chasisNo,
        pucNo,
        pucExpDate,
        body,
        remark,
        
    } = req.body;
    const formattedregDate = new Date(regDate).toLocaleDateString('en-IN').split('/').reverse().join('-');
    const formattedexpDate = new Date(expDate).toLocaleDateString('en-IN').split('/').reverse().join('-');
    const formattedpucExpDate = new Date(pucExpDate).toLocaleDateString('en-IN').split('/').reverse().join('-');
    const query = `
        SET @message = '';
        CALL updatevehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @message);
        SELECT @message as message;
    `;

    try {
        db.query(query, [
            id,
            vehicleOwnerName, 
            vehicleNo,        
            make,             
            formattedregDate,          
            engineNo,         
            vehicleType,      
            capacity,         
            chasisNo,         
            description,      
            '',          
            '',   
            '',   
            '',       
            '',       
            '',         
            remark,           
            branchid,           
            formattedexpDate,          
            pucNo,            
            formattedpucExpDate,       
            body              
        ], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            // Extract the message from the results
            const message = results[2][0].message;
            console.log(`Message: ${message}`);
          return  res.json({ message });
        });
    } catch (err) {
        console.error('Error:', err);
       return res.status(500).send('Server error');
    }
};



const deletevehicle = (req, res) => {
    const id = req.params.id.toString();
    console.log('Vehicle ID:', id);

    const query = `
        SET @message = '';
        CALL deletevehicle(?, @message);
        SELECT @message AS message;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
            return;
        }


        // The message is in the second result set
        let message = 'No message';
        if (results.length > 1) {
            // The second item in results should be the message result set
            const messageResult = results[1];
            if (messageResult.length > 0) {
                message = messageResult[0].message;
            }
        }

        console.log(`Message: ${message}`);
        return res.json({ message });
    });
};


  module.exports = {
    getallVehicle,
    getVehiclebyid,
    UpdateVehicle,
    deletevehicle,
    AddVehicle,
    getallVehicles
  };