const db = require("../config/dbConfig");

const getUser = (req, res) => {
    const username = 'Shiroli';
    // const username = req.body.username; 

    const query = 'CALL finduser(?)';

    try {
        db.query(query, username, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            console.log(results[0]);
            return  res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};
 const getNewUser = (req, res) => {
    
    const id = parseInt(req.params.branch);
     

    const query = 'CALL listnewuser(?)';
    
    try {
        db.query(query, id, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Server error');
                return;
            }

            console.log(results[0]);
            return    res.json(results[0]);
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).send('Server error');
    }
};


  module.exports = {
 getUser,
 getNewUser
  };