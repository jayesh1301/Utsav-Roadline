const db = require("../config/dbConfig");

const getprofile = (req, res) => {
    const query = 'CALL getprofile()';

    try {
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

           return res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};
const getprofilebyid = (req, res) => {
    const id= req.params.id
     const query = 'CALL getprofilebyid(?)';
 
     try {
         db.query(query, id,(err, results) => {
             if (err) {
                 console.error('Error executing query:', err);
                 res.status(500).send('Server error');
                 return;
             }
 
          
            return res.json(results[0]);
         });
     } catch (err) {
         console.error('Error:', err);
         return  res.status(500).send('Server error');
     }
 };
 const UpadteProfile = (req, res) => {
    const { id } = req.params; 
    
    const { emailid, address,isbcc } = req.body; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailid)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
     const query = 'CALL updateprofile(?, ?,?, ?, @message)';
    
    try {
        db.query(query, [id, emailid, address,isbcc], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            db.query('SELECT @message as message', (err, result) => {
                if (err) {
                    console.error('Error retrieving message:', err);
                    res.status(500).send('Server error');
                    return;
                }

return   res.json({ message: result[0].message });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        return  res.status(500).send('Server error');
    }
};

  module.exports = {
    getprofile,
    getprofilebyid,
    UpadteProfile
  };